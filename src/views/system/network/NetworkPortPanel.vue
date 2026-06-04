<template>
  <div class="network-port-panel">
    <el-table :data="interfaceList" border class="network-table" empty-text="暂无数据">
      <el-table-column prop="alias" label="接口别名" width="100" />
      <el-table-column prop="name" label="接口名" width="90" />
      <el-table-column label="IP地址" min-width="200">
        <template #default="{ row }">
          <div class="dual-line-cell">
            <div class="dual-line">IPv4：{{ formatIpCell(row.ipv4) }}</div>
            <div class="dual-line">IPv6：{{ formatIpCell(row.ipv6) }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="子网掩码" min-width="180">
        <template #default="{ row }">
          <div class="dual-line-cell">
            <div class="dual-line">IPv4：{{ formatIpCell(row.ipv4, 'mask') }}</div>
            <div class="dual-line">IPv6：{{ formatIpCell(row.ipv6, 'mask') }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="网关" min-width="180">
        <template #default="{ row }">
          <div class="dual-line-cell">
            <div class="dual-line">IPv4：{{ formatIpCell(row.ipv4, 'gateway') }}</div>
            <div class="dual-line">IPv6：{{ formatIpCell(row.ipv6, 'gateway') }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用途" width="100" align="center">
        <template #default="{ row }">
          {{ PORT_USAGE_LABEL[row.usage] }}
        </template>
      </el-table-column>
      <el-table-column label="网口状态" width="90" align="center">
        <template #default="{ row }">
          <span class="port-status-icon" :class="{ down: !row.portUp }" />
        </template>
      </el-table-column>
      <el-table-column label="禁/启用" width="90" align="center">
        <template #default="{ row }">
          <el-switch v-model="row.enabled" @change="handleToggle(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" align="center" fixed="right">
        <template #default="{ row }">
          <div class="network-row-actions">
            <el-button type="primary" link @click="openEdit(row)">编辑</el-button>
            <el-button type="primary" link @click="openDetail(row)">网口详情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="editVisible"
      title="接口编辑"
      width="560px"
      align-center
      destroy-on-close
      :close-on-click-modal="false"
      class="network-form-dialog"
      @closed="onEditClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="100px"
        class="network-edit-form"
      >
        <el-form-item label="接口名称">
          <span class="readonly-text">{{ editForm.name }}</span>
        </el-form-item>
        <el-form-item label="用途" prop="usage">
          <el-radio-group v-model="editForm.usage">
            <el-radio :label="PORT_USAGE_MANAGE">管理网口</el-radio>
            <el-radio :label="PORT_USAGE_BUSINESS">业务网口</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-tabs v-model="editIpTab" class="network-ip-tabs">
          <el-tab-pane label="IPV4" name="ipv4">
            <el-form-item label="IP地址" required>
              <el-input v-model="editForm.ipv4.ip" placeholder="请输入IP地址" clearable />
            </el-form-item>
            <el-form-item label="子网掩码" required>
              <el-input v-model="editForm.ipv4.mask" placeholder="请输入子网掩码" clearable />
            </el-form-item>
            <el-form-item label="网关">
              <el-input v-model="editForm.ipv4.gateway" placeholder="请输入网关" clearable />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="IPV6" name="ipv6">
            <el-form-item label="IP地址" required>
              <el-input v-model="editForm.ipv6.ip" placeholder="请输入IP地址" clearable />
            </el-form-item>
            <el-form-item label="子网掩码" required>
              <el-input v-model="editForm.ipv6.mask" placeholder="请输入子网掩码" clearable />
            </el-form-item>
            <el-form-item label="网关">
              <el-input v-model="editForm.ipv6.gateway" placeholder="请输入网关" clearable />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" :loading="editSubmitting" @click="submitEdit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="detailVisible"
      title="网口详情"
      width="480px"
      align-center
      destroy-on-close
      class="network-form-dialog network-detail-dialog"
    >
      <div v-if="detailRow" class="network-detail-list">
        <div class="detail-row">
          <span class="detail-label">接口名称</span>
          <span class="detail-value">{{ detailRow.name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">禁/启用</span>
          <span class="detail-value">
            <span class="status-on">
              <span class="status-dot" />
              {{ detailRow.enabled ? '启用' : '禁用' }}
            </span>
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">用途</span>
          <span class="detail-value">{{ PORT_USAGE_LABEL[detailRow.usage] }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">IPV4</span>
          <span class="detail-value">{{ formatIpCell(detailRow.ipv4) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">IPV6</span>
          <span class="detail-value">{{ formatIpv6Detail(detailRow.ipv6) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">厂商</span>
          <span class="detail-value">{{ detailRow.vendor }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">版本</span>
          <span class="detail-value">{{ detailRow.driverVersion }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">速率</span>
          <span class="detail-value">{{ detailRow.speed }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  MOCK_PHYSICAL_PORTS,
  PORT_USAGE_MANAGE,
  PORT_USAGE_BUSINESS,
  PORT_USAGE_LABEL,
  emptyIpStack,
  formatIpCell,
  formatIpv6Detail
} from '@/utils/networkInterface'

function clonePort (row) {
  return {
    name: row.name,
    usage: row.usage,
    ipv4: { ...row.ipv4 },
    ipv6: { ...row.ipv6 }
  }
}

function normalizeStack (stack) {
  return {
    ip: String(stack.ip ?? '').trim(),
    mask: String(stack.mask ?? '').trim(),
    gateway: String(stack.gateway ?? '').trim()
  }
}

const interfaceList = ref(
  MOCK_PHYSICAL_PORTS.map((p) => ({
    ...p,
    ipv4: { ...p.ipv4 },
    ipv6: { ...p.ipv6 }
  }))
)

const editVisible = ref(false)
const detailVisible = ref(false)
const editSubmitting = ref(false)
const editFormRef = ref(null)
const editingName = ref('')
const editIpTab = ref('ipv4')
const detailRow = ref(null)

const editForm = ref({
  name: '',
  usage: PORT_USAGE_MANAGE,
  ipv4: emptyIpStack(),
  ipv6: emptyIpStack()
})

const editRules = {
  usage: [{ required: true, message: '请选择用途', trigger: 'change' }]
}

function handleToggle (row) {
  ElMessage.success(`${row.alias} 已${row.enabled ? '启用' : '禁用'}（原型演示）`)
}

function openEdit (row) {
  editingName.value = row.name
  editForm.value = clonePort(row)
  editIpTab.value = 'ipv4'
  editVisible.value = true
}

function openDetail (row) {
  detailRow.value = row
  detailVisible.value = true
}

function onEditClosed () {
  editingName.value = ''
  editIpTab.value = 'ipv4'
  editForm.value = {
    name: '',
    usage: PORT_USAGE_MANAGE,
    ipv4: emptyIpStack(),
    ipv6: emptyIpStack()
  }
  editSubmitting.value = false
}

function validateActiveIpStack () {
  const key = editIpTab.value === 'ipv6' ? 'ipv6' : 'ipv4'
  const stack = editForm.value[key]
  if (!String(stack.ip ?? '').trim()) {
    ElMessage.warning('请输入IP地址')
    return false
  }
  if (!String(stack.mask ?? '').trim()) {
    ElMessage.warning('请输入子网掩码')
    return false
  }
  return true
}

function submitEdit () {
  editFormRef.value?.validate((valid) => {
    if (!valid || !validateActiveIpStack()) return
    const target = interfaceList.value.find((r) => r.name === editingName.value)
    if (!target) return
    editSubmitting.value = true
    setTimeout(() => {
      target.usage = editForm.value.usage
      target.ipv4 = normalizeStack(editForm.value.ipv4)
      target.ipv6 = normalizeStack(editForm.value.ipv6)
      editSubmitting.value = false
      editVisible.value = false
      ElMessage.success('接口配置已保存（原型演示）')
    }, 300)
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import './networkPanel.scss';

.readonly-text {
  font-size: 14px;
  color: $text-primary;
}
</style>

