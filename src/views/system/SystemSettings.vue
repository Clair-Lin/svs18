<template>
  <div class="system-settings">
    <div class="page-tabs-shell">
      <el-tabs v-model="activeTab" class="system-settings-tabs">
        <el-tab-pane name="ntp" lazy>
          <template #label>时间设置</template>
          <NTPConfig />
        </el-tab-pane>
        <el-tab-pane name="syslog" lazy>
          <template #label>Syslog配置</template>
          <SyslogConfig />
        </el-tab-pane>
        <el-tab-pane name="snmp" lazy>
          <template #label>SNMP配置</template>
          <SnmpConfig />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setPageBreadcrumbItems } from '@/composables/pageBreadcrumb'
import NTPConfig from './NTPConfig.vue'
import SyslogConfig from './SyslogConfig.vue'
import SnmpConfig from './SnmpConfig.vue'

const TAB_NAMES = ['ntp', 'syslog', 'snmp']

const tabCopy = {
  ntp: '时间设置',
  syslog: 'Syslog配置',
  snmp: 'SNMP配置'
}

const route = useRoute()
const router = useRouter()
const activeTab = ref('ntp')

function tabFromRoute () {
  const t = route.query.tab
  return TAB_NAMES.includes(t) ? t : 'ntp'
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
    path: '/system/settings',
    query: val === 'ntp' ? {} : { tab: val }
  })
})

watchEffect(() => {
  setPageBreadcrumbItems([
    { label: '系统管理' },
    { label: '系统设置' },
    { label: tabCopy[activeTab.value] }
  ])
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.system-settings {
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

