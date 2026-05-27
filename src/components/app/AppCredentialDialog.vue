<template>
  <div class="app-credential-dialog">
    <el-dialog
      v-model="authVisible"
      title="二次认证"
      width="480px"
      align-center
      :close-on-click-modal="false"
      destroy-on-close
      @closed="onAuthClosed"
    >
      <div class="auth-body">
        <div class="auth-row">
          <span class="auth-label">管理密码：</span>
          <el-input
            v-model="adminPassword"
            type="password"
            show-password
            clearable
            placeholder="输入管理员密码进行认证"
            class="auth-input"
            autocomplete="off"
            @keyup.enter="confirmAuth"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="authVisible = false">取消</el-button>
        <el-button type="primary" :loading="authSubmitting" @click="confirmAuth">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="credentialVisible"
      title="密码"
      width="520px"
      align-center
      :close-on-click-modal="false"
      destroy-on-close
      class="credential-result-dialog"
      @closed="onCredentialClosed"
    >
      <div class="credential-body">
        <div class="credential-row">
          <span class="credential-label">应用名称：</span>
          <span class="credential-value">{{ displayAppName }}</span>
        </div>
        <div class="credential-row">
          <span class="credential-label">应用ID：</span>
          <span class="credential-value credential-value--mono">{{ displayAppId }}</span>
        </div>
        <p class="credential-id-hint">应用 ID 即 HMAC 调用方标识，请求头中携带此 ID，服务端据此查找应用凭证。</p>
        <div class="credential-row">
          <span class="credential-label">应用凭证：</span>
          <span class="credential-value credential-value--mono">{{ displaySecret }}</span>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="copyCredentials">复制</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { initApiAuthForApp, loadApiAuth, recordApiAuthAudit } from '@/utils/appApiAuth'

const authVisible = ref(false)
const credentialVisible = ref(false)
const authSubmitting = ref(false)
const adminPassword = ref('')

const displayAppName = ref('')
const displayAppId = ref('')
const displaySecret = ref('')

let pendingApp = null

function onAuthClosed () {
  adminPassword.value = ''
  authSubmitting.value = false
  if (!credentialVisible.value) pendingApp = null
}

function onCredentialClosed () {
  displayAppName.value = ''
  displayAppId.value = ''
  displaySecret.value = ''
  pendingApp = null
}

function open (row) {
  if (!row?.appId) {
    ElMessage.warning('应用信息无效')
    return
  }
  pendingApp = row
  adminPassword.value = ''
  authVisible.value = true
}

function confirmAuth () {
  if (!adminPassword.value.trim()) {
    ElMessage.warning('请输入管理密码')
    return
  }
  if (!pendingApp) return

  authSubmitting.value = true
  setTimeout(() => {
    authSubmitting.value = false
    authVisible.value = false

    const auth = initApiAuthForApp(pendingApp.appId) || loadApiAuth(pendingApp.appId)
    displayAppName.value = pendingApp.name || '未命名应用'
    displayAppId.value = pendingApp.appId
    displaySecret.value = auth?.secret || '—'

    recordApiAuthAudit({
      appId: pendingApp.appId,
      appName: pendingApp.name,
      action: '查看应用凭证',
      detail: '管理员通过二次认证后查看应用凭证（原型演示）'
    })

    credentialVisible.value = true
  }, 500)
}

async function copyCredentials () {
  const text = [
    `应用名称：${displayAppName.value}`,
    `应用ID：${displayAppId.value}`,
    `应用凭证：${displaySecret.value}`
  ].join('\n')

  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.info(`${text}（原型环境请手动复制）`)
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.auth-body {
  padding: 8px 0 4px;
}

.auth-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-label {
  flex-shrink: 0;
  font-size: 14px;
  color: $text-primary;
}

.auth-input {
  flex: 1;
  min-width: 0;
}

.credential-body {
  padding: 4px 0 8px;
}

.credential-row {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.6;
}

.credential-id-hint {
  margin: -8px 0 16px;
  padding-left: 92px;
  font-size: 12px;
  line-height: 1.5;
  color: $text-secondary;
}

.credential-row:last-of-type {
  margin-bottom: 8px;
}

.credential-label {
  flex-shrink: 0;
  color: $text-primary;
  min-width: 88px;
}

.credential-value {
  flex: 1;
  color: $text-primary;
  word-break: break-all;

  &--mono {
    font-family: Consolas, 'Courier New', monospace;
  }
}

:deep(.credential-result-dialog .el-dialog__footer) {
  text-align: right;
}
</style>
