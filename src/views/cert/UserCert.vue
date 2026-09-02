<template>
  <div class="user-cert">
    <div class="page-card">
      <!-- <h2 class="user-cert__title">用户证书管理</h2> -->

      <div class="search-area">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="证书名称">
            <el-input
              v-model="searchForm.certName"
              placeholder="请输入证书名称"
              clearable
              class="user-cert__field"
            />
          </el-form-item>
          <el-form-item label="证书序列号">
            <el-input
              v-model="searchForm.serialNumber"
              placeholder="请输入证书序列号"
              clearable
              class="user-cert__field"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              查询
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="toolbar">
        <el-button type="primary" @click="openImportDialog">导入证书</el-button>
        <el-button type="primary" :disabled="!selectedRows.length" @click="batchDelete">批量删除</el-button>
      </div>

      <el-table
        ref="tableRef"
        :data="pagedList"
        border
        row-key="id"
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection" width="48" align="center" reserve-selection />
        <el-table-column prop="certName" label="证书名称" min-width="140" show-overflow-tooltip />
        <el-table-column prop="serialNumber" label="证书序列号" width="130" show-overflow-tooltip />
        <el-table-column prop="subject" label="证书主题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="issuer" label="颁发者" min-width="180" show-overflow-tooltip />
        <el-table-column label="证书状态" width="100" align="center">
          <template #default="{ row }">
            <span class="status-tag" :class="statusClass(row.status)">{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="certType" label="证书类型" width="110" show-overflow-tooltip />
        <el-table-column prop="signAlgorithm" label="签名算法" width="120" show-overflow-tooltip />
        <el-table-column prop="issuedAt" label="签发时间" width="168" align="center" />
        <el-table-column prop="expiresAt" label="过期时间" width="168" align="center" />
        <el-table-column label="操作" width="88" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" link @click="removeOne(row)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredList.length"
          :page-sizes="[10, 20, 50, 100]"
        />
      </div>
    </div>

    <el-dialog
      v-model="importVisible"
      title="导入用户证书"
      width="520px"
      class="user-cert-import-dialog"
      destroy-on-close
      :close-on-click-modal="false"
      @closed="onImportClosed"
    >
      <el-form
        ref="importFormRef"
        class="user-cert-import-form"
        :model="importForm"
        :rules="importRules"
        label-width="108px"
      >
        <el-form-item label="证书名称" prop="certDisplayName">
          <el-input
            v-model="importForm.certDisplayName"
            placeholder="请输入证书名称"
            clearable
            maxlength="128"
            class="user-cert-import-form__control"
          />
        </el-form-item>
        <el-form-item label="证书文件" prop="fileName">
          <div class="user-cert-import-form__file-block">
            <el-upload
              class="user-cert-import-upload"
              action="#"
              :auto-upload="false"
              :limit="1"
              :on-change="onImportFileChange"
              :on-remove="onImportFileRemove"
              accept=".cer,.pem,.der"
            >
              <el-button type="primary">点击上传</el-button>
            </el-upload>
            <p class="user-cert-import-form__hint">证书文件格式支持.cer、.pem、.der</p>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="importVisible = false">取消</el-button>
        <el-button type="primary" @click="submitImport">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect } from 'vue'
import { setPageBreadcrumbItems } from '@/composables/pageBreadcrumb'
import { ElMessage, ElMessageBox } from 'element-plus'

watchEffect(() => {
  setPageBreadcrumbItems([
    { label: '签名验签管理' },
    { label: '用户证书管理' }
  ])
})

const searchForm = reactive({
  certName: '',
  serialNumber: ''
})

const allRows = ref([])

const filteredList = computed(() => {
  const n = searchForm.certName.trim()
  const s = searchForm.serialNumber.trim()
  return allRows.value.filter((row) => {
    if (n && !String(row.certName || '').includes(n)) return false
    if (s && !String(row.serialNumber || '').toLowerCase().includes(s.toLowerCase())) return false
    return true
  })
})

const page = ref(1)
const pageSize = ref(10)

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

const tableRef = ref(null)
const selectedRows = ref([])

function onSelectionChange (rows) {
  selectedRows.value = rows
}

function statusClass (status) {
  if (status === '有效') return 'success'
  if (status === '即将过期') return 'warning'
  if (status === '已过期' || status === '已吊销') return 'danger'
  return ''
}

const handleSearch = () => {
  page.value = 1
  ElMessage.success('已查询（原型演示）')
}

const handleReset = () => {
  searchForm.certName = ''
  searchForm.serialNumber = ''
  page.value = 1
}

function removeOne (row) {
  ElMessageBox.confirm('确定删除该用户证书吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      allRows.value = allRows.value.filter((r) => r.id !== row.id)
      tableRef.value?.toggleRowSelection?.(row, false)
      ElMessage.success('已删除')
    })
    .catch(() => {})
}

function batchDelete () {
  if (!selectedRows.value.length) return
  ElMessageBox.confirm(`确定批量删除选中的 ${selectedRows.value.length} 条证书吗？`, '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      const ids = new Set(selectedRows.value.map((r) => r.id))
      allRows.value = allRows.value.filter((r) => !ids.has(r.id))
      selectedRows.value = []
      tableRef.value?.clearSelection?.()
      ElMessage.success('已批量删除')
    })
    .catch(() => {})
}

const importVisible = ref(false)
const importFormRef = ref(null)
const importForm = reactive({ certDisplayName: '', fileName: '', fileRaw: null })
const importRules = {
  certDisplayName: [{ required: true, message: '请输入证书名称', trigger: 'blur' }],
  fileName: [{ required: true, message: '请上传证书文件', trigger: 'change' }]
}

function openImportDialog () {
  importForm.certDisplayName = ''
  importForm.fileName = ''
  importForm.fileRaw = null
  importVisible.value = true
}

function onImportClosed () {
  importForm.certDisplayName = ''
  importForm.fileName = ''
  importForm.fileRaw = null
}

function onImportFileChange (file) {
  importForm.fileName = file?.name || ''
  importForm.fileRaw = file?.raw || null
  importFormRef.value?.validateField('fileName')
}

function onImportFileRemove () {
  importForm.fileName = ''
  importForm.fileRaw = null
}

function submitImport () {
  importFormRef.value?.validate((valid) => {
    if (!valid) return
    const now = new Date()
    const pad = (x) => String(x).padStart(2, '0')
    const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    allRows.value.unshift({
      id: `uc_${Date.now()}`,
      certName: importForm.certDisplayName.trim(),
      serialNumber: `IMP${Date.now().toString(16).slice(-10)}`,
      subject: '/C=CN/CN=imported-user-cert',
      issuer: 'CN=Demo User CA, O=SVS, C=CN',
      status: '有效',
      certType: '用户证书',
      signAlgorithm: 'SM3WithSM2',
      issuedAt: ts,
      expiresAt: '2036-12-31 23:59:59'
    })
    importVisible.value = false
    page.value = 1
    ElMessage.success('证书已导入（原型演示）')
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.user-cert {
  .user-cert__title {
    margin: 0 0 16px;
    font-size: 18px;
    font-weight: 600;
    color: $text-primary;
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

    .el-form-item {
      margin-bottom: 0;
    }
  }

  .user-cert__field {
    width: 90%;
    max-width: 240px;
  }

  .toolbar {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .status-tag {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;

    &.success {
      background: #f6ffed;
      color: #52c41a;
    }
    &.warning {
      background: #fffbe6;
      color: #faad14;
    }
    &.danger {
      background: #fff2f0;
      color: #ff4d4f;
    }
  }
}

.user-cert-import-dialog {
  :deep(.el-dialog__header) {
    padding: 14px 16px 10px;
    margin-right: 0;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-dialog__body) {
    padding: 20px 20px 8px;
  }

  :deep(.el-dialog__footer) {
    padding: 12px 16px 16px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}

.user-cert-import-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-form-item__label) {
    font-weight: 400;
  }
}

.user-cert-import-form__control {
  width: 68%;
  max-width: 360px;
}

.user-cert-import-form__file-block {
  width: 68%;
  max-width: 360px;
}

.user-cert-import-upload {
  width: 100%;
}

.user-cert-import-form__hint {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: $text-secondary;
}
</style>
