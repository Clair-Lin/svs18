<template>
  <div class="hot-standby-page page-card">
    <div class="page-header">
      <div>
        <h2>双机热备配置</h2>
        <p class="muted">双机热备用于两台签名验签服务器的主备部署和故障接替，提升服务连续性。</p>
      </div>
    </div>

    <el-card class="card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基础配置" name="basic">
          <div class="basic-header">
            <div class="enable-line">
              <span class="enable-label">高可用开关</span>
              <el-switch v-model="status.enabled" active-text="启用" inactive-text="停用" @change="toggleEnable" />
            </div>
          </div>

          <div v-if="status.enabled" class="enabled-content">
            <div class="basic-actions">
              <el-button type="danger" @click="openSwitch">手工切换</el-button>
              <el-button type="primary" @click="saveConfig" :loading="saving">保存配置</el-button>
            </div>

            <HotStandbyForm ref="formRef" :disabled="!status.enabled" :value="config" @update="onConfigUpdate" />

            <div class="status-panel">
              <el-card class="status-card">
                <h4>状态总览</h4>
                <el-descriptions column="2" border>
                  <el-descriptions-item label="本机角色">{{status.role}}</el-descriptions-item>
                  <el-descriptions-item label="对端状态">{{status.peerState}}</el-descriptions-item>
                  <el-descriptions-item label="当前服务节点">{{status.currentNode}}</el-descriptions-item>
                  <el-descriptions-item label="服务入口">{{status.vip}}</el-descriptions-item>
                  <el-descriptions-item label="最近切换时间">{{status.lastSwitchTime}}</el-descriptions-item>
                  <el-descriptions-item label="最近切换原因">{{status.lastSwitchReason}}</el-descriptions-item>
                </el-descriptions>
              </el-card>

              <el-card class="sync-card">
                <h4>同步范围配置</h4>
                <SyncConfigCard :value="config.sync" @update="onSyncUpdate" :disabled="!status.enabled" />
              </el-card>
            </div>
          </div>

          <div v-else class="disabled-placeholder">
            <p>当前未启用双机热备。请先启用后进行基础配置。</p>
          </div>
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
import HotStandbyForm from '@/components/ha/HotStandbyForm.vue'
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
.card { margin-bottom: 0; border-color: transparent; box-shadow: none }
.el-card__body { padding: 0 }
.el-tabs--border-card .el-tabs__header, .el-tabs--card .el-tabs__header { border-bottom-color: transparent }
.el-tabs__item { border: 1px solid transparent; border-radius: 4px 4px 0 0; margin-right: 8px }
.el-tabs__item.is-active { background: #ffffff; border-color: #dfe4ed; color: var(--el-color-primary); }
.el-tabs__header { margin-bottom: 0 }
.basic-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid #f0f2f5; background: #fff }
.enable-line { display: flex; align-items: center; gap: 12px }
.enable-label { font-size: 14px; color: var(--el-text-color-secondary) }
.basic-actions { display: flex; gap: 12px; padding: 16px 24px; background: #fff; border-bottom: 1px solid #f0f2f5 }
.enabled-content { padding: 24px 24px 16px }
.status-panel { display: flex; gap: 16px; margin-top: 24px }
.status-card, .sync-card { flex: 1; border-color: #e8edf3; box-shadow: none }
.disabled-placeholder { padding: 24px; color: var(--el-text-color-secondary); background: #fafbfd; border: 1px solid #e8edf3; border-radius: 6px; }
