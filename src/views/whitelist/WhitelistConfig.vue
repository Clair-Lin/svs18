<template>
  <div class="whitelist-config">
    <div class="page-card whitelist-card">
      <div class="whitelist-tip">
        <el-icon class="whitelist-tip__icon"><InfoFilled /></el-icon>
        <div class="whitelist-tip__text">白名单仅针对签名验签运算服务接口</div>
        <el-tooltip placement="top" effect="dark" :show-after="200" popper-class="whitelist-help-tooltip">
          <template #content>
            <div class="whitelist-help-content">
              <div>白名单配置用于限制可访问签名验签服务接口的来源地址，该功能仅针对 <strong>签名验签运算服务</strong>！</div>
              <div>配置白名单后，只有在白名单内的ip才能调用 <strong>签名验签运算服务</strong>，其他服务不受影响！</div>
            </div>
          </template>
          <span class="whitelist-tip__help">?</span>
        </el-tooltip>
      </div>

      <div class="toolbar">
        <el-button type="primary" @click="handleOpenAdd">新增</el-button>
        <el-button
          :disabled="!selectedRows.length"
          @click="batchDelete"
        >
          批量删除
        </el-button>
      </div>

      <el-table
        ref="tableRef"
        :data="paginatedList"
        border
        stripe
        row-key="id"
        class="whitelist-table"
        empty-text="暂无数据"
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection" width="48" reserve-selection />
        <el-table-column label="IP白名单" min-width="280">
          <template #default="{ row }">
            {{ row.segment }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" size="small" link @click="confirmDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next"
          :total="ipList.length"
          :page-sizes="[10, 20, 50]"
        />
      </div>
    </div>

    <el-dialog
      v-model="addVisible"
      title="新增IP白名单"
      width="560px"
      destroy-on-close
      @closed="onAddDialogClosed"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
        @submit.prevent
      >
        <el-form-item label="IP白名单" prop="rawText" required>
          <el-input
            v-model="addForm.rawText"
            type="textarea"
            :rows="2"
            placeholder="请输入IP白名单，多个IP用英文 ',' 逗号分隔"
          />
          <p class="field-hint">
            多个IP用英文 ',' 逗号分隔；网段可以用 '*' 号或 '/xx' 代替，'/xx' 中的 'xx' 取值范围为1~32之间的整数
          </p>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="ipList.length >= WHITELIST_MAX"
          @click="handleAddSubmit"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
import {
  parseCommaSeparatedSegments,
  findOverlappingRow,
  segmentToRange,
  displayIpSegment
} from '@/utils/whitelistIp.js'

const WHITELIST_MAX = 1000

const addVisible = ref(false)
const addFormRef = ref(null)
const tableRef = ref(null)
const selectedRows = ref([])
const page = ref(1)
const pageSize = ref(10)

const addForm = reactive({
  rawText: ''
})

const addFormRules = {
  rawText: [
    {
      validator (_r, v, cb) {
        const parsed = parseCommaSeparatedSegments(v)
        if (parsed.error) return cb(new Error(parsed.error))
        cb()
      },
      trigger: ['blur', 'change']
    }
  ]
}

function genId () {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

const ipList = ref([])

const paginatedList = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return ipList.value.slice(start, start + pageSize.value)
})

watch(pageSize, () => {
  page.value = 1
})

watch(
  () => ipList.value.length,
  () => {
    const maxPage = Math.max(1, Math.ceil(ipList.value.length / pageSize.value) || 1)
    if (page.value > maxPage) page.value = maxPage
  }
)

function onAddDialogClosed () {
  addForm.rawText = ''
}

function handleOpenAdd () {
  if (ipList.value.length >= WHITELIST_MAX) {
    ElMessage.warning(`白名单最多 ${WHITELIST_MAX} 条，请先删除后再添加`)
    return
  }
  addForm.rawText = ''
  addVisible.value = true
}

async function handleAddSubmit () {
  const form = addFormRef.value
  if (!form) return
  try {
    await form.validate()
  } catch {
    return
  }
  const parsed = parseCommaSeparatedSegments(addForm.rawText)
  if (parsed.error) {
    ElMessage.error(parsed.error)
    return
  }
  const { segments } = parsed
  const room = WHITELIST_MAX - ipList.value.length
  if (segments.length > room) {
    ElMessage.warning(`最多还可添加 ${room} 条`)
    return
  }

  const pending = []
  for (const seg of segments) {
    const range = segmentToRange(seg)
    const hit = findOverlappingRow(range, [...ipList.value, ...pending], null)
    if (hit) {
      const hitLabel = hit.segment != null ? hit.segment : displayIpSegment(hit)
      ElMessage.error(`与已有条目重叠：${hitLabel}（本次输入：${seg}）`)
      return
    }
    pending.push({ id: genId(), segment: seg })
  }

  ipList.value.push(...pending)
  ElMessage.success(pending.length > 1 ? `已添加 ${pending.length} 条` : '添加成功')
  addVisible.value = false
}

function confirmDelete (row) {
  ElMessageBox.confirm(
    `确定删除该 IP 白名单：${row.segment}？`,
    '删除确认',
    { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' }
  )
    .then(() => {
      const i = ipList.value.findIndex((r) => r.id === row.id)
      if (i > -1) ipList.value.splice(i, 1)
      tableRef.value?.clearSelection?.()
      ElMessage.success('已删除')
    })
    .catch(() => {})
}

function onSelectionChange (rows) {
  selectedRows.value = rows
}

function batchDelete () {
  const n = selectedRows.value.length
  if (!n) return
  ElMessageBox.confirm(
    `确定删除选中的 ${n} 条 IP 白名单吗？`,
    '删除确认',
    { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' }
  )
    .then(() => {
      const ids = new Set(selectedRows.value.map((r) => r.id))
      ipList.value = ipList.value.filter((r) => !ids.has(r.id))
      tableRef.value?.clearSelection?.()
      ElMessage.success(`已删除 ${n} 条`)
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.whitelist-card {
  padding: 16px 18px 0;
  border-radius: 0;
  box-shadow: none;
}

.whitelist-tip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  margin-bottom: 16px;
  background: #e6f4ff;
  color: $text-primary;
  line-height: 1.45;
}

.whitelist-tip__icon {
  color: $primary-color;
  font-size: 18px;
  flex-shrink: 0;
}

.whitelist-tip__text {
  font-size: 13px;
  font-weight: 500;
}

.whitelist-tip__help {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-left: 2px;
  border: 1px solid $primary-color;
  border-radius: 50%;
  color: $primary-color;
  font-size: 12px;
  line-height: 1;
  cursor: help;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

:deep(.whitelist-table) {
  .el-table__header-wrapper th.el-table__cell {
    background-color: #f5f5f5 !important;
    color: $text-primary;
    font-weight: 500;
  }

  .el-table__empty-block {
    min-height: 286px;
  }

  .el-table__empty-text {
    color: $text-primary;
  }
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.field-hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: $text-muted;
  line-height: 1.5;
}
</style>
