<template>
  <div class="hot-standby-page page-card">
    <div class="page-header">
      <div>
        <h2>双机热备配置</h2>
        <p class="muted">双机热备用于两台签名验签服务器的主备部署和故障接替，提升服务连续性。</p>
      </div>
    </div>

    <div class="action-bar">
      <el-button icon="Refresh" @click="refreshStatus" circle title="刷新状态" />
      <el-button type="primary" @click="saveConfig" :loading="saving">保存配置</el-button>
      <el-button type="danger" @click="openSwitch" :disabled="!status.enabled">手工切换</el-button>
      <div class="toggle-inline">
        <span class="toggle-label">双机热备</span>
        <el-switch v-model="status.enabled" active-text="启用" inactive-text="停用" @change="toggleEnable" />
      </div>
    </div>

    <el-card class="card">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="状态总览" name="overview">
          <el-row :gutter="20" class="overview-row">
            <el-col :span="10">
              <StatusOverview :data="status" />
            </el-col>
            <el-col :span="14">
              <HealthCheckCard :value="config.healthCheck" :disabled="!status.enabled" @update="onHealthUpdate" />
            </el-col>
          </el-row>
          <div class="sync-panel">
            <SyncConfigCard :value="config.sync" @update="onSyncUpdate" :disabled="!status.enabled" />
          </div>
        </el-tab-pane>

        <el-tab-pane label="基础配置" name="basic">
          <HotStandbyForm ref="formRef" :disabled="!status.enabled" :value="config" @update="onConfigUpdate" />
        </el-tab-pane>

        <el-tab-pane label="切换记录 / 审计日志" name="audit">
          <AuditTable />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <ConfirmSwitchModal ref="switchModal" @confirm="doManualSwitch" />
    <ConfirmDisableModal ref="disableModal" @confirm="doDisable" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import StatusOverview from '@/components/ha/StatusOverview.vue'
import HotStandbyForm from '@/components/ha/HotStandbyForm.vue'
import HealthCheckCard from '@/components/ha/HealthCheckCard.vue'
import SyncConfigCard from '@/components/ha/SyncConfigCard.vue'
import AuditTable from '@/components/ha/AuditTable.vue'
import ConfirmSwitchModal from '@/components/ha/ConfirmSwitchModal.vue'
import ConfirmDisableModal from '@/components/ha/ConfirmDisableModal.vue'

const formRef = ref(null)
const switchModal = ref(null)
const disableModal = ref(null)

const status = reactive({
  enabled: false,
  state: '未启用',
  role: '备机',
  peerState: '离线',
  currentNode: '-',
  vip: '-',
  lastSwitchTime: '-',
  lastSwitchReason: '-',
  lastHealth: '-'
})

const config = reactive({
  enabled: false,
  role: 'secondary',
  primaryIp: '',
  secondaryIp: '',
  vip: '',
  bindInterface: '',
  heartbeatInterface: '',
  authKeyConfigured: false,
  autoSwitch: true,
  autoFallback: false,
  healthCheck: {},
  sync: {}
})

const saving = ref(false)

function load() {
  // API stubs — replace with real endpoints
  fetch('/api/ha/hot-standby').then(r => r.json()).then((d) => {
    Object.assign(status, d.status || {})
    Object.assign(config, d.config || {})
  }).catch(() => {})
}

function refreshStatus() { load() }

function saveConfig() {
  if (!formRef.value) return
  const valid = formRef.value.validate()
  if (!valid) return
  saving.value = true
  fetch('/api/ha/hot-standby', { method: 'PUT', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(config) })
    .then(() => { saving.value = false; load() })
    .catch(() => { saving.value = false })
}

function openSwitch() { switchModal.value.open(status) }
function doManualSwitch(payload) { /* trigger backend */ }
function toggleEnable(val) { if (!val) disableModal.value.open() }

function onConfigUpdate(newVal) { Object.assign(config, newVal) }
function onHealthUpdate(v) { config.healthCheck = v }
function onSyncUpdate(v) { config.sync = v }

onMounted(load)
</script>

<style scoped>
.page-header { margin-bottom: 16px }
.muted { color: var(--el-text-color-secondary); margin: 0 }
.action-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 20px }
.toggle-inline { display: flex; align-items: center; gap: 8px }
.toggle-label { color: var(--el-text-color-secondary); font-size: 14px }
.card { margin-bottom: 0; border-color: transparent; box-shadow: none }
.el-card__body { padding: 0 }
.el-tabs--card .el-tabs__header { border-bottom-color: transparent }
.overview-row { margin-bottom: 20px }
.sync-panel { margin-top: 20px }
</style>
