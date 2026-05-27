<template>
  <div class="ntp-config">
    <div class="page-card">
      <div class="card-title">NTP时间源管理</div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
        class="ntp-form"
      >
        <el-form-item label="当前系统时间">
          <span class="system-time-text">{{ systemTimeDisplay }}</span>
        </el-form-item>

        <el-form-item label="时区" prop="timezone">
          <el-select v-model="form.timezone" class="ntp-field-wide" placeholder="请选择时区">
            <el-option
              v-for="opt in TIMEZONE_OPTIONS"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="时间设置" prop="timeMode">
          <el-radio-group v-model="form.timeMode">
            <el-radio label="pc">使用PC时间</el-radio>
            <el-radio label="ntp">与NTP服务器同步</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="form.timeMode === 'pc'" label="本地时间" prop="localTime">
          <el-date-picker
            v-model="form.localTime"
            type="datetime"
            placeholder="请选择本地时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            class="ntp-field-wide"
          />
        </el-form-item>

        <el-form-item v-else label="NTP服务器" prop="ntpServer">
          <el-input
            v-model="form.ntpServer"
            class="ntp-field-wide"
            clearable
            placeholder="例如 ntp.aliyun.com"
          />
        </el-form-item>

        <el-form-item label=" ">
          <div class="form-actions">
            <el-button type="primary" :loading="submitting" @click="handleSubmit">提交</el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'

const STORAGE_KEY = 'svs_ntp_config'

const TIMEZONE_OPTIONS = [
  { label: '(UTC+08:00) 北京, 重庆, 香港, 乌鲁木齐', value: 'Asia/Shanghai' },
  { label: '(UTC+00:00) 协调世界时', value: 'UTC' },
  { label: '(UTC+09:00) 东京, 首尔', value: 'Asia/Tokyo' },
  { label: '(UTC-05:00) 纽约, 华盛顿', value: 'America/New_York' }
]

const DEFAULT_FORM = {
  timezone: 'Asia/Shanghai',
  timeMode: 'pc',
  localTime: '',
  ntpServer: 'ntp.aliyun.com'
}

function pad (n) {
  return String(n).padStart(2, '0')
}

function formatDateTime (d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const formRef = ref(null)
const submitting = ref(false)
const systemTime = ref(new Date())
const form = reactive({ ...DEFAULT_FORM, localTime: formatDateTime(new Date()) })

const defaultSnapshot = ref({
  ...DEFAULT_FORM,
  localTime: formatDateTime(new Date())
})

const systemTimeDisplay = computed(() => formatDateTime(systemTime.value))

const formRules = computed(() => {
  const base = {
    timezone: [{ required: true, message: '请选择时区', trigger: 'change' }],
    timeMode: [{ required: true, message: '请选择时间设置方式', trigger: 'change' }]
  }
  if (form.timeMode === 'pc') {
    return {
      ...base,
      localTime: [{ required: true, message: '请选择本地时间', trigger: 'change' }]
    }
  }
  return {
    ...base,
    ntpServer: [{ required: true, message: '请输入 NTP 服务器地址', trigger: 'blur' }]
  }
})

let clockTimer = null

function tickSystemTime () {
  systemTime.value = new Date()
}

function loadConfig () {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const saved = JSON.parse(raw)
    Object.assign(form, {
      timezone: saved.timezone ?? DEFAULT_FORM.timezone,
      timeMode: saved.timeMode ?? DEFAULT_FORM.timeMode,
      localTime: saved.localTime ?? formatDateTime(new Date()),
      ntpServer: saved.ntpServer ?? DEFAULT_FORM.ntpServer
    })
    defaultSnapshot.value = { ...form }
  } catch {
    /* ignore */
  }
}

function saveConfig () {
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      timezone: form.timezone,
      timeMode: form.timeMode,
      localTime: form.localTime,
      ntpServer: form.ntpServer
    })
  )
}

onMounted(() => {
  loadConfig()
  tickSystemTime()
  clockTimer = setInterval(tickSystemTime, 1000)
})

onBeforeUnmount(() => {
  if (clockTimer) {
    clearInterval(clockTimer)
    clockTimer = null
  }
})

async function handleSubmit () {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  submitting.value = true
  setTimeout(() => {
    saveConfig()
    defaultSnapshot.value = {
      timezone: form.timezone,
      timeMode: form.timeMode,
      localTime: form.localTime,
      ntpServer: form.ntpServer
    }
    submitting.value = false
    ElMessage.success(
      form.timeMode === 'pc'
        ? '时间配置已提交（原型演示）'
        : `已与 NTP 服务器 ${form.ntpServer} 同步配置已保存（原型演示）`
    )
  }, 400)
}

function handleReset () {
  Object.assign(form, { ...defaultSnapshot.value })
  formRef.value?.clearValidate()
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.ntp-config {
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 24px;
  }
}

.ntp-form {
  max-width: 640px;

  :deep(.el-form-item__label) {
    color: $text-primary;
  }
}

.system-time-text {
  font-size: 14px;
  color: $text-primary;
  line-height: 32px;
}

.ntp-field-wide {
  width: 100%;
  max-width: 420px;
}

.form-actions {
  display: flex;
  gap: 12px;
}
</style>
