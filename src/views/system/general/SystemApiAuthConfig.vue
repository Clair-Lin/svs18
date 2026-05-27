<template>
  <div class="system-api-auth">
      <el-alert type="info" :closable="false" show-icon class="scope-alert">
        <template #title>系统配置</template>
        本页为<strong>系统级</strong>接口鉴权通用策略，全系统统一生效。各应用接入凭证（应用 ID、应用凭证）请在
        <router-link to="/application" class="link-application">应用管理</router-link>
        中通过「凭证」查看；应用管理不再提供按应用维度的接口鉴权配置。
      </el-alert>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="160px"
        class="config-form"
      >
        <el-form-item label="系统级接口鉴权">
          <div class="control-row">
            <el-switch
              v-model="form.globalEnabled"
              inline-prompt
              active-text="启用"
              inactive-text="关闭"
            />
            <el-tooltip placement="top" effect="dark" :show-after="200" popper-class="config-help-tooltip">
              <template #content>
                <div class="tooltip-text">关闭后，全系统开放接口不再执行 HMAC-SM3 鉴权（原型演示）。</div>
              </template>
              <span class="help-icon" aria-label="说明">?</span>
            </el-tooltip>
          </div>
        </el-form-item>

        <el-form-item label="鉴权方式">
          <div class="input-with-help">
            <el-input model-value="HMAC-SM3" readonly class="readonly-input" />
            <el-tooltip placement="top" effect="dark" :show-after="200" popper-class="config-help-tooltip">
              <template #content>
                <div class="tooltip-text">
                  本版本固定为 HMAC-SM3。调用方在请求头中携带<strong>应用 ID</strong>，服务端据此查找应用密钥验签。
                </div>
              </template>
              <span class="help-icon" aria-label="说明">?</span>
            </el-tooltip>
          </div>
        </el-form-item>

        <el-form-item label="默认请求有效期" prop="defaultRequestTtlMinutes">
          <div class="control-row">
            <el-input-number
              v-model="form.defaultRequestTtlMinutes"
              :min="1"
              :max="60"
              :step="1"
              controls-position="right"
            />
            <span class="form-unit">分钟</span>
            <el-tooltip placement="top" effect="dark" :show-after="200" popper-class="config-help-tooltip">
              <template #content>
                <div class="tooltip-text">
                  新建应用时生成接入凭证数据所使用的默认请求有效期（原型演示）。
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
import { loadSystemApiAuth, persistSystemApiAuth } from '@/utils/systemApiAuth'

const formRef = ref(null)
const saving = ref(false)

const form = reactive({
  globalEnabled: true,
  method: 'HMAC-SM3',
  defaultRequestTtlMinutes: 5
})

const rules = {
  defaultRequestTtlMinutes: [
    { required: true, message: '请填写默认请求有效期', trigger: 'blur' },
    {
      type: 'number',
      min: 1,
      max: 60,
      message: '有效期为 1～60 分钟',
      trigger: 'change'
    }
  ]
}

function loadForm () {
  const data = loadSystemApiAuth()
  form.globalEnabled = data.globalEnabled
  form.method = data.method
  form.defaultRequestTtlMinutes = data.defaultRequestTtlMinutes
}

onMounted(loadForm)

function onSave () {
  formRef.value?.validate((valid) => {
    if (!valid) return
    saving.value = true
    setTimeout(() => {
      persistSystemApiAuth(form)
      saving.value = false
      ElMessage.success('系统接口鉴权配置已保存（原型演示）')
    }, 300)
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.system-api-auth {
  .scope-alert {
    margin-bottom: 20px;

    .link-application {
      color: $primary-color;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .config-form {
    max-width: 720px;

    .control-row {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }

    .input-with-help {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex-wrap: nowrap;
    }

    .form-unit {
      font-size: 13px;
      color: $text-secondary;
    }
  }

  .readonly-input {
    width: 280px;
    flex-shrink: 0;

    :deep(.el-input) {
      width: 280px;
    }

    :deep(.el-input__wrapper) {
      background: #f5f7fa;
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
