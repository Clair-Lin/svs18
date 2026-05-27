<template>
  <div class="service-detect-panel">
    <el-alert type="warning" :closable="false" show-icon class="service-detect-panel__alert">
      检测前请上传 <strong>CA 根证</strong> 和 <strong>证书管理</strong> 里面的证书。密码机本体与密码卡健康请至
      <strong>设备自检</strong> 页签。
    </el-alert>

    <div class="inspect-config-panel">
      <div class="inspect-config-panel__action-row">
        <div class="cert-picker-inline">
          <span class="inspect-config-label">证书</span>
          <el-input
            :model-value="selectedCertDisplay"
            readonly
            placeholder="请选择证书"
            class="cert-picker-input"
            @click="openCertDialog"
          >
            <template #append>
              <el-button @click="openCertDialog">...</el-button>
            </template>
          </el-input>
        </div>
        <div class="inspect-config-panel__action-end">
          <el-tooltip :disabled="!startBlocked" content="请先选择证书" placement="top">
            <span>
              <el-button
                type="primary"
                :loading="detecting"
                :disabled="startDisabled"
                @click="runDetect"
              >
                {{ detecting ? '检测中...' : '开始检测' }}
              </el-button>
            </span>
          </el-tooltip>
        </div>
      </div>
    </div>

    <InspectResultsPanel
      ref="resultsRef"
      title="检测结果"
      :detecting="detecting"
      :summary="summary"
      :progress-shown="progressShown"
      :progress-status="progressStatus"
      :progress-status-type="progressStatusType"
      :result-categories="resultCategories"
      :stats="inspectItemStats"
      :idle-hint="idleHint"
      :top-alert="certAbnormalSummaryHint"
      @export="exportReport"
    />

    <SelectCertificateDialog
      v-model="certDialogVisible"
      :certificates="certPickerList"
      :initial-selected-id="selectedCertId"
      @confirm="onCertSelected"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import SelectCertificateDialog from '@/components/cert/SelectCertificateDialog.vue'
import InspectResultsPanel from '@/components/inspect/InspectResultsPanel.vue'
import { useCertManagePool, mapCertsForPicker } from '@/composables/useCertManagePool'
import { formatDateTime, appendInspectHistory } from '@/utils/inspectCenter'

const emit = defineEmits(['history-updated'])

const DEMO_SIMULATE_CERT_MISSING = false

const { allCerts } = useCertManagePool()
const certPickerList = computed(() => mapCertsForPicker(allCerts.value))

const selectedCertId = ref('')
const selectedCertDisplay = ref('')
const certDialogVisible = ref(false)
const detecting = ref(false)
const progress = ref(0)
const progressStatus = ref('')
const serviceResults = ref([])
const summary = ref(null)
const resultsRef = ref(null)

let detectTimer = null

const CLOUD_SVS_BASE = 'https://192.168.1.100:443'

const SERVICE_INTERFACE_ROWS = [
  { name: '获取服务器证书接口', url: 'https://192.168.1.100:443/api/server-certificate', status: '正常', responseTime: '18ms', detail: '成功获取服务器证书' },
  { name: '服务器签名接口', url: 'http://192.168.1.100:8080/api/sign', status: '正常', responseTime: '15ms', detail: '签名接口响应正常' },
  { name: '服务器验签接口', url: 'http://192.168.1.100:8080/api/verify', status: '正常', responseTime: '14ms', detail: '验签接口响应正常' },
  { name: '获取随机数', url: `${CLOUD_SVS_BASE}/cloud_sign_svs/cert/generateRandom`, status: '正常', responseTime: '12ms', detail: '随机数接口响应正常' },
  { name: '导出证书', url: `${CLOUD_SVS_BASE}/cloud_sign_svs/cert/ExportCert`, status: '正常', responseTime: '16ms', detail: '导出证书接口响应正常' },
  { name: '数据签名', url: `${CLOUD_SVS_BASE}/cloud_sign_svs/cert/SignData`, status: '正常', responseTime: '17ms', detail: '数据签名接口响应正常' },
  { name: '数据验签', url: `${CLOUD_SVS_BASE}/cloud_sign_svs/cert/VerifySignedData`, status: '正常', responseTime: '15ms', detail: '数据验签接口响应正常' }
]

const STEPS = [
  { progress: 14, status: '正在检测获取服务器证书接口...' },
  { progress: 28, status: '正在检测服务器签名接口...' },
  { progress: 42, status: '正在检测服务器验签接口...' },
  { progress: 57, status: '正在检测获取随机数接口...' },
  { progress: 71, status: '正在检测导出证书接口...' },
  { progress: 85, status: '正在检测数据签名接口...' },
  { progress: 94, status: '正在检测数据验签接口...' },
  { progress: 100, status: '检测完成' }
]

const CERT_REUPLOAD_HINT = '未检测到证书，请重新上传。'

const startBlocked = computed(() => !selectedCertId.value)
const startDisabled = computed(() => detecting.value || startBlocked.value)

const idleHint = '请点击【开始检测】执行服务接口检测。'

const progressShown = computed(() => (detecting.value ? progress.value : summary.value ? 100 : 0))

const progressStatusType = computed(() => {
  if (detecting.value) return undefined
  if (summary.value && summary.value.failed === 0) return 'success'
  if (summary.value && summary.value.failed > 0) return 'exception'
  return undefined
})

function isCertRelatedServiceRow (row) {
  const n = String(row.name || '')
  const u = String(row.url || '').toLowerCase()
  if (n.includes('证书')) return true
  if (u.includes('/cert/') || u.includes('certificate')) return true
  if (n.includes('签名') || n.includes('验签')) return true
  return false
}

function buildServiceResultsForRun () {
  const base = SERVICE_INTERFACE_ROWS.map((r) => ({ ...r }))
  if (!DEMO_SIMULATE_CERT_MISSING) return base
  return base.map((row) => {
    if (!isCertRelatedServiceRow(row)) return row
    return {
      ...row,
      status: '异常',
      responseTime: '—',
      detail: '未检测到有效证书或证书链校验失败（原型模拟）',
      certAbnormalUserHint: CERT_REUPLOAD_HINT
    }
  })
}

const certAbnormalSummaryHint = computed(() => {
  if (!summary.value || summary.value.failed === 0) return ''
  const bad = serviceResults.value.filter((r) => r.status !== '正常' && isCertRelatedServiceRow(r))
  if (!bad.length) return ''
  return CERT_REUPLOAD_HINT
})

const resultCategories = computed(() => {
  if (!serviceResults.value.length) return []
  return [{
    name: '服务接口检测',
    items: serviceResults.value.map((r) => ({
      name: r.name,
      label: r.status,
      tagType: r.status === '正常' ? 'success' : 'danger',
      metaLines: [
        `接口地址：${r.url}`,
        `响应时间：${r.responseTime} · ${r.detail}`,
        ...(r.status !== '正常' && r.certAbnormalUserHint ? [r.certAbnormalUserHint] : [])
      ]
    }))
  }]
})

const inspectItemStats = computed(() => {
  let ok = 0
  let bad = 0
  for (const cat of resultCategories.value) {
    for (const it of cat.items) {
      if (it.tagType === 'success') ok++
      else bad++
    }
  }
  return { total: ok + bad, ok, warn: 0, bad }
})

function displayCertName (row) {
  return row?.certName ?? row?.appCertName ?? ''
}

function openCertDialog () {
  certDialogVisible.value = true
}

function onCertSelected (row) {
  selectedCertId.value = row.id
  selectedCertDisplay.value = displayCertName(row)
}

function clearResults () {
  if (detectTimer) {
    clearInterval(detectTimer)
    detectTimer = null
  }
  detecting.value = false
  serviceResults.value = []
  summary.value = null
  progress.value = 0
  progressStatus.value = ''
  resultsRef.value?.resetExpanded()
}

watch(
  allCerts,
  (list) => {
    if (!selectedCertId.value) return
    if (!list.some((c) => c.id === selectedCertId.value)) {
      selectedCertId.value = ''
      selectedCertDisplay.value = ''
    }
  },
  { deep: true }
)

function exportReport () {
  if (!summary.value) {
    ElMessage.warning('请先执行检测')
    return
  }
  ElMessage.success('报告导出为原型占位，实际环境可对接导出接口')
}

function runDetect () {
  if (!selectedCertId.value) {
    ElMessage.warning('请先选择证书后再开始检测')
    return
  }
  clearResults()
  detecting.value = true

  let stepIndex = 0
  detectTimer = setInterval(() => {
    if (stepIndex < STEPS.length) {
      progress.value = STEPS[stepIndex].progress
      progressStatus.value = STEPS[stepIndex].status
      stepIndex++
    } else {
      clearInterval(detectTimer)
      detectTimer = null
      detecting.value = false
      serviceResults.value = buildServiceResultsForRun()
      const passed = serviceResults.value.filter((r) => r.status === '正常').length
      const total = serviceResults.value.length
      const time = formatDateTime(new Date())
      const targetLabel = '本机 192.168.1.100 · 服务接口'
      summary.value = {
        total,
        passed,
        warning: 0,
        failed: total - passed,
        time,
        targetLabel
      }
      appendInspectHistory({
        inspectType: 'service',
        trigger: 'manual',
        triggerLabel: '手动',
        scopeMode: 'all',
        scopeItems: [],
        overallStatus: total - passed > 0 ? '异常' : '正常',
        finishedAt: time,
        itemCount: total,
        passedCount: passed,
        failedCount: total - passed,
        resultCategories: resultCategories.value,
        summary: { ...summary.value }
      })
      emit('history-updated')
    }
  }, 220)
}
</script>

<style lang="scss" scoped>
@import '@/styles/inspect-panel-config.scss';

.service-detect-panel__alert {
  margin-bottom: 12px;
}
</style>
