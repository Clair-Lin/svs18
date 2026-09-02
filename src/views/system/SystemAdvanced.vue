<template>
  <div class="system-advanced">
    <div class="page-tabs-shell" :class="{ 'page-tabs-shell--content-card': activeTab !== 'whitelist' }">
      <el-tabs v-model="activeTab" class="system-advanced-tabs">
        <el-tab-pane name="whitelist" lazy>
          <template #label>白名单配置</template>
          <WhitelistConfig />
        </el-tab-pane>
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
import WhitelistConfig from '@/views/whitelist/WhitelistConfig.vue'
import SystemApiAuthConfig from './general/SystemApiAuthConfig.vue'
import SystemCertValidationConfig from './general/SystemCertValidationConfig.vue'

const TAB_NAMES = ['whitelist', 'api-auth', 'cert-validation']

const tabCopy = {
  whitelist: '白名单配置',
  'api-auth': '接口鉴权',
  'cert-validation': '证书校验'
}

const route = useRoute()
const router = useRouter()
const activeTab = ref('whitelist')

function tabFromRoute () {
  const t = route.query.tab
  return TAB_NAMES.includes(t) ? t : 'whitelist'
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
    path: '/system/advanced',
    query: val === 'whitelist' ? {} : { tab: val }
  })
})

watchEffect(() => {
  setPageBreadcrumbItems([
    { label: '系统管理' },
    { label: '高级设置' },
    { label: tabCopy[activeTab.value] }
  ])
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.system-advanced {
  :deep(.el-tabs__header) {
    margin-bottom: 16px;
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
    padding-top: 0;
  }
}
</style>

