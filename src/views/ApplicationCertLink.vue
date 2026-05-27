<template>
  <div class="app-cert-link">
    <!-- 上区：与页面底色一致，无卡片白底 -->
    <header class="app-cert-link__head">
      <div class="app-cert-link__nav">
        <el-button link type="primary" class="app-cert-link__back" @click="goApplicationList">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <span class="app-cert-link__nav-hint">关联已有应用证书</span>
      </div>
      <h2 class="app-cert-link__title">应用证书关联</h2>
      <p class="app-cert-link__meta">当前应用：<strong>{{ appName }}</strong>（ID：{{ appId }}）</p>
    </header>

    <!-- 下区：关联操作 + 列表，独立白底卡片 -->
    <div class="page-card app-cert-link__panel">
      <div class="app-cert-link__toolbar">
        <el-button type="primary" @click="associateDialogVisible = true">关联已有应用证书</el-button>
      </div>

      <el-table :data="linkedCerts" border>
        <el-table-column label="应用证书名称/标识编码" min-width="240" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="name-id-cell">
              <span class="primary-line">{{ row.appCertName }}</span>
              <span class="sub-line">{{ row.keyNumber || row.id }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="算法类型" width="130" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.algorithmDisplay || row.algorithm }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="removeLinked(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>
    </div>

    <AssociateExistingAppCertDialog
      v-model="associateDialogVisible"
      :certificates="certPool"
      @confirm="onAssociateConfirm"
    />
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setPageBreadcrumbItems } from '@/composables/pageBreadcrumb'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import AssociateExistingAppCertDialog from '@/components/cert/AssociateExistingAppCertDialog.vue'

const route = useRoute()
const router = useRouter()

const appId = computed(() => String(route.query.appId || '').trim() || '—')
const appName = computed(() => String(route.query.name || '').trim() || '未命名应用')

watchEffect(() => {
  setPageBreadcrumbItems([
    { label: '应用管理', to: '/application' },
    { label: '应用证书关联' }
  ])
})

/** 与证书管理同源的原型证书库，供选择签名/加密证书 */
const certPool = ref([
  {
    id: 'pool-1',
    appCertName: 'SM2_SIGN',
    keyNumber: '6a01a23b26bb906f9eda8c1a2b3c4d5e',
    algorithm: 'SM2',
    algorithmDisplay: 'SM3WithSM2',
    issuer: 'C=CN,ST=guangdong,L=shenzhen,O=myibc.net,CN=Demo CA',
    serialNumber: '01399a',
    appliedDate: '2021-01-01',
    expireDate: '2040-01-01',
    certType: '签名证书'
  },
  {
    id: 'pool-2',
    appCertName: 'SM2_ENC',
    keyNumber: '7b12b34c37cc9170afedb9d2e4f5a6b0',
    algorithm: 'SM2',
    algorithmDisplay: 'SM3WithSM2',
    issuer: 'C=CN,ST=Guangdong,O=演示CA,CN=Test CA',
    serialNumber: '02e8d1c',
    appliedDate: '2022-06-15',
    expireDate: '2032-06-15',
    certType: '加密证书'
  },
  {
    id: 'pool-3',
    appCertName: 'RSA_SIGN_APP',
    keyNumber: '8c23c45d48dd0281b0fedc0e3f6b7c1d',
    algorithm: 'RSA',
    algorithmDisplay: 'SHA256WithRSA',
    issuer: 'C=CN,O=演示RSA CA,CN=RSA Root',
    serialNumber: '01aabbcc',
    appliedDate: '2023-01-10',
    expireDate: '2033-01-10',
    certType: '签名证书'
  }
])

const linkedCerts = ref([])

const associateDialogVisible = ref(false)

function goApplicationList () {
  router.push('/application')
}

function onAssociateConfirm ({ sign, enc }) {
  linkedCerts.value = [
    { ...sign, linkPurpose: '签名证书' },
    { ...enc, linkPurpose: '加密证书' }
  ]
  ElMessage.success('已关联签名证书与加密证书（原型演示）')
}

function removeLinked (row) {
  ElMessageBox.confirm('确定从本应用中移除该证书关联吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      linkedCerts.value = linkedCerts.value.filter((r) => r.id !== row.id)
      ElMessage.success('已移除')
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-cert-link {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .app-cert-link__head {
    margin: 0;
    padding: 0;
    background: transparent;
    box-shadow: none;
  }

  .app-cert-link__panel {
    margin: 0;
  }

  .app-cert-link__nav {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .app-cert-link__back {
    padding-left: 0;
  }

  .app-cert-link__nav-hint {
    font-size: 13px;
    color: $text-secondary;
  }

  .app-cert-link__title {
    margin: 8px;
    font-size: 26px;
    font-weight: 500;
    color: $text-primary;
  }

  .app-cert-link__meta {
    margin: 8px;
    font-size: 13px;
    color: $text-secondary;
  }

  .app-cert-link__toolbar {
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
