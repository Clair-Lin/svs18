<template>
  <div class="inspect-history-panel">
    <div class="history-toolbar">
      <el-select v-model="filterType" placeholder="类型" clearable style="width: 140px">
        <el-option label="设备自检" value="device" />
        <el-option label="业务检测" value="service" />
      </el-select>
      <el-select v-model="filterTrigger" placeholder="触发方式" clearable style="width: 140px">
        <el-option label="手动" value="manual" />
        <el-option label="定时" value="scheduled" />
      </el-select>
      <el-button @click="refresh">刷新</el-button>
    </div>

    <el-table :data="pagedList" border size="small" class="history-table">
      <el-table-column prop="finishedAt" label="执行时间" width="170" />
      <el-table-column label="类型" width="100">
        <template #default="{ row }">
          {{ row.inspectType === 'device' ? '设备自检' : '业务检测' }}
        </template>
      </el-table-column>
      <el-table-column prop="triggerLabel" label="触发方式" width="90" />
      <el-table-column label="范围" min-width="120">
        <template #default="{ row }">
          {{ scopeSummary(row) }}
        </template>
      </el-table-column>
      <el-table-column label="结果" width="90">
        <template #default="{ row }">
          <el-tag :type="row.overallStatus === '正常' ? 'success' : 'danger'" size="small">
            {{ row.overallStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="项数" width="80">
        <template #default="{ row }">
          {{ row.passedCount }}/{{ row.itemCount }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="history-pagination">
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

    <el-dialog
      v-model="dialogVisible"
      title="执行记录详情"
      width="640px"
      align-center
      destroy-on-close
      class="history-detail-dialog"
    >
      <template v-if="currentRow">
        <p class="detail-meta">
          {{ currentRow.finishedAt }} · {{ currentRow.triggerLabel }} ·
          {{ currentRow.overallStatus }}
        </p>
        <InspectResultsPanel
          title="明细"
          :detecting="false"
          :summary="currentRow.summary"
          :progress-shown="100"
          :result-categories="currentRow.resultCategories || []"
          :stats="detailStats"
          :show-export="false"
          idle-hint=""
        />
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import InspectResultsPanel from '@/components/inspect/InspectResultsPanel.vue'
import { loadInspectHistory } from '@/utils/inspectCenter'

const props = defineProps({
  refreshKey: { type: Number, default: 0 }
})

const filterType = ref('')
const filterTrigger = ref('')
const page = ref(1)
const pageSize = ref(10)
const list = ref([])
const dialogVisible = ref(false)
const currentRow = ref(null)

function refresh () {
  list.value = loadInspectHistory()
}

onMounted(refresh)

watch(
  () => props.refreshKey,
  () => refresh()
)

const filteredList = computed(() => {
  return list.value.filter((row) => {
    if (filterType.value && row.inspectType !== filterType.value) return false
    if (filterTrigger.value && row.trigger !== filterTrigger.value) return false
    return true
  })
})

const pagedList = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})

const detailStats = computed(() => {
  const s = currentRow.value?.summary
  if (!s) return { total: 0, ok: 0, warn: 0, bad: 0 }
  return {
    total: s.total,
    ok: s.passed,
    warn: s.warning || 0,
    bad: s.failed
  }
})

function scopeSummary (row) {
  return row.inspectType === 'device' ? '全部自检项' : '服务接口'
}

function openDetail (row) {
  currentRow.value = row
  dialogVisible.value = true
}

defineExpose({ refresh })
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.history-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.history-table {
  width: 100%;
}

.history-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.detail-meta {
  font-size: 13px;
  color: $text-secondary;
  margin: 0 0 16px;
}

:deep(.history-detail-dialog) {
  .el-dialog__body {
    max-height: 70vh;
    overflow-y: auto;
    padding-top: 8px;
  }
}
</style>
