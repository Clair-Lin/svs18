<template>
  <el-dialog
    :model-value="modelValue"
    title="关联已有应用证书"
    width="920px"
    class="associate-app-cert-dialog"
    align-center
    :close-on-click-modal="false"
    destroy-on-close
    @update:model-value="onVisibleChange"
    @closed="onClosed"
  >
    <el-table
      ref="tableRef"
      :data="pagedRows"
      border
      row-key="id"
      max-height="400"
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="48" align="center" reserve-selection />
      <el-table-column label="应用证书名称/ID" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="name-id-cell">
            <span class="primary-line">{{ row.appCertName }}</span>
            <span class="sub-line">{{ row.keyNumber || row.id }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="algorithmDisplay" label="算法类型" width="120" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.algorithmDisplay || row.algorithm }}
        </template>
      </el-table-column>
      <el-table-column label="颁发者" min-width="160" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.issuer || '—' }}
        </template>
      </el-table-column>
      <el-table-column prop="serialNumber" label="证书序列号" width="120" show-overflow-tooltip />
      <el-table-column prop="appliedDate" label="申请日期" width="118" align="center" />
      <el-table-column prop="expireDate" label="到期时间" width="118" align="center" />
      <el-table-column prop="certType" label="证书类型" width="100" align="center" />
    </el-table>

    <div class="associate-app-cert-dialog__pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        size="small"
        background
        layout="total, sizes, prev, pager, next"
        :total="certificates.length"
        :page-sizes="[10, 20, 50]"
      />
    </div>

    <p class="associate-app-cert-dialog__tip">请从证书管理库中各选一张<strong>签名证书</strong>与一张<strong>加密证书</strong>（原型演示）。</p>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :disabled="!canConfirm" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** 与证书管理列表字段对齐：id、appCertName、keyNumber、algorithm、algorithmDisplay、issuer、serialNumber、appliedDate、expireDate、certType */
  certificates: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const tableRef = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref([])

const pagedRows = computed(() => {
  const list = props.certificates
  const start = (currentPage.value - 1) * pageSize.value
  return list.slice(start, start + pageSize.value)
})

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      currentPage.value = 1
      selectedRows.value = []
      nextTick(() => {
        tableRef.value?.clearSelection?.()
      })
    }
  }
)

const canConfirm = computed(() => {
  const rows = selectedRows.value
  if (rows.length !== 2) return false
  const hasSign = rows.some((r) => String(r.certType || '').includes('签名'))
  const hasEnc = rows.some((r) => String(r.certType || '').includes('加密'))
  return hasSign && hasEnc
})

function onVisibleChange (v) {
  emit('update:modelValue', v)
}

function close () {
  emit('update:modelValue', false)
}

function onClosed () {
  selectedRows.value = []
}

function onSelectionChange (rows) {
  selectedRows.value = rows
  if (rows.length > 2) {
    const remove = rows.slice(2)
    remove.forEach((r) => {
      tableRef.value?.toggleRowSelection(r, false)
    })
    ElMessage.warning('最多选择两张证书（签名 + 加密各一张）')
  }
}

function handleConfirm () {
  const rows = selectedRows.value
  if (rows.length !== 2) {
    ElMessage.warning('请选择两张证书：一张签名证书、一张加密证书')
    return
  }
  const sign = rows.find((r) => String(r.certType || '').includes('签名'))
  const enc = rows.find((r) => String(r.certType || '').includes('加密'))
  if (!sign || !enc) {
    ElMessage.warning('必须同时包含「签名证书」与「加密证书」各一张')
    return
  }
  emit('confirm', { sign, enc })
  close()
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.associate-app-cert-dialog {
  :deep(.el-dialog__body) {
    padding-top: 8px;
  }
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
    line-height: 1.35;
    word-break: break-all;
  }
}

.associate-app-cert-dialog__pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.associate-app-cert-dialog__tip {
  margin: 12px 0 0;
  font-size: 12px;
  color: $text-secondary;
  line-height: 1.5;
}
</style>
