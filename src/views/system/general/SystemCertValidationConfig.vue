<template>
  <div class="cert-validation-config">
    <el-form
      ref="formRef"
      :model="form"
      label-width="180px"
      class="config-form"
    >
      <el-form-item label="启用证书合法性校验">
        <div class="checkbox-row">
          <el-checkbox v-model="form.enabled" @change="onEnabledChange">
            启用证书合法性校验
          </el-checkbox>
          <el-tooltip
            placement="top"
            effect="dark"
            :show-after="200"
            popper-class="cert-validation-tooltip"
          >
            <template #content>
              <div class="tooltip-text">
                若关闭此配置，将关闭用户验签时的证书合法性校验，包括但不限于CA有效期校验、CA证书链校验、吊销列表校验等，建议保持此设置确保账户安全。(此项配置单独生效，无需再点击下方「提交」按钮)
              </div>
            </template>
            <span class="help-icon" aria-label="说明">?</span>
          </el-tooltip>
        </div>
      </el-form-item>
    </el-form>

    <div class="footer-actions">
      <el-button type="primary" :loading="saving" @click="onSubmit">提交</el-button>
      <el-button @click="onReset">重置</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  loadSystemCertValidation,
  persistSystemCertValidation
} from '@/utils/systemCertValidation'

const formRef = ref(null)
const saving = ref(false)

const form = reactive({
  enabled: true
})

function loadForm () {
  const data = loadSystemCertValidation()
  form.enabled = data.enabled
}

onMounted(loadForm)

function persist (showMessage = true) {
  persistSystemCertValidation(form)
  if (showMessage) {
    ElMessage.success('证书校验配置已保存（原型演示）')
  }
}

function onEnabledChange () {
  persist(false)
  ElMessage.success(
    form.enabled ? '已启用证书合法性校验（原型演示）' : '已关闭证书合法性校验（原型演示）'
  )
}

function onSubmit () {
  saving.value = true
  setTimeout(() => {
    persist()
    saving.value = false
  }, 300)
}

function onReset () {
  loadForm()
  ElMessage.info('已恢复为上次保存的配置')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.cert-validation-config {
  .config-form {
    max-width: 720px;
    padding-top: 8px;
  }

  .checkbox-row {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .help-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #c0c4cc;
    font-size: 12px;
    line-height: 1;
    color: #909399;
    cursor: default;
    user-select: none;
    flex-shrink: 0;

    &:hover {
      border-color: $primary-color;
      color: $primary-color;
    }
  }

  .footer-actions {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    gap: 12px;
  }
}
</style>

<style lang="scss">
.cert-validation-tooltip {
  max-width: 360px;

  .tooltip-text {
    line-height: 1.6;
    font-size: 13px;
  }
}
</style>
