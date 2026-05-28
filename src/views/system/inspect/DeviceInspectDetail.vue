<template>
  <div class="device-inspect-detail">
    <header class="device-inspect-detail__head">
      <div class="device-inspect-detail__head-left">
        <el-button class="device-inspect-detail__back" link @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <h2 class="device-inspect-detail__title">设备自检详情</h2>
      </div>
      <el-button
        v-if="record"
        type="primary"
        plain
        :icon="Download"
        @click="exportReport"
      >
        导出检测报告
      </el-button>
    </header>

    <template v-if="record">
      <div class="page-card device-inspect-detail__section">
        <div class="section-head">
          <span class="section-bar" />
          <span class="section-title">基本信息</span>
        </div>
        <div class="basic-info-row">
          <div class="basic-info-item">
            <span class="basic-info-item__label">自检时间</span>
            <span class="basic-info-item__value">{{ record.finishedAt }}</span>
          </div>
          <div class="basic-info-item">
            <span class="basic-info-item__label">检测类型</span>
            <span class="basic-info-item__value">{{ detectTypeLabel(record) }}</span>
          </div>
          <div class="basic-info-item">
            <span class="basic-info-item__label">检测结果</span>
            <span
              class="status-cell"
              :class="overallResultClass(record)"
            >
              <span class="status-dot" aria-hidden="true" />
              {{ overallResultLabel(record) }}
            </span>
          </div>
        </div>
      </div>

      <div class="page-card device-inspect-detail__section">
        <div class="section-head">
          <span class="section-bar" />
          <span class="section-title">检测内容</span>
        </div>
        <el-table :data="detailRows" border class="detail-table" size="small">
          <el-table-column type="index" label="序号" width="64" align="center" />
          <el-table-column prop="name" label="检测项" min-width="160" />
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <span
                class="status-cell"
                :class="row.status === '正常' ? 'is-on' : 'is-off'"
              >
                <span class="status-dot" aria-hidden="true" />
                {{ row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="detail" label="检测详情" min-width="280" show-overflow-tooltip />
          <el-table-column label="异常说明" min-width="120">
            <template #default="{ row }">
              {{ row.abnormalDesc || '—' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>

    <el-empty v-else description="未找到该检测记录" />
  </div>
</template>

<script setup>
import { computed, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Download } from '@element-plus/icons-vue'
import { setPageBreadcrumbItems } from '@/composables/pageBreadcrumb'
import {
  getInspectHistoryById,
  detectTypeLabel,
  overallResultLabel,
  overallResultClass,
  downloadDeviceInspectReport
} from '@/utils/inspectCenter'

const route = useRoute()
const router = useRouter()

const recordId = computed(() => String(route.query.id || ''))
const record = computed(() => {
  if (!recordId.value) return null
  return getInspectHistoryById(recordId.value)
})

const detailRows = computed(() => {
  const items = record.value?.detailItems || []
  return items.map((item) => ({
    name: item.name,
    status: item.status,
    detail: item.detail || '—',
    abnormalDesc: item.abnormalDesc || (item.status === '异常' ? item.detail || '检测未通过' : '')
  }))
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
  }
})

function goBack () {
  router.push({ path: '/system/inspect', query: { tab: 'device' } })
}

function exportReport () {
  if (!record.value) {
    ElMessage.warning('暂无可导出的检测记录')
    return
  }
  downloadDeviceInspectReport(record.value)
  ElMessage.success('检测报告已导出')
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
  justify-content: space-between;
  gap: 16px;
}

.device-inspect-detail__head-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
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

.device-inspect-detail__section {
  padding: 20px 24px;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-bar {
  width: 3px;
  height: 14px;
  background: $primary-color;
  border-radius: 2px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
}

.basic-info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px 48px;
}

.basic-info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 160px;

  &__label {
    font-size: 13px;
    color: $text-secondary;
  }

  &__value {
    font-size: 14px;
    color: $text-primary;
  }
}

.detail-table {
  width: 100%;
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

  &.is-off {
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
