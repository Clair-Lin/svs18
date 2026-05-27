<template>
  <div class="system-config">
    <div class="page-card">
      <el-tabs v-model="activeTab" class="system-config-tabs">
        <el-tab-pane name="api-auth" lazy>
          <template #label>接口鉴权</template>
          <SystemApiAuthConfig />
        </el-tab-pane>
        <el-tab-pane name="cert-validation" lazy>
          <template #label>证书校验</template>
          <SystemCertValidationConfig />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setPageBreadcrumbItems } from '@/composables/pageBreadcrumb'
import SystemApiAuthConfig from './general/SystemApiAuthConfig.vue'
import SystemCertValidationConfig from './general/SystemCertValidationConfig.vue'

const TAB_NAMES = ['api-auth', 'cert-validation']

const tabCopy = {
  'api-auth': '接口鉴权',
  'cert-validation': '证书校验配置'
}

const route = useRoute()
const router = useRouter()
const activeTab = ref('api-auth')

function tabFromRoute () {
  const t = route.query.tab
  return TAB_NAMES.includes(t) ? t : 'api-auth'
}

onMounted(() => {
  activeTab.value = tabFromRoute()
})

watch(
  () => route.query.tab,
  () => {
    activeTab.value = tabFromRoute()
  }
)

watch(activeTab, (val) => {
  const cur = tabFromRoute()
  if (val === cur) return
  router.replace({
    path: '/system/config',
    query: val === 'api-auth' ? {} : { tab: val }
  })
})

watchEffect(() => {
  setPageBreadcrumbItems([
    { label: '系统管理' },
    { label: '系统配置' },
    { label: tabCopy[activeTab.value] }
  ])
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.system-config {
  :deep(.el-tabs__header) {
    margin-bottom: 20px;
  }

  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
    background-color: #e8e8e8;
  }

  :deep(.el-tabs__item) {
    font-size: 14px;
    padding: 0 20px;
  }

  :deep(.el-tabs__item.is-active) {
    color: $primary-color;
    font-weight: 500;
  }

  :deep(.el-tabs__active-bar) {
    background-color: $primary-color;
  }

  :deep(.el-tabs__content) {
    padding-top: 4px;
  }
}
</style>
