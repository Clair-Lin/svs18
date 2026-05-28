<template>
  <div class="device-inspect-page">
    <div class="device-inspect-page__toolbar">
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="检测类型">
          <el-select
            v-model="searchForm.detectType"
            placeholder="请选择检测类型"
            clearable
            style="width: 160px"
          >
            <el-option label="手动检测" value="manual" />
            <el-option label="自动检测" value="scheduled" />
          </el-select>
        </el-form-item>
        <el-form-item label="检测结果">
          <el-select
            v-model="searchForm.result"
            placeholder="请选择检测结果"
            clearable
            style="width: 160px"
          >
            <el-option label="成功" value="success" />
            <el-option label="失败" value="fail" />
          </el-select>
        </el-form-item>
        <el-form-item label="检测时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 360px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="action-bar">
      <el-button type="primary" :loading="detecting" @click="runInspect">
        {{ detecting ? '检测中...' : '立即检测' }}
      </el-button>
      <el-button @click="openAutoDialog">自动检测</el-button>
    </div>
    </div>

    <div class="list-section">
      <el-table
        :data="pagedList"
        border
        class="history-table"
        size="small"
        style="width: 100%"
      >
        <el-table-column prop="finishedAt" label="检测时间" />
        <el-table-column label="检测类型">
          <template #default="{ row }">
            {{ detectTypeLabel(row) }}
          </template>
        </el-table-column>
        <el-table-column label="检测结果">
          <template #default="{ row }">
            <span class="status-cell" :class="overallResultClass(row)">
              <span class="status-dot" aria-hidden="true" />
              {{ overallResultLabel(row) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="goDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="filteredList.length"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        background
        small
      />
      </div>
    </div>

    <el-dialog
      v-model="autoDialogVisible"
      title="自动检测设置"
      width="520px"
      align-center
      destroy-on-close
      @closed="onAutoDialogClosed"
    >
      <el-form label-width="120px" class="auto-form">
        <el-form-item label="开启自动检测">
          <el-switch v-model="autoForm.enabled" />
        </el-form-item>
        <el-form-item label="频率" required>
          <div class="freq-row">
            <span>每</span>
            <el-input-number
              v-model="autoForm.intervalValue"
              :min="1"
              :max="9999"
              :disabled="!autoForm.enabled"
              controls-position="right"
              class="freq-row__num"
            />
            <el-select
              v-model="autoForm.intervalUnit"
              :disabled="!autoForm.enabled"
              class="freq-row__unit"
            >
              <el-option label="分钟" value="minute" />
              <el-option label="小时" value="hour" />
              <el-option label="天" value="day" />
            </el-select>
            <span>执行一次检测任务</span>
          </div>
        </el-form-item>
        <p class="auto-form__hint">
          为了保证产品的性能，请合理设置自动检测的频率，您也可以通过点击
          <el-button type="primary" link class="auto-form__link" @click="detectFromDialog">
            立即检测
          </el-button>
          ，发起检测任务。
        </p>
      </el-form>
      <template #footer>
        <el-button @click="autoDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="autoSaving" @click="saveAutoSettings">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ALL_DEVICE_ITEM_IDS,
  buildDeviceInspectResults,
  groupDeviceResultsByCategory,
  appendInspectHistory,
  loadInspectHistory,
  loadInspectSchedule,
  saveInspectSchedule,
  seedDeviceInspectHistoryIfEmpty,
  detectTypeLabel,
  overallResultLabel,
  overallResultClass,
  filterDeviceHistory,
  describeAutoSchedule
} from '@/utils/inspectCenter'

const emit = defineEmits(['history-updated'])

const router = useRouter()
const detecting = ref(false)
const autoDialogVisible = ref(false)
const autoSaving = ref(false)
const list = ref([])
const page = ref(1)
const pageSize = ref(10)

const searchForm = reactive({
  detectType: '',
  result: '',
  dateRange: null
})

const appliedFilters = reactive({
  detectType: '',
  result: '',
  dateRange: null
})

const autoForm = reactive({
  enabled: false,
  intervalValue: 30,
  intervalUnit: 'hour'
})

let detectTimer = null

function refresh () {
  seedDeviceInspectHistoryIfEmpty()
  list.value = loadInspectHistory().filter((h) => h.inspectType === 'device')
}

onMounted(refresh)

const filteredList = computed(() =>
  filterDeviceHistory(list.value, appliedFilters)
)

const pagedList = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})

function handleSearch () {
  appliedFilters.detectType = searchForm.detectType
  appliedFilters.result = searchForm.result
  appliedFilters.dateRange = searchForm.dateRange ? [...searchForm.dateRange] : null
  page.value = 1
}

function handleReset () {
  searchForm.detectType = ''
  searchForm.result = ''
  searchForm.dateRange = null
  handleSearch()
}

function goDetail (row) {
  router.push({
    path: '/system/inspect/device-detail',
    query: { id: row.id }
  })
}

function openAutoDialog () {
  const schedule = loadInspectSchedule()
  autoForm.enabled = schedule.enabled
  autoForm.intervalValue = schedule.intervalValue ?? 30
  autoForm.intervalUnit = schedule.intervalUnit || 'hour'
  autoDialogVisible.value = true
}

function onAutoDialogClosed () {
  autoSaving.value = false
}

function saveAutoSettings () {
  if (autoForm.enabled && (!autoForm.intervalValue || autoForm.intervalValue < 1)) {
    ElMessage.warning('请设置有效的检测频率')
    return
  }
  autoSaving.value = true
  setTimeout(() => {
    saveInspectSchedule({
      enabled: autoForm.enabled,
      intervalValue: autoForm.intervalValue,
      intervalUnit: autoForm.intervalUnit
    })
    autoSaving.value = false
    autoDialogVisible.value = false
    ElMessage.success(
      autoForm.enabled
        ? `自动检测已开启：${describeAutoSchedule(autoForm)}`
        : '已关闭自动检测'
    )
  }, 200)
}

function detectFromDialog () {
  autoDialogVisible.value = false
  runInspect()
}

function runInspect () {
  if (detecting.value) return
  const itemIds = [...ALL_DEVICE_ITEM_IDS]
  detecting.value = true

  detectTimer = setTimeout(() => {
    detectTimer = null
    detecting.value = false

    const built = buildDeviceInspectResults(itemIds)
    const resultCategories = groupDeviceResultsByCategory(built.items)
    const bad = built.failed
    const ok = built.passed

    const entry = appendInspectHistory({
      inspectType: 'device',
      trigger: 'manual',
      triggerLabel: '手动检测',
      scopeMode: 'all',
      scopeItems: itemIds,
      overallStatus: bad > 0 ? '异常' : '正常',
      finishedAt: built.time,
      itemCount: built.total,
      passedCount: ok,
      failedCount: bad,
      detailItems: built.items,
      resultCategories,
      summary: {
        total: built.total,
        passed: ok,
        warning: 0,
        failed: bad,
        time: built.time,
        targetLabel: built.targetLabel
      }
    })

    refresh()
    emit('history-updated')
    ElMessage.success('设备自检已完成')
    goDetail(entry)
  }, 1200)
}

defineExpose({ refresh, runInspect })
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.device-inspect-page {
  width: 100%;

  &__toolbar {
    padding: 0 $spacing-lg;
  }

  .search-area {
    background: #fafafa;
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 16px;
  }

  .search-form {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }

  .action-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .list-section {
    width: 100%;
    padding: 0 $spacing-lg;
  }

  .history-table {
    width: 100%;

    :deep(.el-table__inner-wrapper) {
      border-radius: 0;
    }

    :deep(table) {
      width: 100% !important;
      table-layout: fixed;
    }

    :deep(.el-table__header),
    :deep(.el-table__body) {
      width: 100% !important;
    }

    :deep(.el-table__header-wrapper th.el-table__cell) {
      background-color: #f5f7fa !important;
    }
  }

  .pagination {
    margin-top: 16px;
    padding: 0 $spacing-lg;
    display: flex;
    justify-content: flex-end;
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
}

.auto-form {
  .freq-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: $text-primary;

    &__num {
      width: 120px;
    }

    &__unit {
      width: 100px;
    }
  }

  &__hint {
    margin: 0 0 0 120px;
    font-size: 13px;
    line-height: 1.6;
    color: $text-secondary;
  }

  &__link {
    padding: 0;
    vertical-align: baseline;
    font-size: 13px;
  }
}
</style>
