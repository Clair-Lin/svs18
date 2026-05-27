<template>
  <div class="inspect-schedule-panel">
    <el-alert type="info" :closable="false" show-icon class="inspect-schedule-panel__alert">
      定时策略仅作用于<strong>设备自检</strong>。失败告警功能将在告警模块上线后生效。
    </el-alert>

    <el-form
      ref="formRef"
      :model="form"
      label-width="140px"
      class="schedule-form"
    >
      <el-form-item label="启用定时自检">
        <el-switch v-model="form.enabled" />
      </el-form-item>

      <template v-if="form.enabled">
        <el-form-item label="执行周期">
          <el-radio-group v-model="form.scheduleType">
            <el-radio label="daily">每天</el-radio>
            <el-radio label="weekly">每周</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="form.scheduleType === 'weekly'" label="星期">
          <el-select v-model="form.weekDay" style="width: 200px">
            <el-option
              v-for="opt in weekOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="执行时刻">
          <el-time-picker
            v-model="timeValue"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="选择时刻"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="失败时告警">
          <el-switch v-model="form.onFailureEnabled" disabled />
          <span class="field-hint">（告警模块上线后生效）</span>
        </el-form-item>
      </template>

      <el-form-item label="策略说明">
        <span class="readonly-text">{{ describeSchedule(form) }}</span>
      </el-form-item>

      <el-form-item label="下次执行（预估）">
        <span class="readonly-text">{{ nextRunDisplay }}</span>
      </el-form-item>

      <el-form-item label="上次执行">
        <span class="readonly-text">{{ lastRunText }}</span>
      </el-form-item>

      <el-form-item label=" ">
        <el-button type="primary" :loading="saving" @click="handleSave">保存定时策略</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  loadInspectSchedule,
  saveInspectSchedule,
  describeSchedule,
  computeNextRunDisplay,
  loadInspectHistory
} from '@/utils/inspectCenter'

const props = defineProps({
  historyVersion: { type: Number, default: 0 }
})

const formRef = ref(null)
const saving = ref(false)
const timeValue = ref('02:00')

const weekOptions = [
  { label: '周日', value: 0 },
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 }
]

const form = reactive({
  enabled: false,
  scheduleType: 'daily',
  time: '02:00',
  weekDay: 1,
  scopeMode: 'all',
  scopeItems: [],
  onFailure: 'alert',
  onFailureEnabled: true,
  notifyChannels: []
})

const nextRunDisplay = computed(() => computeNextRunDisplay(form))

const lastRunText = computed(() => {
  const last = loadInspectHistory().find(
    (h) => h.inspectType === 'device' && h.trigger === 'scheduled'
  )
  if (!last) return '—'
  return `${last.finishedAt} · ${last.overallStatus}（${last.itemCount} 项）`
})

watch(timeValue, (v) => {
  if (v) form.time = v
})

function loadForm () {
  const data = loadInspectSchedule()
  Object.assign(form, {
    enabled: data.enabled,
    scheduleType: data.scheduleType,
    time: data.time,
    weekDay: data.weekDay,
    scopeMode: data.scopeMode,
    scopeItems: [...(data.scopeItems || [])],
    onFailure: data.onFailure,
    onFailureEnabled: data.onFailure === 'alert',
    notifyChannels: data.notifyChannels || []
  })
  timeValue.value = data.time || '02:00'
}

onMounted(loadForm)

watch(
  () => props.historyVersion,
  () => {
    /* 触发 lastRunText 重算 */
  }
)

function handleSave () {
  saving.value = true
  setTimeout(() => {
    saveInspectSchedule({
      enabled: form.enabled,
      scheduleType: form.scheduleType,
      time: form.time,
      weekDay: form.weekDay,
      scopeMode: 'all',
      scopeItems: [],
      onFailure: form.onFailureEnabled ? 'alert' : 'none',
      notifyChannels: form.notifyChannels
    })
    saving.value = false
    ElMessage.success('定时策略已保存')
  }, 300)
}

function handleReset () {
  loadForm()
  ElMessage.info('已恢复为已保存的策略')
}

defineExpose({ loadForm })
</script>

<style lang="scss" scoped>
@import '@/styles/inspect-panel-config.scss';
@import '@/styles/variables.scss';

.inspect-schedule-panel__alert {
  margin-bottom: 20px;
}

.schedule-form {
  max-width: 720px;
}

.readonly-text {
  font-size: 14px;
  color: $text-secondary;
}

.field-hint {
  margin-left: 8px;
  font-size: 12px;
  color: $text-muted;
}
</style>
