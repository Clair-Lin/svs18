<template>
  <div class="hot-standby-page page-card">
    <div class="page-header">
      <div>
        <h2>双机热备配置</h2>
        <p class="muted">双机热备用于两台签名验签服务器的主备部署和故障接替，提升服务连续性。</p>
      </div>
      <div class="page-actions">
        <el-button icon="Refresh" @click="refreshStatus" circle title="刷新状态" />
        <el-button type="primary" @click="saveConfig" :loading="saving">保存配置</el-button>
        <el-button type="danger" @click="openSwitch" :disabled="!status.enabled">手工切换</el-button>
        <el-switch v-model="status.enabled" active-text="启用" inactive-text="停用" @change="toggleEnable" />
      </div>
    </div>

    <el-card class="card">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="状态总览" name="overview">
          <el-row :gutter="20">
            <el-col :span="8">
              <StatusOverview :data="status" />
            </el-col>
            <el-col :span="16">
              <el-card>
                <h4>详细状态</h4>
                <el-descriptions column="2" border>
                  <el-descriptions-item label="本机角色">{{status.role}}</el-descriptions-item>
                  <el-descriptions-item label="对端状态">{{status.peerState}}</el-descriptions-item>
                  <el-descriptions-item label="当前服务节点">{{status.currentNode}}</el-descriptions-item>
                  <el-descriptions-item label="服务入口">{{status.vip}}</el-descriptions-item>
                  <el-descriptions-item label="最近切换时间">{{status.lastSwitchTime}}</el-descriptions-item>
                  <el-descriptions-item label="最近切换原因">{{status.lastSwitchReason}}</el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="基础配置" name="basic">
          <HotStandbyForm ref="formRef" :disabled="!status.enabled" :value="config" @update="onConfigUpdate" />
        </el-tab-pane>

        <el-tab-pane label="健康检查与同步" name="health">
          <el-row :gutter="16">
            <el-col :span="12">
              <HealthCheckCard :value="config.healthCheck" :disabled="!status.enabled" @update="onHealthUpdate" />
            </el-col>
            <el-col :span="12">
              <SyncConfigCard :value="config.sync" @update="onSyncUpdate" :disabled="!status.enabled" />
            </el-col>
          </el-row>
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
.page-header{ display:flex; justify-content:space-between; align-items:center }
.muted{ color:var(--el-text-color-secondary); margin:0 }
.page-actions{ display:flex; gap:8px; align-items:center }
.card{ margin-bottom:16px }
.mt-16{ margin-top:16px }
.mt-20{ margin-top:20px }
</style>
