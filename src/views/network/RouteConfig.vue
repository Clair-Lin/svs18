<template>
  <div class="route-config">
    <div class="page-card">
      <div class="page-header">
        <div class="page-title-row">
          <span class="page-title">路由配置</span>
          <el-tooltip placement="top" effect="dark" :show-after="200">
            <template #content>
              <div class="tooltip-text">配置静态路由，系统路由由系统自动生成不可编辑。</div>
            </template>
            <span class="help-icon" aria-label="说明">?</span>
          </el-tooltip>
        </div>
      </div>

      <div class="action-bar">
        <el-button type="primary" @click="openAddDialog">添加路由</el-button>
        <el-button :disabled="!selectedRows.length" @click="handleBatchDelete">删除</el-button>
      </div>

      <el-table
        :data="pagedList"
        border
        class="sys-table"
        empty-text="暂无数据"
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection" width="48" align="center" :selectable="rowSelectable" />
        <el-table-column prop="ipType" label="IP类型" width="90" align="center" />
        <el-table-column prop="routeType" label="路由类型" width="110" align="center" />
        <el-table-column prop="destination" label="目的路由" min-width="140" />
        <el-table-column prop="netmask" label="子网掩码" min-width="140" />
        <el-table-column prop="gateway" label="网关" min-width="140" />
        <el-table-column prop="interface" label="网络接口" width="110" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <span class="status-cell" :class="row.status === '启用' ? 'is-on' : 'is-off'">
              <span class="status-dot" aria-hidden="true" />
              {{ row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <div class="row-actions">
              <el-button
                type="primary"
                link
                :disabled="row.isSystem"
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                type="primary"
                link
                :disabled="row.isSystem"
                @click="handleDelete(row)"
              >
                删除
              </el-button>
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
          :total="list.length"
          :page-sizes="[10, 20, 50]"
        />
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="editingId ? '编辑路由' : '添加路由'"
      width="520px"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <el-form-item label="IP类型" prop="ipType">
          <el-select v-model="form.ipType" class="dialog-field">
            <el-option label="ipv4" value="ipv4" />
            <el-option label="ipv6" value="ipv6" />
          </el-select>
        </el-form-item>
        <el-form-item label="目的路由" prop="destination">
          <el-input v-model="form.destination" placeholder="请输入目的路由" clearable />
        </el-form-item>
        <el-form-item label="子网掩码" prop="netmask">
          <el-input v-model="form.netmask" placeholder="请输入子网掩码" clearable />
        </el-form-item>
        <el-form-item label="网关" prop="gateway">
          <el-input v-model="form.gateway" placeholder="请输入网关" clearable />
        </el-form-item>
        <el-form-item label="网络接口" prop="interface">
          <el-select v-model="form.interface" placeholder="请选择网络接口" class="dialog-field">
            <el-option v-for="p in interfaceOptions" :key="p" :label="p" :value="p" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="禁用">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onDialogConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watchEffect } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { setPageBreadcrumbItems } from '@/composables/pageBreadcrumb'
import { loadNetworkRoutes, persistNetworkRoutes } from '@/utils/networkRoute'

const interfaceOptions = ['ens192', 'eth0', 'eth1', 'bond0']

const list = ref([])
const selectedRows = ref([])
const page = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const editingId = ref(null)
const formRef = ref(null)

const form = reactive({
  ipType: 'ipv4',
  destination: '',
  netmask: '',
  gateway: '',
  interface: 'ens192',
  status: '启用'
})

const formRules = {
  destination: [{ required: true, message: '请输入目的路由', trigger: 'blur' }],
  netmask: [{ required: true, message: '请输入子网掩码', trigger: 'blur' }],
  gateway: [{ required: true, message: '请输入网关', trigger: 'blur' }],
  interface: [{ required: true, message: '请选择网络接口', trigger: 'change' }]
}

const pagedList = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return list.value.slice(start, start + pageSize.value)
})

function loadList () {
  list.value = loadNetworkRoutes()
}

function saveList () {
  persistNetworkRoutes(list.value)
}

function rowSelectable (row) {
  return !row.isSystem
}

function onSelectionChange (rows) {
  selectedRows.value = rows
}

function openAddDialog () {
  editingId.value = null
  dialogVisible.value = true
}

function handleEdit (row) {
  editingId.value = row.id
  Object.assign(form, {
    ipType: row.ipType,
    destination: row.destination,
    netmask: row.netmask,
    gateway: row.gateway,
    interface: row.interface,
    status: row.status
  })
  dialogVisible.value = true
}

function resetForm () {
  editingId.value = null
  form.ipType = 'ipv4'
  form.destination = ''
  form.netmask = ''
  form.gateway = ''
  form.interface = 'ens192'
  form.status = '启用'
}

function onDialogConfirm () {
  formRef.value?.validate((valid) => {
    if (!valid) return
    if (editingId.value) {
      const row = list.value.find((r) => r.id === editingId.value)
      if (row) {
        Object.assign(row, {
          ipType: form.ipType,
          destination: form.destination,
          netmask: form.netmask,
          gateway: form.gateway,
          interface: form.interface,
          status: form.status
        })
      }
      ElMessage.success('路由已更新（原型演示）')
    } else {
      list.value.push({
        id: `custom-${Date.now()}`,
        ipType: form.ipType,
        routeType: '静态路由',
        destination: form.destination,
        netmask: form.netmask,
        gateway: form.gateway,
        interface: form.interface,
        status: form.status,
        isSystem: false
      })
      ElMessage.success('路由已添加（原型演示）')
    }
    saveList()
    dialogVisible.value = false
  })
}

function handleDelete (row) {
  ElMessageBox.confirm('确定要删除该路由吗？', '提示', { type: 'warning' })
    .then(() => {
      list.value = list.value.filter((r) => r.id !== row.id)
      saveList()
      ElMessage.success('路由已删除（原型演示）')
    })
    .catch(() => {})
}

function handleBatchDelete () {
  const ids = selectedRows.value.map((r) => r.id)
  ElMessageBox.confirm(`确定要删除选中的 ${ids.length} 条路由吗？`, '提示', { type: 'warning' })
    .then(() => {
      list.value = list.value.filter((r) => !ids.includes(r.id))
      selectedRows.value = []
      saveList()
      ElMessage.success('已删除选中路由（原型演示）')
    })
    .catch(() => {})
}

watchEffect(() => {
  setPageBreadcrumbItems([
    { label: '网络管理' },
    { label: '路由配置' }
  ])
})

onMounted(loadList)
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.route-config {
  .page-header {
    margin-bottom: 16px;
  }

  .page-title-row {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .page-title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-primary;
  }

  .help-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #c0c4cc;
    font-size: 12px;
    color: #909399;
    cursor: default;
    user-select: none;

    &:hover {
      border-color: $primary-color;
      color: $primary-color;
    }
  }

  .tooltip-text {
    line-height: 1.6;
    font-size: 13px;
  }

  .action-bar {
    display: flex;
    gap: 12px;
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
      font-weight: 600;
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
    justify-content: center;
    gap: 8px;
  }

  .dialog-field {
    width: 100%;
  }
}
</style>
