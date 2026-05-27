<template>
  <div class="permission-manage">
    <div class="page-card">
      <div class="card-title">权限管理</div>

      <div class="search-toolbar">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="角色名称">
            <el-input
              v-model="searchForm.roleName"
              placeholder="请输入角色名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="所属模块">
            <el-select v-model="searchForm.module" placeholder="全部" clearable style="width: 140px">
              <el-option label="全部" value="" />
              <el-option label="审计模块" value="审计模块" />
              <el-option label="业务模块" value="业务模块" />
              <el-option label="系统模块" value="系统模块" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
              <el-option label="全部" value="" />
              <el-option label="已启用" value="已启用" />
              <el-option label="已禁用" value="已禁用" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="action-bar">
        <el-button type="primary" @click="handleAddRole">新增角色</el-button>
      </div>

      <el-table :data="pagedList" border class="sys-table" empty-text="暂无数据">
        <el-table-column prop="roleName" label="角色名称" min-width="160" />
        <el-table-column prop="module" label="所属模块" width="120" />
        <el-table-column prop="description" label="角色描述" min-width="220" show-overflow-tooltip />
        <el-table-column label="状态" width="110" align="center">
          <template #default="{ row }">
            <span class="status-cell" :class="row.status === '已启用' ? 'is-on' : 'is-off'">
              <span class="status-dot" aria-hidden="true" />
              {{ row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <div class="row-actions">
              <el-button
                v-if="row.status === '已启用'"
                type="primary"
                link
                @click="handleToggleStatus(row)"
              >
                禁用
              </el-button>
              <el-button v-else type="primary" link @click="handleToggleStatus(row)">启用</el-button>
              <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
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
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  roleName: '',
  module: '',
  status: ''
})

const page = ref(1)
const pageSize = ref(10)

const roleList = ref([
  {
    id: 1,
    roleName: '平台审计管理员',
    module: '审计模块',
    description: '默认平台审计管理员',
    status: '已启用'
  },
  {
    id: 2,
    roleName: '平台业务管理员',
    module: '业务模块',
    description: '默认平台业务管理员',
    status: '已启用'
  },
  {
    id: 3,
    roleName: '平台系统管理员',
    module: '系统模块',
    description: '默认平台系统管理员',
    status: '已启用'
  }
])

const filteredList = computed(() =>
  roleList.value.filter((row) => {
    if (searchForm.roleName && !row.roleName.includes(searchForm.roleName.trim())) {
      return false
    }
    if (searchForm.module && row.module !== searchForm.module) return false
    if (searchForm.status && row.status !== searchForm.status) return false
    return true
  })
)

const pagedList = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})

function handleSearch () {
  page.value = 1
}

function handleReset () {
  searchForm.roleName = ''
  searchForm.module = ''
  searchForm.status = ''
  page.value = 1
}

function handleAddRole () {
  ElMessage.info('新增角色（原型演示）')
}

function handleToggleStatus (row) {
  row.status = row.status === '已启用' ? '已禁用' : '已启用'
  ElMessage.success(`角色已${row.status === '已启用' ? '启用' : '禁用'}（原型演示）`)
}

function handleDetail (row) {
  ElMessage.info(`查看角色「${row.roleName}」详情（原型演示）`)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.permission-manage {
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
    :deep(.el-form-item) {
      margin-bottom: 12px;
      margin-right: 16px;
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
