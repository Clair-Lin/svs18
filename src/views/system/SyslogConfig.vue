<template>
  <div class="syslog-config">
    <div class="page-card">
      <div class="toolbar">
        <el-button type="primary" link class="add-btn" @click="onAdd">
          <el-icon><Plus /></el-icon>
          添加Syslog服务器
        </el-button>
      </div>

      <el-table
        :data="tableData"
        border
        stripe
        class="syslog-table"
        empty-text="暂无数据"
      >
        <el-table-column prop="ip" label="Syslog服务器IP" min-width="200">
          <template #default="{ row }">
            <template v-if="row.isDraft">
              <el-input v-model="draftForm.ip" placeholder="请输入Syslog服务器IP" clearable />
            </template>
            <span v-else>{{ row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="port" label="Syslog服务器端口" min-width="180">
          <template #default="{ row }">
            <template v-if="row.isDraft">
              <el-input v-model="draftForm.port" placeholder="请输入Syslog服务器端口" clearable />
            </template>
            <span v-else>{{ row.port }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <template v-if="row.isDraft">
              <el-button type="primary" link @click="onSaveDraft">保存</el-button>
              <el-button type="primary" link @click="onRemoveDraft">删除</el-button>
            </template>
            <el-button v-else type="primary" link @click="onDeleteSaved(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="savedList.length > 0" class="pagination-wrap">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="savedList.length"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, prev, pager, next, sizes"
          background
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

let idSeq = 1

const savedList = ref([])
/** 是否存在未保存的编辑行（图2） */
const hasDraft = ref(false)
const draftForm = ref({ ip: '', port: '' })

const page = ref(1)
const pageSize = ref(10)

const pagedSaved = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return savedList.value.slice(start, start + pageSize.value)
})

const tableData = computed(() => {
  const rows = []
  if (hasDraft.value) {
    rows.push({ rowKey: 'draft', isDraft: true })
  }
  for (const s of pagedSaved.value) {
    rows.push({ rowKey: `s-${s.id}`, isDraft: false, id: s.id, ip: s.ip, port: s.port })
  }
  return rows
})

watch([() => savedList.value.length, () => pageSize.value], () => {
  const max = Math.max(1, Math.ceil(savedList.value.length / pageSize.value) || 1)
  if (page.value > max) page.value = max
})

/** IPv4 按段 0–255；含冒号视为 IPv6 粗判（原型） */
function validateIp(ip) {
  const t = (ip || '').trim()
  if (!t) return false
  if (t.includes(':') && t.length >= 3) return true
  const parts = t.split('.')
  if (parts.length !== 4) return false
  return parts.every((p) => {
    if (!/^\d{1,3}$/.test(p)) return false
    const n = Number(p)
    return n >= 0 && n <= 255
  })
}

function onAdd() {
  if (hasDraft.value) {
    ElMessage.warning('请先保存或删除当前编辑行')
    return
  }
  hasDraft.value = true
  draftForm.value = { ip: '', port: '' }
}

function onSaveDraft() {
  const ip = draftForm.value.ip?.trim() ?? ''
  const portStr = draftForm.value.port?.trim() ?? ''
  if (!validateIp(ip)) {
    ElMessage.error('请输入有效的 Syslog 服务器 IP')
    return
  }
  const port = Number(portStr)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    ElMessage.error('请输入有效的 Syslog 服务器端口（1–65535 的整数）')
    return
  }
  savedList.value.push({
    id: idSeq++,
    ip,
    port: String(port)
  })
  hasDraft.value = false
  draftForm.value = { ip: '', port: '' }
  const lastPage = Math.max(1, Math.ceil(savedList.value.length / pageSize.value))
  page.value = lastPage
  ElMessage.success('保存成功（原型演示）')
}

function onRemoveDraft() {
  hasDraft.value = false
  draftForm.value = { ip: '', port: '' }
}

function onDeleteSaved(row) {
  const idx = savedList.value.findIndex((s) => s.id === row.id)
  if (idx >= 0) savedList.value.splice(idx, 1)
  const maxPage = Math.max(1, Math.ceil(savedList.value.length / pageSize.value) || 1)
  if (page.value > maxPage) page.value = maxPage
  ElMessage.success('已删除（原型演示）')
}
</script>

<style lang="scss" scoped>
.toolbar {
  margin-bottom: 12px;
}

.add-btn {
  padding-left: 0;
}

.syslog-table {
  width: 100%;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
