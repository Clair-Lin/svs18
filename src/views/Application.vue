<template>
  <div class="application-manage">
    <div class="page-card">
      <div class="search-area">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="应用名称/ID">
            <el-input
              v-model="searchForm.keyword"
              placeholder="请输入应用名称或ID"
              clearable
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 140px">
              <el-option label="全部" value="" />
              <el-option label="启用" value="启用" />
              <el-option label="停用" value="停用" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="x"
              style="width: 340px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="action-bar">
        <el-button type="primary" @click="openAddDialog">新增应用</el-button>
      </div>

      <el-table :data="pagedList" border>
        <el-table-column label="应用名称/ID" min-width="260" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="name-id-cell">
              <span class="primary-line">{{ row.name }}</span>
              <span class="sub-line">{{ row.appId }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <span v-if="row.status === '启用'" class="status-enabled">
              <el-icon class="status-icon" :size="16"><CircleCheck /></el-icon>
              启用
            </span>
            <span v-else class="status-disabled">
              <el-icon class="status-icon" :size="16"><CircleClose /></el-icon>
              停用
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
        <el-table-column label="操作" fixed="right" width="140" align="center">
          <template #default="{ row }">
            <el-dropdown trigger="click" @command="(cmd) => onAppCommand(cmd, row)">
              <span class="app-op-trigger">
                应用操作
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="detail">详情</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑应用</el-dropdown-item>
                  <el-dropdown-item command="credentials">凭证</el-dropdown-item>
                  <el-dropdown-item command="cert">证书配置</el-dropdown-item>
                  <el-dropdown-item command="root">根证书配置</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredList.length"
          :page-sizes="[10, 20, 50]"
        />
      </div>
    </div>

    <el-dialog
      v-model="addVisible"
      title="新增应用"
      width="480px"
      destroy-on-close
      :close-on-click-modal="false"
      @closed="onAddClosed"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="120px">
        <el-form-item label="应用名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入应用名称" clearable maxlength="64" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" :loading="addSubmitting" @click="submitAdd">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="editVisible"
      title="编辑应用"
      width="480px"
      destroy-on-close
      :close-on-click-modal="false"
      @closed="onEditClosed"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="120px">
        <el-form-item label="应用名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入应用名称" clearable maxlength="64" />
        </el-form-item>
        <el-form-item label="应用状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="应用 ID">
          <span class="edit-app-id">{{ editForm.appId }}</span>
          <span class="edit-app-id-hint">应用 ID 由系统生成，不可修改</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" :loading="editSubmitting" @click="submitEdit">确定</el-button>
      </template>
    </el-dialog>

    <AppCredentialDialog ref="credentialDialogRef" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { CircleCheck, CircleClose, ArrowDown } from '@element-plus/icons-vue'
import { initApiAuthForApp } from '@/utils/appApiAuth'
import AppCredentialDialog from '@/components/app/AppCredentialDialog.vue'

const router = useRouter()
const credentialDialogRef = ref(null)

const pad2 = (n) => String(n).padStart(2, '0')
const formatDateTime = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`

/** 简易原型 ID（非真 UUID） */
function genAppId () {
  const t = Date.now().toString(16)
  const r = Math.random().toString(16).slice(2, 10)
  return `${t}${r}`.slice(0, 24)
}

const searchForm = reactive({
  keyword: '',
  status: '',
  dateRange: null
})

const page = ref(1)
const pageSize = ref(10)

const appList = ref([
  {
    id: '1',
    name: 'test',
    appId: '6a056db7e0221707c8c9307a',
    status: '启用',
    createTime: '2026-05-14 14:36:23',
    createTimeMs: new Date('2026-05-14T14:36:23').getTime()
  }
])

/** 演示应用补全接入凭证（应用密钥在创建时自动生成，供「凭证」查看） */
initApiAuthForApp('6a056db7e0221707c8c9307a')

const filteredList = computed(() => {
  const kw = searchForm.keyword.trim().toLowerCase()
  const st = searchForm.status
  const range = searchForm.dateRange

  return appList.value.filter((row) => {
    if (kw) {
      const hit =
        String(row.name || '').toLowerCase().includes(kw) ||
        String(row.appId || '').toLowerCase().includes(kw)
      if (!hit) return false
    }
    if (st && row.status !== st) return false
    if (range && range.length === 2) {
      const [a, b] = range.map(Number)
      if (row.createTimeMs < a || row.createTimeMs > b) return false
    }
    return true
  })
})

const pagedList = computed(() => {
  const list = filteredList.value
  const start = (page.value - 1) * pageSize.value
  return list.slice(start, start + pageSize.value)
})

watch(
  () => filteredList.value.length,
  (len) => {
    const pages = Math.max(1, Math.ceil(len / pageSize.value) || 1)
    if (page.value > pages) page.value = pages
  }
)

const handleSearch = () => {
  page.value = 1
  ElMessage.success('已查询（原型演示）')
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.dateRange = null
  page.value = 1
}

const addVisible = ref(false)
const addFormRef = ref(null)
const addSubmitting = ref(false)
const addForm = reactive({ name: '' })
const addRules = {
  name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }]
}

const editVisible = ref(false)
const editFormRef = ref(null)
const editSubmitting = ref(false)
const editingRowId = ref(null)
const editForm = reactive({ name: '', status: '启用', appId: '' })
const editRules = {
  name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择应用状态', trigger: 'change' }]
}

function openAddDialog () {
  addForm.name = ''
  addVisible.value = true
}

function onAddClosed () {
  addForm.name = ''
  addSubmitting.value = false
}

function submitAdd () {
  addFormRef.value?.validate((valid) => {
    if (!valid) return
    addSubmitting.value = true
    const now = new Date()
    setTimeout(() => {
      const newAppId = genAppId()
      initApiAuthForApp(newAppId)
      appList.value.unshift({
        id: `app_${Date.now()}`,
        name: addForm.name.trim(),
        appId: newAppId,
        status: '启用',
        createTime: formatDateTime(now),
        createTimeMs: now.getTime()
      })
      addSubmitting.value = false
      addVisible.value = false
      page.value = 1
      ElMessage.success('应用已添加（原型演示）')
    }, 300)
  })
}

function openEditDialog (row) {
  editingRowId.value = row.id
  editForm.name = row.name
  editForm.status = row.status
  editForm.appId = row.appId
  editVisible.value = true
}

function onEditClosed () {
  editingRowId.value = null
  editForm.name = ''
  editForm.status = '启用'
  editForm.appId = ''
  editSubmitting.value = false
}

function submitEdit () {
  editFormRef.value?.validate((valid) => {
    if (!valid) return
    const target = appList.value.find((item) => item.id === editingRowId.value)
    if (!target) {
      ElMessage.warning('应用不存在或已删除')
      return
    }
    editSubmitting.value = true
    setTimeout(() => {
      target.name = editForm.name.trim()
      target.status = editForm.status
      editSubmitting.value = false
      editVisible.value = false
      ElMessage.success('应用信息已更新（原型演示）')
    }, 300)
  })
}

function goAppDetail (row) {
  router.push({
    path: '/application/detail',
    query: {
      appId: row.appId,
      name: row.name,
      status: row.status,
      createTime: row.createTime
    }
  })
}

function onAppCommand (cmd, row) {
  switch (cmd) {
    case 'detail':
      goAppDetail(row)
      break
    case 'edit':
      openEditDialog(row)
      break
    case 'credentials':
      credentialDialogRef.value?.open(row)
      break
    case 'cert':
      router.push({
        path: '/application/cert-link',
        query: { appId: row.appId, name: row.name }
      })
      break
    case 'root':
      router.push({
        path: '/application/root-cert-config',
        query: { appId: row.appId, name: row.name }
      })
      break
    default:
      break
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.application-manage {
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

    .el-form-item {
      margin-bottom: 0;
    }
  }

  .action-bar {
    margin-bottom: 16px;
  }

  .name-id-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .primary-line {
      font-weight: 500;
      color: $text-primary;
    }

    .sub-line {
      font-size: 12px;
      color: $text-secondary;
      line-height: 1.4;
      word-break: break-all;
    }
  }

  .status-enabled {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #52c41a;

    .status-icon {
      flex-shrink: 0;
    }
  }

  .status-disabled {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: $text-secondary;

    .status-icon {
      flex-shrink: 0;
    }
  }

  .app-op-trigger {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    color: $primary-color;
    font-size: 13px;
    user-select: none;

    &:hover {
      opacity: 0.85;
    }
  }

  .pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .edit-app-id {
    display: block;
    font-family: Consolas, 'Courier New', monospace;
    font-size: 13px;
    color: $text-primary;
    word-break: break-all;
    line-height: 1.5;
  }

  .edit-app-id-hint {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    color: $text-secondary;
  }
}
</style>
