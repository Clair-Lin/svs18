<template>
  <div class="device-inspect-panel">
    <el-alert
      type="info"
      :closable="false"
      show-icon
      class="device-inspect-items-alert"
    >
      <span class="device-inspect-items-line">自检项目包括：{{ inspectItemsText }}</span>
    </el-alert>

    <div class="inspect-config-panel">
      <div class="inspect-config-panel__action-row">
        <div class="inspect-config-panel__action-end" style="margin-left: 0">
          <el-button
            type="primary"
            :loading="detecting"
            :disabled="detecting"
            @click="runInspect"
          >
            {{ detecting ? '自检中...' : '开始设备自检' }}
          </el-button>
        </div>
      </div>
    </div>

    <InspectResultsPanel
      ref="resultsRef"
      title="自检结果"
      :detecting="detecting"
      :summary="summary"
      :progress-shown="progressShown"
      :progress-status="progressStatus"
      :progress-status-type="progressStatusType"
      :result-categories="resultCategories"
      :stats="inspectItemStats"
      :idle-hint="idleHint"
      @export="exportReport"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import InspectResultsPanel from '@/components/inspect/InspectResultsPanel.vue'
import {
  DEVICE_INSPECT_ITEMS,
  ALL_DEVICE_ITEM_IDS,
  buildDeviceInspectResults,
  groupDeviceResultsByCategory,
  appendInspectHistory
} from '@/utils/inspectCenter'

const emit = defineEmits(['history-updated'])

const detecting = ref(false)
const progress = ref(0)
const progressStatus = ref('')
const summary = ref(null)
const resultCategories = ref([])
const inspectItemStats = ref({ total: 0, ok: 0, warn: 0, bad: 0 })
const resultsRef = ref(null)

let detectTimer = null

const idleHint = '请点击【开始设备自检】执行密码机内部健康检查（含内置密码卡状态）。'

const inspectItemsText = computed(() =>
  DEVICE_INSPECT_ITEMS.map((item) => item.name).join('、')
)

const progressShown = computed(() => (detecting.value ? progress.value : summary.value ? 100 : 0))

const progressStatusType = computed(() => {
  if (detecting.value) return undefined
  if (summary.value && summary.value.failed === 0) return 'success'
  if (summary.value && summary.value.failed > 0) return 'exception'
  return undefined
})

function clearResults () {
  if (detectTimer) {
    clearInterval(detectTimer)
    detectTimer = null
  }
  detecting.value = false
  summary.value = null
  resultCategories.value = []
  inspectItemStats.value = { total: 0, ok: 0, warn: 0, bad: 0 }
  progress.value = 0
  progressStatus.value = ''
  resultsRef.value?.resetExpanded()
}

function buildSteps (itemIds) {
  const defs = itemIds.map((id) => DEVICE_INSPECT_ITEMS.find((i) => i.id === id)).filter(Boolean)
  const steps = defs.map((d, i) => ({
    progress: Math.round(((i + 1) / defs.length) * 95),
    status: `正在执行${d.name}...`
  }))
  steps.push({ progress: 100, status: '自检完成' })
  return steps
}

function exportReport () {
  if (!summary.value) {
    ElMessage.warning('请先执行设备自检')
    return
  }
  ElMessage.success('报告导出为原型占位，实际环境可对接导出接口')
}

function runInspect () {
  const itemIds = [...ALL_DEVICE_ITEM_IDS]
  clearResults()
  detecting.value = true
  const steps = buildSteps(itemIds)
  let stepIndex = 0

  detectTimer = setInterval(() => {
    if (stepIndex < steps.length) {
      progress.value = steps[stepIndex].progress
      progressStatus.value = steps[stepIndex].status
      stepIndex++
    } else {
      clearInterval(detectTimer)
      detectTimer = null
      detecting.value = false

      const built = buildDeviceInspectResults(itemIds)
      resultCategories.value = groupDeviceResultsByCategory(built.items)
      const bad = built.failed
      const ok = built.passed
      inspectItemStats.value = { total: built.total, ok, warn: 0, bad }
      summary.value = {
        total: built.total,
        passed: ok,
        warning: 0,
        failed: bad,
        time: built.time,
        targetLabel: built.targetLabel
      }

      appendInspectHistory({
        inspectType: 'device',
        trigger: 'manual',
        triggerLabel: '手动',
        scopeMode: 'all',
        scopeItems: itemIds,
        overallStatus: bad > 0 ? '异常' : '正常',
        finishedAt: built.time,
        itemCount: built.total,
        passedCount: ok,
        failedCount: bad,
        detailItems: built.items,
        resultCategories: resultCategories.value,
        summary: { ...summary.value }
      })
      emit('history-updated')
    }
  }, 200)
}
</script>

<style lang="scss" scoped>
@import '@/styles/inspect-panel-config.scss';

.device-inspect-items-alert {
  margin-bottom: 16px;

  :deep(.el-alert__content) {
    width: 100%;
  }
}

.device-inspect-items-line {
  font-size: 13px;
  line-height: 1.6;
  color: var(--el-text-color-regular);
}
</style>
