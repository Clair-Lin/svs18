<template>
  <div class="ha-manage">
    <div class="page-tabs-shell page-tabs-shell--content-card">
      <el-tabs v-model="activeTab" class="ha-manage-tabs">
        <el-tab-pane name="ha-config" lazy>
          <template #label>高可用配置</template>
          <HaConfig />
        </el-tab-pane>
        <el-tab-pane name="hot-standby" lazy>
          <template #label>热备管理</template>
          <HotStandbyManage />
        </el-tab-pane>
        d!-- <el-tab-pane name="cluster" lazy>
          <template #label>集群配置</template>
          <ClusterConfig />
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setPageBreadcrumbItems } from '@/composables/pageBreadcrumb'
import HaConfig from './HaConfig.vue'
import HotStandbyManage from './HotStandbyManage.vue'
import ClusterConfig from './ClusterConfig.vue'

const TAB_NAMES = ['ha-config', 'hot-standby', 'cluster']

const tabCopy = {
  'ha-config': '高可用配置',
  'hot-standby': '热备管理',
  cluster: '集群配置'
}

const route = useRoute()
const router = useRouter()
const activeTab = ref('ha-config')

function tabFromRoute () {
  const t = route.query.tab
  return TAB_NAMES.includes(t) ? t : 'ha-config'
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
    path: '/system/ha',
    query: val === 'ha-config' ? {} : { tab: val }
  })
})

watchEffect(() => {
  setPageBreadcrumbItems([
    { label: '系统管理' },
    { label: '高可用配置' },
    { label: tabCopy[activeTab.value] }
  ])
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.ha-manage {
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
