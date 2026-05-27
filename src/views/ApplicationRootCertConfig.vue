<template>
  <div class="app-root-cert">
    <!-- 上区：与页面底色一致，无卡片白底 -->
    <header class="app-root-cert__head">
      <h2 class="app-root-cert__title">根证书配置</h2>
      <div class="app-root-cert__nav">
        <el-button link type="primary" class="app-root-cert__back" @click="goApplicationList">
          <el-icon><ArrowLeft /></el-icon>
          根证书配置——（{{ appName }}）
        </el-button>
      </div>
      <p class="app-root-cert__meta">当前应用 ID：<span class="mono">{{ appId }}</span></p>
    </header>

    <!-- 下区：根证书配置操作 + 列表，独立白底卡片 -->
    <div class="page-card app-root-cert__panel">
      <div class="app-root-cert__toolbar">
        <el-button type="primary" @click="openConfigDialog">根证书配置</el-button>
      </div>

      <el-table :data="configRows" border>
        <el-table-column label="应用证书名称/密钥标识" min-width="240" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="name-id-cell">
              <span class="primary-line">{{ row.appCertName }}</span>
              <span class="sub-line">{{ row.keyIdentifier || row.id }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rootCaLabel" label="根证书" min-width="160" show-overflow-tooltip />
        <el-table-column prop="policyLabel" label="证书验证策略" min-width="280" show-overflow-tooltip />
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="removeRow(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="根证书配置"
      width="520px"
      class="app-root-cert-dialog"
      align-center
      destroy-on-close
      :close-on-click-modal="false"
      @closed="onDialogClosed"
    >
      <el-form
        ref="formRef"
        class="app-root-cert-form"
        :model="form"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="根证书" prop="rootCaId">
          <el-select
            v-model="form.rootCaId"
            placeholder="请选择根证书"
            clearable
            filterable
            class="app-root-cert-form__control"
          >
            <el-option
              v-for="opt in rootCaOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="证书验证策略" prop="policy">
          <el-select
            v-model="form.policy"
            placeholder="请选择证书验证策略"
            clearable
            class="app-root-cert-form__control"
          >
            <el-option
              v-for="opt in policyOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitConfig">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setPageBreadcrumbItems } from '@/composables/pageBreadcrumb'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const appId = computed(() => String(route.query.appId || '').trim() || '—')
const appName = computed(() => String(route.query.name || '').trim() || '未命名应用')

watchEffect(() => {
  setPageBreadcrumbItems([
    { label: '应用管理', to: '/application' },
    { label: '根证书配置' }
  ])
})

const rootCaOptions = [
  { value: 'ca-demo-1', label: 'Demo Root CA（CN=Demo Root, O=SVS, C=CN）' },
  { value: 'ca-demo-2', label: '演示国密根 CA（CN=GM Root CA, C=CN）' }
]

const policyOptions = [
  { value: 'validity', label: '验证证书有效性' },
  { value: 'validity_crl', label: '验证证书有效性且验证CRL' },
  { value: 'validity_ocsp', label: '验证证书有效性且验证OCSP' }
]

const configRows = ref([])

const dialogVisible = ref(false)
const formRef = ref(null)
const submitting = ref(false)
const form = reactive({
  rootCaId: '',
  policy: ''
})

const rules = {
  rootCaId: [{ required: true, message: '请选择根证书', trigger: 'change' }],
  policy: [{ required: true, message: '请选择证书验证策略', trigger: 'change' }]
}

function goApplicationList () {
  router.push('/application')
}

function openConfigDialog () {
  form.rootCaId = ''
  form.policy = ''
  dialogVisible.value = true
}

function onDialogClosed () {
  form.rootCaId = ''
  form.policy = ''
  submitting.value = false
}

function labelOf (list, value) {
  return list.find((x) => x.value === value)?.label || value
}

function submitConfig () {
  formRef.value?.validate((valid) => {
    if (!valid) return
    submitting.value = true
    setTimeout(() => {
      const rootLabel = labelOf(rootCaOptions, form.rootCaId)
      const policyLabel = labelOf(policyOptions, form.policy)
      configRows.value = [
        {
          id: `rc_${Date.now()}`,
          appCertName: `${appName.value} 应用默认证书`,
          keyIdentifier: appId.value,
          rootCaLabel: rootLabel,
          policyLabel
        }
      ]
      submitting.value = false
      dialogVisible.value = false
      ElMessage.success('根证书配置已保存（原型演示）')
    }, 320)
  })
}

function removeRow (row) {
  ElMessageBox.confirm('确定删除该条根证书配置吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      configRows.value = configRows.value.filter((r) => r.id !== row.id)
      ElMessage.success('已删除')
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-root-cert {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .app-root-cert__head {
    margin: 0;
    padding: 0;
    background: transparent;
    box-shadow: none;
  }

  .app-root-cert__title {
    margin: 8px;
    font-size: 26px;
    font-weight: 500;
    color: $text-primary;
  }

  .app-root-cert__nav {
    margin-bottom: 8px;
  }

  .app-root-cert__back {
    padding-left: 0;
    font-size: 14px;
  }

  .app-root-cert__meta {
    margin: 0;
    font-size: 13px;
    color: $text-secondary;

    .mono {
      font-family: ui-monospace, monospace;
      word-break: break-all;
    }
  }

  .app-root-cert__panel {
    margin: 0;
  }

  .app-root-cert__toolbar {
    margin-bottom: 16px;
  }

  .name-id-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .primary-line {
      font-weight: 500;
      color: $text-primary;
    }

    .sub-line {
      font-size: 12px;
      color: $text-secondary;
      line-height: 1.35;
      word-break: break-all;
    }
  }
}
</style>

<style lang="scss" scoped>
.app-root-cert-dialog {
  :deep(.el-dialog__header) {
    padding: 14px 16px 10px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-dialog__body) {
    padding: 20px 20px 8px;
  }

  :deep(.el-dialog__footer) {
    padding: 12px 16px 16px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}

.app-root-cert-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
}

.app-root-cert-form__control {
  width: 90%;
  max-width: 100%;
}
</style>
