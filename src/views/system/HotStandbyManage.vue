<template>
  <div class="hot-standby-manage">
      <div class="action-bar">
        <el-button type="primary" :loading="refreshing" @click="onRefresh">刷新</el-button>
      </div>

      <el-table :data="tableData" border class="sys-table" empty-text="暂无数据">
        <el-table-column prop="role" label="角色" width="120" align="center" />
        <el-table-column prop="nodeId" label="节点ID" min-width="140" />
        <el-table-column prop="nodeIp" label="节点IP" min-width="160" />
        <el-table-column prop="joinTime" label="加入时间" width="180" align="center" />
        <el-table-column label="状态" width="140" align="center">
          <template #default="{ row }">
            <span class="status-cell" :class="statusClass(row.status)">
              <span class="status-dot" aria-hidden="true" />
              {{ row.status }}
            </span>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { loadHotStandbyNodes, persistHotStandbyNodes, statusClass } from '@/utils/systemHotStandby'

const tableData = ref([])
const refreshing = ref(false)

function loadTable () {
  tableData.value = loadHotStandbyNodes()
}

function onRefresh () {
  refreshing.value = true
  setTimeout(() => {
    loadTable()
    refreshing.value = false
    ElMessage.success('热备节点列表已刷新（原型演示）')
  }, 400)
}

onMounted(loadTable)
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.hot-standby-manage {
  .action-bar {
    margin-bottom: 12px;
  }

  :deep(.sys-table) {
    .el-table__header-wrapper th.el-table__cell {
      background-color: #f5f7fa !important;
      color: $text-primary;
      font-weight: 600;
    }
  }

  .status-cell {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;

    &.is-init {
      color: #909399;
    }

    &.is-sync {
      color: #faad14;
    }

    &.is-active {
      color: #52c41a;
    }

    &.is-error {
      color: #f5222d;
    }
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
}
</style>
