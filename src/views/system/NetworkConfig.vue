<template>
  <div class="network-config">
    <div class="page-tabs-shell page-tabs-shell--content-card">
      <el-tabs v-model="activeTab" class="network-page-tabs">
        <el-tab-pane name="port" lazy>
          <template #label>网口配置</template>
          <NetworkPortPanel />
        </el-tab-pane>
        <el-tab-pane name="sub" lazy>
          <template #label>子网口</template>
          <NetworkSubInterfacePanel />
        </el-tab-pane>
        <el-tab-pane name="bond" lazy>
          <template #label>聚合接口</template>
          <NetworkBondPanel />
        </el-tab-pane>
        <el-tab-pane name="vlan" lazy>
          <template #label>VLAN</template>
          <NetworkVlanPanel />
        </el-tab-pane>
        <el-tab-pane name="bridge" lazy>
          <template #label>网桥</template>
          <NetworkBridgePanel />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, watchEffect } from 'vue'
import { setPageBreadcrumbItems } from '@/composables/pageBreadcrumb'
import { useRoute, useRouter } from 'vue-router'
import NetworkPortPanel from './network/NetworkPortPanel.vue'
import NetworkSubInterfacePanel from './network/NetworkSubInterfacePanel.vue'
import NetworkBondPanel from './network/NetworkBondPanel.vue'
import NetworkVlanPanel from './network/NetworkVlanPanel.vue'
import NetworkBridgePanel from './network/NetworkBridgePanel.vue'

const TAB_NAMES = ['port', 'sub', 'bond', 'vlan', 'bridge']

const tabCopy = {
  port: '网口配置',
  sub: '子网口',
  bond: '聚合接口',
  vlan: 'VLAN',
  bridge: '网桥'
}

const route = useRoute()
const router = useRouter()
const activeTab = ref('port')

function tabFromRoute () {
  const t = route.query.tab
  return TAB_NAMES.includes(t) ? t : 'port'
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
    path: '/network/interface',
    query: val === 'port' ? {} : { tab: val }
  })
})

watchEffect(() => {
  setPageBreadcrumbItems([
    { label: '网络管理' },
    { label: '网口管理' },
    { label: tabCopy[activeTab.value] }
  ])
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.network-page-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }

  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
  }

  :deep(.el-tabs__item) {
    font-size: 15px;
    padding: 0 20px;
  }

  :deep(.el-tabs__item.is-active) {
    color: $primary-color;
    font-weight: 600;
  }

  :deep(.el-tabs__active-bar) {
    background-color: $primary-color;
  }

  :deep(.el-tabs__content) {
    padding-top: 16px;
  }
}
</style>

<style lang="scss">
@import './network/networkDialog.scss';
</style>
