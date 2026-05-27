<template>
  <el-dialog
    :model-value="modelValue"
    title="选择证书"
    width="960px"
    class="select-cert-dialog"
    align-center
    :close-on-click-modal="false"
    destroy-on-close
    @update:model-value="onVisibleChange"
    @closed="handleClosed"
  >
    <div class="select-cert-dialog__toolbar">
      <el-form :inline="true" class="select-cert-dialog__search" @submit.prevent>
        <el-form-item label="密钥编码">
          <el-input
            v-model="draftKeyCode"
            placeholder="请输入密钥编码"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="证书名称">
          <el-input
            v-model="draftCertName"
            placeholder="请输入证书名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <p class="select-cert-dialog__selected-tip">已选 {{ selectedCount }} 个证书</p>

    <el-table
      :data="pagedRows"
      border
      class="select-cert-dialog__table"
      max-height="380"
      @row-click="handleRowClick"
    >
      <el-table-column width="52" align="center" fixed="left">
        <template #default="{ row }">
          <el-radio v-model="radioId" :value="row.id" class="select-cert-dialog__radio">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="证书名称/密钥编码" min-width="220" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="name-key-cell">
            <span class="primary-line">{{ displayCertName(row) }}</span>
            <span class="sub-line">{{ row.keyCode || '—' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="algorithm" label="算法类型" width="130" show-overflow-tooltip />
      <el-table-column label="颁发者" min-width="160" show-overflow-tooltip>
        <template #default="{ row }">
          {{ displayIssuer(row) }}
        </template>
      </el-table-column>
      <el-table-column label="证书主题" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">
          {{ displaySubject(row) }}
        </template>
      </el-table-column>
      <el-table-column prop="serialNumber" label="证书序列号" min-width="160" show-overflow-tooltip />
      <el-table-column prop="certType" label="证书类型" width="110" align="center" />
    </el-table>

    <div class="select-cert-dialog__pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        class="select-cert-dialog__pagination-inner"
        size="small"
        background
        layout="total, sizes, prev, pager, next"
        :total="filteredRows.length"
        :page-sizes="[10, 20, 50, 100]"
      />
    </div>

    <template #footer>
      <div class="select-cert-dialog__footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" :disabled="!radioId" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** 列表项须含 id；展示字段 certName 或 appCertName、keyCode、algorithm、issuer/subject 或 issuerCn/subjectCn、serialNumber、certType */
  certificates: { type: Array, default: () => [] },
  initialSelectedId: { type: [String, Number], default: null }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const draftKeyCode = ref('')
const draftCertName = ref('')
const appliedKeyCode = ref('')
const appliedCertName = ref('')
const radioId = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)

const selectedCount = computed(() => (radioId.value != null && radioId.value !== '' ? 1 : 0))

const filteredRows = computed(() => {
  const k = appliedKeyCode.value.trim().toLowerCase()
  const n = appliedCertName.value.trim().toLowerCase()
  return props.certificates.filter((c) => {
    const keyOk = !k || String(c.keyCode ?? '').toLowerCase().includes(k)
    const name = displayCertName(c)
    const nameOk = !n || String(name).toLowerCase().includes(n)
    return keyOk && nameOk
  })
})

const pagedRows = computed(() => {
  const list = filteredRows.value
  const start = (currentPage.value - 1) * pageSize.value
  return list.slice(start, start + pageSize.value)
})

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    radioId.value = props.initialSelectedId ?? null
    draftKeyCode.value = ''
    draftCertName.value = ''
    appliedKeyCode.value = ''
    appliedCertName.value = ''
    currentPage.value = 1
    pageSize.value = 10
  }
)

watch(pageSize, () => {
  currentPage.value = 1
})

watch(
  () => filteredRows.value,
  (list) => {
    const pages = Math.max(1, Math.ceil(list.length / pageSize.value) || 1)
    if (currentPage.value > pages) currentPage.value = pages
  },
  { deep: true }
)

function displayCertName (row) {
  return row.certName ?? row.appCertName ?? '—'
}

function displayIssuer (row) {
  return row.issuer ?? row.issuerCn ?? '—'
}

function displaySubject (row) {
  return row.subject ?? row.subjectCn ?? '—'
}

function handleSearch () {
  appliedKeyCode.value = draftKeyCode.value.trim()
  appliedCertName.value = draftCertName.value.trim()
  currentPage.value = 1
}

function handleReset () {
  draftKeyCode.value = ''
  draftCertName.value = ''
  appliedKeyCode.value = ''
  appliedCertName.value = ''
  currentPage.value = 1
}

function handleRowClick (row) {
  radioId.value = row.id
}

function onVisibleChange (v) {
  emit('update:modelValue', v)
}

function close () {
  emit('update:modelValue', false)
}

function handleConfirm () {
  const id = radioId.value
  const row = props.certificates.find((c) => c.id === id)
  if (!row) return
  emit('confirm', row)
  emit('update:modelValue', false)
}

function handleClosed () {
  handleReset()
  radioId.value = null
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.select-cert-dialog__toolbar {
  margin-bottom: 8px;
}

.select-cert-dialog__search {
  margin-bottom: 0;

  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.select-cert-dialog__selected-tip {
  margin: 0 0 10px;
  font-size: 14px;
  color: $text-secondary;
  line-height: 22px;
}

.select-cert-dialog__table {
  width: 100%;

  /* 仅表头有底色，数据行纯白、无斑马纹与悬停底色 */
  :deep(.el-table__header-wrapper th.el-table__cell) {
    background-color: #f5f7fa !important;
    color: $text-primary;
    font-weight: 600;
  }

  :deep(.el-table__body-wrapper .el-table__body tr > td.el-table__cell) {
    background-color: #fff !important;
  }

  :deep(.el-table__body-wrapper .el-table__body tr:hover > td.el-table__cell) {
    background-color: #fff !important;
  }

  :deep(.el-table__body-wrapper .el-table__body tr.current-row > td.el-table__cell) {
    background-color: #fff !important;
  }
}

.select-cert-dialog__radio {
  height: 22px;
  line-height: 22px;
}

.name-key-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  .primary-line {
    font-size: 14px;
    color: $text-primary;
    line-height: 22px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sub-line {
    font-size: 12px;
    color: $text-muted;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.select-cert-dialog__pagination {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}

.select-cert-dialog__pagination-inner {
  :deep(.el-pagination__total),
  :deep(.el-pagination__jump),
  :deep(.el-select .el-input__inner) {
    font-size: 12px;
  }

  :deep(.el-pagination__sizes .el-select .el-input__wrapper) {
    min-height: 26px;
    padding: 0 8px;
  }

  :deep(.el-pagination__sizes .el-select .el-input__inner) {
    height: 26px;
    line-height: 26px;
    font-size: 12px;
  }

  :deep(.btn-prev),
  :deep(.btn-next),
  :deep(.el-pager li) {
    min-width: 26px;
    height: 26px;
    line-height: 26px;
    font-size: 12px;
  }
}

.select-cert-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>

<style lang="scss">
/* 紧凑内边距：减轻标题/正文/页脚四周留白 */
.select-cert-dialog.el-dialog {
  --el-dialog-padding-primary: 18px;

  padding: 0;

  .el-dialog__header {
    padding: 20px 32px 20px 20px;
    margin-right: 0;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;
  }

  .el-dialog__header.show-close {
    padding-right: 32px;
  }

  .el-dialog__headerbtn {
    top: 10px;
    right: 4px;
    width: 28px;
    height: 28px;
  }

  .el-dialog__title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    line-height: 22px;
  }

  .el-dialog__body {
    padding: 20px 20px 20px 20px;
  }

  .el-dialog__footer {
    padding: 20px 20px 20px 20px;
    border-top: 1px solid #f0f0f0;
  }
}
</style>
