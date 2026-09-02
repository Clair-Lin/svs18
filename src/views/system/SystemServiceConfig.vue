<template>
  <div class="system-service-config">
    <div class="page-tabs-shell">
      <el-tabs v-model="activeTab" class="system-service-tabs">
        <el-tab-pane name="service" lazy>
          <template #label>服务管理</template>
          <ServiceManage />
        </el-tab-pane>
        <el-tab-pane name="pool" lazy>
          <template #label>连接池配置</template>
          <PoolConfig />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setPageBreadcrumbItems } from '@/composables/pageBreadcrumb'
import ServiceManage from './ServiceManage.vue'
import PoolConfig from './PoolConfig.vue'

const TAB_NAMES = ['service', 'pool']

const tabCopy = {
  service: '服务管理',
  pool: '连接池配置'
}

const route = useRoute()
const router = useRouter()
const activeTab = ref('service')

function tabFromRoute () {
  const t = route.query.tab
  return TAB_NAMES.includes(t) ? t : 'service'
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
    path: '/system/service-config',
    query: val === 'service' ? {} : { tab: val }
  })
})

watchEffect(() => {
  setPageBreadcrumbItems([
    { label: '系统管理' },
    { label: '服务配置' },
    { label: tabCopy[activeTab.value] }
  ])
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.system-service-config {
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

