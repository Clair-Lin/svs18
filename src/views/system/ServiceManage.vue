<template>
  <div class="service-manage">
    <div class="page-card">
      <el-table :data="serviceList" border class="service-table" empty-text="暂无数据">
        <el-table-column prop="ip" label="IP" min-width="140" show-overflow-tooltip />
        <el-table-column prop="port" label="端口" width="100" align="center" />
        <el-table-column label="服务状态" width="140" align="center">
          <template #default="{ row }">
            <span class="service-status" :class="row.running ? 'is-on' : 'is-off'">
              <span class="service-status-dot" aria-hidden="true" />
              {{ row.running ? '已开启' : '已关闭' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.running"
              type="primary"
              link
              :loading="row.toggling"
              @click="toggleService(row, false)"
            >
              关闭
            </el-button>
            <el-button
              v-else
              type="primary"
              link
              :loading="row.toggling"
              @click="toggleService(row, true)"
            >
              开启
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const serviceList = ref([
  {
    id: 'svc-1',
    ip: '127.0.0.1',
    port: '1555',
    running: true,
    toggling: false
  }
])

function toggleService (row, start) {
  const action = start ? '开启' : '关闭'
  ElMessageBox.confirm(`确定要${action}该服务吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      row.toggling = true
      setTimeout(() => {
        row.running = start
        row.toggling = false
        ElMessage.success(`服务已${action}（原型演示）`)
      }, 400)
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.service-manage {
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 16px;
  }

  :deep(.service-table) {
    .el-table__header-wrapper th.el-table__cell {
      background-color: #f5f7fa !important;
      color: $text-primary;
      font-weight: 600;
    }

    .el-table__body tr.el-table__row {
      background-color: #fff !important;
    }

    .el-table__body tr.el-table__row:hover > td.el-table__cell {
      background-color: #fff !important;
    }
  }

  .service-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: $text-secondary;

    &.is-on {
      color: #52c41a;
    }

    &.is-off {
      color: $text-secondary;
    }
  }

  .service-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
    background: currentColor;
  }
}
</style>
