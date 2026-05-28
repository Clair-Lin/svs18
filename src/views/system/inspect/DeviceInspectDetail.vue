<template>
  <div class="device-inspect-detail">
    <header class="device-inspect-detail__head">
      <el-button class="device-inspect-detail__back" link @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <h2 class="device-inspect-detail__title">设备自检详情</h2>
    </header>

    <template v-if="record">
      <div class="page-card device-inspect-detail__meta">
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="自检时间">
            {{ record.finishedAt }}
          </el-descriptions-item>
          <el-descriptions-item label="检测类型">
            {{ detectTypeLabel(record) }}
          </el-descriptions-item>
          <el-descriptions-item label="检测结果">
            <span class="status-cell" :class="overallResultClass(record)">
              <span class="status-dot" aria-hidden="true" />
              {{ overallResultLabel(record) }}
            </span>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="page-card device-inspect-detail__results">
        <InspectResultsPanel
          ref="resultsRef"
          title="检测内容"
          :detecting="false"
          :summary="displaySummary"
          :progress-shown="100"
          :progress-status-type="progressStatusType"
          :result-categories="displayCategories"
          :stats="displayStats"
          :show-export="false"
          idle-hint=""
        />
      </div>
    </template>

    <el-empty v-else description="未找到该检测记录" />
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import InspectResultsPanel from '@/components/inspect/InspectResultsPanel.vue'
import { setPageBreadcrumbItems } from '@/composables/pageBreadcrumb'
import {
  getInspectHistoryById,
  detectTypeLabel,
  overallResultLabel,
  overallResultClass,
  groupDeviceResultsByCategory
} from '@/utils/inspectCenter'

const route = useRoute()
const router = useRouter()
const resultsRef = ref(null)

const recordId = computed(() => String(route.query.id || ''))
const record = computed(() => {
  if (!recordId.value) return null
  return getInspectHistoryById(recordId.value)
})

const displaySummary = computed(() => {
  const r = record.value
  if (!r) return null
  if (r.summary) {
    return {
      ...r.summary,
      time: r.summary.time || r.finishedAt,
      targetLabel: r.summary.targetLabel || '本机 192.168.1.100 · 设备自检'
    }
  }
  const failed = r.failedCount ?? 0
  const passed = r.passedCount ?? 0
  const total = r.itemCount ?? passed + failed
  return {
    total,
    passed,
    warning: 0,
    failed,
    time: r.finishedAt,
    targetLabel: '本机 192.168.1.100 · 设备自检'
  }
})

const displayStats = computed(() => {
  const s = displaySummary.value
  if (!s) return { total: 0, ok: 0, warn: 0, bad: 0 }
  return {
    total: s.total,
    ok: s.passed,
    warn: s.warning || 0,
    bad: s.failed
  }
})

const displayCategories = computed(() => {
  const r = record.value
  if (!r) return []
  if (r.resultCategories?.length) return r.resultCategories
  const items = r.detailItems || []
  return groupDeviceResultsByCategory(items)
})

const progressStatusType = computed(() => {
  const s = displaySummary.value
  if (!s) return undefined
  return s.failed > 0 ? 'exception' : 'success'
})

watchEffect(() => {
  setPageBreadcrumbItems([
    { label: '系统管理' },
    { label: '检测中心', to: { path: '/system/inspect', query: { tab: 'device' } } },
    { label: '设备自检', to: { path: '/system/inspect', query: { tab: 'device' } } },
    { label: '设备自检详情' }
  ])
})

onMounted(() => {
  if (!recordId.value) {
    ElMessage.warning('缺少记录 ID')
  } else if (!record.value) {
    ElMessage.warning('检测记录不存在或已过期')
  } else {
    resultsRef.value?.resetExpanded()
  }
})

function goBack () {
  router.push({ path: '/system/inspect', query: { tab: 'device' } })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.device-inspect-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.device-inspect-detail__head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.device-inspect-detail__back {
  padding: 4px;
  font-size: 18px;
  color: $text-primary;

  &:hover {
    color: $primary-color;
  }
}

.device-inspect-detail__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: $text-primary;
}

.device-inspect-detail__meta {
  padding: 16px 20px;
}

.device-inspect-detail__results {
  padding: 16px 20px 20px;

  :deep(.results-module__toolbar) {
    margin-bottom: 12px;
  }

  :deep(.results-module__progress) {
    display: none;
  }
}

.status-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;

  &.is-on {
    color: #52c41a;
  }

  &.is-fail {
    color: #ff4d4f;
  }
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
</style>
