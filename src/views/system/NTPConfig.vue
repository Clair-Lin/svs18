<template>
  <div class="ntp-config">
    <div class="page-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="150px"
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
          <div class="ntp-server-row">
            <el-input
              v-model="form.ntpServer"
              class="ntp-server-input"
              clearable
              placeholder="例如 time.edu.cn"
            />
            <el-button :loading="checkingStatus" @click="handleCheckStatus">
              {{ checkingStatus ? '检测中...' : '检测' }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item v-if="form.timeMode === 'ntp'" label="自动更新时间表达式" prop="autoUpdateExpression">
          <el-select v-model="form.autoUpdateExpression" class="ntp-field-wide" placeholder="请选择自动更新时间">
            <el-option
              v-for="opt in AUTO_UPDATE_EXPRESSION_OPTIONS"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.timeMode === 'ntp' && checkResult" label="检测结果">
          <div class="ntp-check-result">
            <div class="ntp-status-line" :class="checkResult.status">
              <span class="ntp-status-dot" />
              <span>{{ checkResult.statusText }}</span>
            </div>
            <div class="ntp-result-grid">
              <span class="ntp-result-label">NTP服务器</span>
              <span>{{ checkResult.server }}</span>
              <span class="ntp-result-label">最近同步时间</span>
              <span>{{ checkResult.syncTime }}</span>
              <span class="ntp-result-label">时间偏差</span>
              <span>{{ checkResult.offset }}</span>
            </div>
          </div>
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
  ntpServer: 'time.edu.cn',
  autoUpdateExpression: 'every-minute'
}

const AUTO_UPDATE_EXPRESSION_OPTIONS = [
  { label: '每分钟执行一次', value: 'every-minute' },
  { label: '每5分钟执行一次', value: 'every-5-minutes' },
  { label: '每10分钟执行一次', value: 'every-10-minutes' },
  { label: '每15分钟执行一次', value: 'every-15-minutes' },
  { label: '每30分钟执行一次', value: 'every-30-minutes' },
  { label: '每小时执行一次', value: 'every-hour' },
  { label: '每2小时执行一次', value: 'every-2-hours' },
  { label: '每天执行一次', value: 'every-day' },
  { label: '每2天执行一次', value: 'every-2-days' },
  { label: '每3天执行一次', value: 'every-3-days' },
  { label: '每4天执行一次', value: 'every-4-days' },
  { label: '每7天执行一次', value: 'every-7-days' },
  { label: '每15天执行一次', value: 'every-15-days' },
  { label: '每30天执行一次', value: 'every-30-days' }
]

function pad (n) {
  return String(n).padStart(2, '0')
}

function formatDateTime (d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const formRef = ref(null)
const submitting = ref(false)
const checkingStatus = ref(false)
const checkResult = ref(null)
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
    ntpServer: [{ required: true, message: '请输入 NTP 服务器地址', trigger: 'blur' }],
    autoUpdateExpression: [{ required: true, message: '请选择自动更新时间表达式', trigger: 'change' }]
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
      ntpServer: saved.ntpServer ?? DEFAULT_FORM.ntpServer,
      autoUpdateExpression: saved.autoUpdateExpression ?? DEFAULT_FORM.autoUpdateExpression
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
      ntpServer: form.ntpServer,
      autoUpdateExpression: form.autoUpdateExpression
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
      ntpServer: form.ntpServer,
      autoUpdateExpression: form.autoUpdateExpression
    }
    submitting.value = false
    ElMessage.success(
      form.timeMode === 'pc'
        ? '时间配置已提交（原型演示）'
        : `已与 NTP 服务器 ${form.ntpServer} 同步配置已保存（原型演示）`
    )
  }, 400)
}

function getTrimmedNtpServer () {
  return String(form.ntpServer ?? '').trim()
}

function validateNtpServerForAction () {
  const server = getTrimmedNtpServer()
  if (!server) {
    ElMessage.warning('请输入 NTP 服务器地址')
    return ''
  }
  if (/\s/.test(server)) {
    ElMessage.warning('NTP 服务器地址不能包含空格')
    return ''
  }
  return server
}

function handleCheckStatus () {
  const server = validateNtpServerForAction()
  if (!server || checkingStatus.value) return
  checkingStatus.value = true
  checkResult.value = null
  setTimeout(() => {
    checkingStatus.value = false
    checkResult.value = {
      status: 'success',
      statusText: '同步状态：正常',
      server,
      syncTime: formatDateTime(new Date()),
      offset: '12 ms'
    }
  }, 500)
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

$ntp-control-width: 500px;

.ntp-form {
  max-width: 820px;

  :deep(.el-form-item__label) {
    color: $text-primary;
    white-space: nowrap;
  }
}

.system-time-text {
  font-size: 14px;
  color: $text-primary;
  line-height: 32px;
}

.ntp-field-wide {
  width: $ntp-control-width;
  max-width: 100%;
}

.ntp-server-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.ntp-server-input {
  flex: 0 0 $ntp-control-width;
  width: $ntp-control-width;
  max-width: 100%;
}


.ntp-check-result {
  width: 100%;
  max-width: 680px;
  padding: 12px 16px;
  border: 1px solid $border-light;
  background: #fafafa;
}

.ntp-status-line {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  font-weight: 500;
  color: $text-primary;

  &.success {
    color: #52c41a;
  }

  &.danger {
    color: #ff4d4f;
  }
}

.ntp-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.ntp-result-grid {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 8px 14px;
  color: $text-primary;
}

.ntp-result-label {
  color: $text-secondary;
}
.form-actions {
  display: flex;
  gap: 12px;
}
</style>
