<template>
  <div class="admin-manage">
    <div class="page-card">
      <div class="card-title">管理员管理</div>
      <div class="search-toolbar">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="账号">
            <el-input
              v-model="searchForm.account"
              placeholder="请输入账号"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入姓名"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
              <el-option label="全部" value="" />
              <el-option label="已激活" value="已激活" />
              <el-option label="已锁定" value="已锁定" />
              <el-option label="已注销" value="已注销" />
            </el-select>
          </el-form-item>
          <el-form-item class="search-actions">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="action-bar">
        <el-button type="primary" @click="handleAdd">新增管理员</el-button>
      </div>
      <el-table
        :data="pagedList"
        border
        class="sys-table"
        empty-text="暂无数据"
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection" width="48" align="center" />
        <el-table-column prop="account" label="账号" min-width="120" />
        <el-table-column prop="name" label="姓名" width="100">
          <template #default="{ row }">
            {{ row.name || '—' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110" align="center">
          <template #default="{ row }">
            <span class="status-cell" :class="statusClass(row.status)">
              <span class="status-dot" aria-hidden="true" />
              {{ row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" min-width="140" />
        <el-table-column prop="organization" label="所属组织" min-width="120">
          <template #default="{ row }">
            {{ row.organization || '—' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
        <el-table-column label="操作" min-width="220" fixed="right" align="center">
          <template #default="{ row }">
            <div class="row-actions">
              <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
              <el-button
                v-if="row.allowLock"
                type="primary"
                link
                @click="handleLock(row)"
              >
                锁定
              </el-button>
              <el-button
                v-if="row.allowDeactivate"
                type="primary"
                link
                @click="handleDeactivate(row)"
              >
                注销
              </el-button>
              <el-button type="primary" link @click="handleResetPassword(row)">重置密码</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next"
          :total="filteredList.length"
          :page-sizes="[10, 20, 50]"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const searchForm = reactive({
  account: '',
  name: '',
  status: ''
})
const page = ref(1)
const pageSize = ref(10)
const selectedRows = ref([])
const adminList = ref([
  {
    id: 1,
    account: 'audit',
    name: '',
    status: '已激活',
    role: '平台审计管理员',
    organization: '',
    createTime: '2025-03-23 15:58:32',
    allowLock: true,
    allowDeactivate: true
  },
  {
    id: 2,
    account: 'app_admin',
    name: '',
    status: '已激活',
    role: '平台业务管理员',
    organization: '',
    createTime: '2025-08-05 10:49:12',
    allowLock: true,
    allowDeactivate: true
  },
  {
    id: 3,
    account: 'svssysadmin',
    name: '',
    status: '已激活',
    role: '平台系统管理员',
    organization: '',
    createTime: '2025-06-27 17:47:44',
    allowLock: false,
    allowDeactivate: false
  }
])
const filteredList = computed(() =>
  adminList.value.filter((row) => {
    if (searchForm.account && !row.account.includes(searchForm.account.trim())) {
      return false
    }
    if (searchForm.name && !(row.name || '').includes(searchForm.name.trim())) {
      return false
    }
    if (searchForm.status && row.status !== searchForm.status) return false
    return true
  })
)
const pagedList = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})
function statusClass (status) {
  if (status === '已激活') return 'is-on'
  if (status === '已锁定') return 'is-warn'
  return 'is-off'
}
function onSelectionChange (rows) {
  selectedRows.value = rows
}
function handleSearch () {
  page.value = 1
}
function handleReset () {
  searchForm.account = ''
  searchForm.name = ''
  searchForm.status = ''
  page.value = 1
}
function handleAdd () {
  ElMessage.info('新增管理员（原型演示）')
}
function handleEdit (row) {
  ElMessage.info(`编辑管理员「${row.account}」（原型演示）`)
}
function handleLock (row) {
  ElMessageBox.confirm(`确定要锁定账号「${row.account}」吗？`, '提示', { type: 'warning' })
    .then(() => {
      row.status = '已锁定'
      ElMessage.success('账号已锁定（原型演示）')
    })
    .catch(() => {})
}
function handleDeactivate (row) {
  ElMessageBox.confirm(`确定要注销账号「${row.account}」吗？`, '提示', { type: 'warning' })
    .then(() => {
      row.status = '已注销'
      ElMessage.success('账号已注销（原型演示）')
    })
    .catch(() => {})
}
function handleResetPassword (row) {
  ElMessage.info(`重置「${row.account}」密码（原型演示）`)
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.admin-manage {
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 16px;
  }
  .search-toolbar {
    margin-bottom: 12px;
  }
  .search-form {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    :deep(.el-form-item) {
      margin-bottom: 12px;
      margin-right: 16px;
    }
    .search-actions {
      margin-left: auto;
      margin-right: 0;
    }
  }
  .action-bar {
    margin-bottom: 12px;
  }
  .pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
  :deep(.sys-table) {
    .el-table__header-wrapper th.el-table__cell {
      background-color: #f5f7fa !important;
      color: $text-primary;
      font-weight: 600;
    }
    .el-table__body tr.el-table__row {
      background-color: #fff !important;
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
    &.is-warn {
      color: #faad14;
    }
    &.is-off {
      color: $text-secondary;
    }
  }
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
  .row-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 8px;
  }
}
</style>
