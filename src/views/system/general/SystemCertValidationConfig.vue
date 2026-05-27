<template>
  <div class="cert-validation-config">
    <el-form
      ref="formRef"
      :model="form"
      label-width="160px"
      class="config-form"
    >
      <el-form-item label="证书合法性校验">
        <div class="control-row">
          <el-switch
            v-model="form.enabled"
            inline-prompt
            active-text="启用"
            inactive-text="关闭"
          />
          <el-tooltip
            placement="top"
            effect="dark"
            :show-after="200"
            popper-class="config-help-tooltip"
          >
            <template #content>
              <div class="tooltip-text">
                若关闭此配置，将关闭用户验签时的证书合法性校验，包括但不限于 CA 有效期校验、CA 证书链校验、吊销列表校验等，建议保持此设置确保账户安全。
              </div>
            </template>
            <span class="help-icon" aria-label="说明">?</span>
          </el-tooltip>
        </div>
      </el-form-item>
    </el-form>

    <div class="footer-actions">
      <el-button type="primary" :loading="saving" @click="onSave">保存配置</el-button>
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

function onSave () {
  saving.value = true
  setTimeout(() => {
    persistSystemCertValidation(form)
    saving.value = false
    ElMessage.success('证书校验配置已保存（原型演示）')
  }, 300)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.cert-validation-config {
  .config-form {
    max-width: 720px;

    .control-row {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
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
  }
}
</style>

<style lang="scss">
.config-help-tooltip {
  max-width: 360px;

  .tooltip-text {
    line-height: 1.6;
    font-size: 13px;
  }
}
</style>
