<template>
  <div class="inspect-center">
    <div class="page-card">
      <el-tabs v-model="activeTab" class="inspect-center-tabs">
        <el-tab-pane name="service" lazy>
          <template #label>业务检测</template>
          <ServiceDetectPanel @history-updated="onHistoryUpdated" />
        </el-tab-pane>
        <el-tab-pane name="device" lazy>
          <template #label>设备自检</template>
          <DeviceInspectPanel @history-updated="onHistoryUpdated" />
        </el-tab-pane>
        <el-tab-pane name="schedule" lazy>
          <template #label>定时策略</template>
          <InspectSchedulePanel :history-version="historyVersion" />
        </el-tab-pane>
        <el-tab-pane name="history" lazy>
          <template #label>执行记录</template>
          <InspectHistoryPanel :refresh-key="historyVersion" />
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
import InspectSchedulePanel from './inspect/InspectSchedulePanel.vue'
import InspectHistoryPanel from './inspect/InspectHistoryPanel.vue'

const TAB_NAMES = ['service', 'device', 'schedule', 'history']

const tabCopy = {
  service: '业务检测',
  device: '设备自检',
  schedule: '定时策略',
  history: '执行记录'
}

const route = useRoute()
const router = useRouter()
const activeTab = ref('service')
const historyVersion = ref(0)

function tabFromRoute () {
  const t = route.query.tab
  return TAB_NAMES.includes(t) ? t : 'service'
}

function onHistoryUpdated () {
  historyVersion.value += 1
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
    path: '/system/inspect',
    query: val === 'service' ? {} : { tab: val }
  })
})

watchEffect(() => {
  setPageBreadcrumbItems([
    { label: '系统管理' },
    { label: '检测中心' },
    { label: tabCopy[activeTab.value] }
  ])
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.inspect-center {
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
