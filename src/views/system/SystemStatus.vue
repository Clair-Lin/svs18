<template>
  <div class="system-status">
    <div class="detect-manage-body">
      <el-tabs v-model="activeTab" class="system-status-tabs">        <el-tab-pane name="device" lazy>
          <template #label>设备自检</template>
          <DeviceInspectPanel :key="historyVersion" @history-updated="onHistoryUpdated" />
        </el-tab-pane>
        <el-tab-pane name="service" lazy>
          <template #label>业务检测</template>
          <ServiceDetectPanel @history-updated="onHistoryUpdated" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setPageBreadcrumbItems } from '@/composables/pageBreadcrumb'
import ServiceDetectPanel from './inspect/ServiceDetectPanel.vue'
import DeviceInspectPanel from './inspect/DeviceInspectPanel.vue'

const TAB_NAMES = ['device', 'service']

const tabCopy = {
  device: '设备自检',
  service: '业务检测'
}

const route = useRoute()
const router = useRouter()
const activeTab = ref('device')
const historyVersion = ref(0)

function tabFromRoute () {
  const t = route.query.tab
  if (t === 'schedule' || t === 'history') return 'device'
  return TAB_NAMES.includes(t) ? t : 'device'
}

function onHistoryUpdated () {
  historyVersion.value += 1
}

onMounted(() => {
  activeTab.value = tabFromRoute()
})

const DEFAULT_TAB = 'device'

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
    path: '/system/status',
    query: val === DEFAULT_TAB ? {} : { tab: val }
  })
})

watchEffect(() => {
  setPageBreadcrumbItems([
    { label: '系统管理' },
    { label: '检测管理' },
    { label: tabCopy[activeTab.value] }
  ])
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.system-status {
  .detect-manage-body {
    width: 100%;
  }

  :deep(.el-tabs__header) {
    margin: 0 0 14px;
  }

  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
    background-color: #dcdfe6;
  }

  :deep(.el-tabs__item) {
    font-size: 14px;
    padding: 0 16px;
  }

  :deep(.el-tabs__item.is-active) {
    color: $primary-color;
    font-weight: 500;
  }

  :deep(.el-tabs__active-bar) {
    background-color: $primary-color;
  }

  :deep(.el-tabs__content) {
    overflow: visible;
    padding-top: 0;
  }

  :deep(.el-tab-pane) {
    overflow: visible;
  }
}
</style>

