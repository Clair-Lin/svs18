<template>
  <div class="network-port-panel">
    <div class="toolbar">
      <el-button type="primary" :loading="refreshing" @click="handleRefresh">刷新</el-button>
    </div>

    <el-table :data="interfaceList" border class="network-table" empty-text="暂无数据">
      <el-table-column prop="name" label="名称" width="100" />
      <el-table-column label="IP地址" min-width="220">
        <template #default="{ row }">
          <div class="dual-line-cell">
            <div class="dual-line">IPv4：{{ row.ipv4.ip || '—' }}</div>
            <div class="dual-line">IPv6：{{ row.ipv6.ip || '—' }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="子网掩码" min-width="200">
        <template #default="{ row }">
          <div class="dual-line-cell">
            <div class="dual-line">IPv4：{{ row.ipv4.mask || '—' }}</div>
            <div class="dual-line">IPv6：{{ row.ipv6.mask || '—' }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="网关地址" min-width="200">
        <template #default="{ row }">
          <div class="dual-line-cell">
            <div class="dual-line">IPv4：{{ row.ipv4.gateway || '—' }}</div>
            <div class="dual-line">IPv6：{{ row.ipv6.gateway || '—' }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="88" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="openEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="editVisible"
      title="网络配置"
      width="560px"
      align-center
      destroy-on-close
      :close-on-click-modal="false"
      class="network-edit-dialog"
      @closed="onEditClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="110px"
        class="network-edit-form"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name" readonly />
        </el-form-item>
        <el-form-item label="IP地址类型" prop="ipType">
          <el-radio-group v-model="editForm.ipType">
            <el-radio label="IPV4">IPV4</el-radio>
            <el-radio label="IPV6">IPV6</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="editForm.ip" placeholder="请输入 IP 地址" clearable />
          <p v-if="editForm.isMainPort" class="form-hint">
            该网口为主网口，修改主网口的 IP 地址后需使用新的 IP 访问管理后端
          </p>
        </el-form-item>
        <el-form-item label="子网掩码" prop="mask">
          <el-input v-model="editForm.mask" placeholder="请输入子网掩码" clearable />
        </el-form-item>
        <el-form-item label="网关地址" prop="gateway">
          <el-input v-model="editForm.gateway" placeholder="请输入网关地址" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" :loading="editSubmitting" @click="submitEdit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

function emptyStack () {
  return { ip: '', mask: '', gateway: '' }
}

function cloneRow (row) {
  return {
    name: row.name,
    isMainPort: !!row.isMainPort,
    ipType: 'IPV4',
    ip: row.ipv4.ip,
    mask: row.ipv4.mask,
    gateway: row.ipv4.gateway,
    ipv4: { ...row.ipv4 },
    ipv6: { ...row.ipv6 }
  }
}

function stackKey (ipType) {
  return ipType === 'IPV6' ? 'ipv6' : 'ipv4'
}

function loadFieldsFromStack (form) {
  const s = form[stackKey(form.ipType)]
  form.ip = s.ip
  form.mask = s.mask
  form.gateway = s.gateway
}

function saveFieldsToStack (form) {
  const s = form[stackKey(form.ipType)]
  s.ip = form.ip
  s.mask = form.mask
  s.gateway = form.gateway
}

const interfaceList = ref([
  {
    name: 'eth0',
    isMainPort: true,
    ipv4: { ip: '192.168.208.62', mask: '255.255.255.0', gateway: '192.168.208.1' },
    ipv6: { ip: '', mask: '', gateway: '' }
  },
  {
    name: 'eth1',
    isMainPort: false,
    ipv4: { ip: '192.168.208.62', mask: '255.255.255.0', gateway: '' },
    ipv6: { ip: '', mask: '', gateway: '' }
  }
])

const refreshing = ref(false)
const editVisible = ref(false)
const editSubmitting = ref(false)
const editFormRef = ref(null)
const editingName = ref('')
const editForm = ref({
  name: '',
  isMainPort: false,
  ipType: 'IPV4',
  ip: '',
  mask: '',
  gateway: '',
  ipv4: emptyStack(),
  ipv6: emptyStack()
})

watch(
  () => editForm.value.ipType,
  (next, prev) => {
    if (!editVisible.value || prev === undefined || next === prev) return
    const form = editForm.value
    const prevKey = stackKey(prev)
    form[prevKey] = {
      ip: form.ip,
      mask: form.mask,
      gateway: form.gateway
    }
    loadFieldsFromStack(form)
  }
)

const editRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  ipType: [{ required: true, message: '请选择 IP 地址类型', trigger: 'change' }],
  ip: [{ required: true, message: '请输入 IP 地址', trigger: 'blur' }],
  mask: [{ required: true, message: '请输入子网掩码', trigger: 'blur' }]
}

function normalizeStack (stack) {
  return {
    ip: String(stack.ip ?? '').trim(),
    mask: String(stack.mask ?? '').trim(),
    gateway: String(stack.gateway ?? '').trim()
  }
}

function handleRefresh () {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
    ElMessage.success('网络配置已刷新（原型演示）')
  }, 500)
}

function openEdit (row) {
  editingName.value = row.name
  editForm.value = cloneRow(row)
  editVisible.value = true
}

function onEditClosed () {
  editingName.value = ''
  editForm.value = {
    name: '',
    isMainPort: false,
    ipType: 'IPV4',
    ip: '',
    mask: '',
    gateway: '',
    ipv4: emptyStack(),
    ipv6: emptyStack()
  }
  editSubmitting.value = false
}

function submitEdit () {
  editFormRef.value?.validate((valid) => {
    if (!valid) return
    const target = interfaceList.value.find((r) => r.name === editingName.value)
    if (!target) return
    editSubmitting.value = true
    setTimeout(() => {
      saveFieldsToStack(editForm.value)
      target.ipv4 = normalizeStack(editForm.value.ipv4)
      target.ipv6 = normalizeStack(editForm.value.ipv6)
      editSubmitting.value = false
      editVisible.value = false
      ElMessage.success('网络配置已保存（原型演示）')
    }, 300)
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import './networkPanel.scss';

.toolbar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
}

.dual-line-cell {
  padding: 4px 0;
  line-height: 1.6;
}

.dual-line {
  font-size: 13px;
  color: $text-primary;
  word-break: break-all;
}

.network-edit-form {
  .form-hint {
    margin: 8px 0 0;
    font-size: 12px;
    line-height: 1.6;
    color: $text-secondary;
  }
}
</style>

<style lang="scss">
.network-edit-dialog {
  .el-dialog__header {
    margin-right: 0;
    padding: 14px 20px;
    background: #fafafa;
    border-bottom: 1px solid #f0f0f0;
  }

  .el-dialog__body {
    padding: 20px 24px 8px;
  }

  .el-dialog__footer {
    padding: 12px 20px 16px;
    border-top: 1px solid #f0f0f0;
  }
}
</style>
