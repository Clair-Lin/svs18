<template>
  <div class="network-vlan-panel">
    <div class="network-panel-toolbar">
      <el-button type="primary" @click="openAdd">添加</el-button>
    </div>

    <el-table :data="list" border class="network-table" empty-text="暂无数据">
      <el-table-column prop="vlanId" label="VLAN ID" width="100" align="center" />
      <el-table-column prop="ipAddress" label="IP地址" min-width="140" />
      <el-table-column prop="subnetMask" label="子网掩码" min-width="120" />
      <el-table-column prop="gateway" label="网关" min-width="120" />
      <el-table-column prop="linkedPort" label="关联网口" min-width="120" />
      <el-table-column label="禁/启用" width="100" align="center">
        <template #default="{ row }">
          <el-switch v-model="row.enabled" @change="handleToggle(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right" align="center">
        <template #default="{ row }">
          <div class="network-row-actions">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="primary" link @click="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="addVisible"
      title="添加VLAN"
      width="560px"
      align-center
      destroy-on-close
      :close-on-click-modal="false"
      class="network-form-dialog"
      @closed="resetAddForm"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addRules"
        label-width="100px"
      >
        <el-form-item label="VLAN ID" prop="vlanSuffix">
          <div class="input-with-prefix">
            <span class="prefix">VLAN.</span>
            <el-input
              v-model="addForm.vlanSuffix"
              placeholder="1-4094区间的正整数，如：VLAN.100"
              clearable
            />
          </div>
        </el-form-item>
        <el-form-item label="关联接口" prop="linkedInterface">
          <el-select
            v-model="addForm.linkedInterface"
            placeholder="请选择关联接口"
            style="width: 100%"
          >
            <el-option
              v-for="opt in PARENT_INTERFACE_OPTIONS"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="禁/启用">
          <el-radio-group v-model="addForm.enabled">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-tabs v-model="addIpTab" class="network-ip-tabs">
          <el-tab-pane label="IPV4" name="ipv4">
            <el-form-item label="IP地址" required>
              <el-input v-model="addForm.ipv4.ip" placeholder="请输入IP地址" clearable />
            </el-form-item>
            <el-form-item label="子网掩码" required>
              <el-input v-model="addForm.ipv4.mask" placeholder="请输入子网掩码" clearable />
            </el-form-item>
            <el-form-item label="网关">
              <el-input v-model="addForm.ipv4.gateway" placeholder="请输入网关" clearable />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="IPV6" name="ipv6">
            <el-form-item label="IP地址" required>
              <el-input v-model="addForm.ipv6.ip" placeholder="请输入IP地址" clearable />
            </el-form-item>
            <el-form-item label="子网掩码" required>
              <el-input v-model="addForm.ipv6.mask" placeholder="请输入子网掩码" clearable />
            </el-form-item>
            <el-form-item label="网关">
              <el-input v-model="addForm.ipv6.gateway" placeholder="请输入网关" clearable />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button type="primary" :loading="addSubmitting" @click="submitAdd">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  PARENT_INTERFACE_OPTIONS,
  emptyIpStack
} from '@/utils/networkInterface'

const list = ref([])
const addVisible = ref(false)
const addSubmitting = ref(false)
const addFormRef = ref(null)
const addIpTab = ref('ipv4')

const defaultAddForm = () => ({
  vlanSuffix: '',
  linkedInterface: '',
  enabled: true,
  ipv4: emptyIpStack(),
  ipv6: emptyIpStack()
})

const addForm = ref(defaultAddForm())

const addRules = {
  vlanSuffix: [
    { required: true, message: '请输入 VLAN ID', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        const n = Number(value)
        if (!Number.isInteger(n) || n < 1 || n > 4094) {
          callback(new Error('请输入 1-4094 区间的正整数'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  linkedInterface: [{ required: true, message: '请选择关联接口', trigger: 'change' }]
}

function openAdd () {
  addForm.value = defaultAddForm()
  addIpTab.value = 'ipv4'
  addVisible.value = true
}

function resetAddForm () {
  addForm.value = defaultAddForm()
  addIpTab.value = 'ipv4'
  addSubmitting.value = false
}

function validateActiveIpStack () {
  const key = addIpTab.value === 'ipv6' ? 'ipv6' : 'ipv4'
  const stack = addForm.value[key]
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

function submitAdd () {
  addFormRef.value?.validate((valid) => {
    if (!valid || !validateActiveIpStack()) return
    addSubmitting.value = true
    setTimeout(() => {
      const stack = addForm.value[addIpTab.value]
      const linked = PARENT_INTERFACE_OPTIONS.find((o) => o.value === addForm.value.linkedInterface)
      list.value.push({
        vlanId: addForm.value.vlanSuffix,
        ipAddress: stack.ip,
        subnetMask: stack.mask,
        gateway: stack.gateway || '--',
        linkedPort: linked?.label ?? addForm.value.linkedInterface,
        enabled: addForm.value.enabled
      })
      addSubmitting.value = false
      addVisible.value = false
      ElMessage.success('VLAN 已添加（原型演示）')
    }, 300)
  })
}

function handleEdit () {
  ElMessage.info('编辑 VLAN（原型演示）')
}

function handleDelete (row) {
  ElMessageBox.confirm(`确定删除 VLAN「${row.vlanId}」？`, '提示', { type: 'warning' })
    .then(() => {
      list.value = list.value.filter((r) => r.vlanId !== row.vlanId)
      ElMessage.success('已删除（原型演示）')
    })
    .catch(() => {})
}

function handleToggle (row) {
  ElMessage.success(`VLAN ${row.vlanId} 已${row.enabled ? '启用' : '禁用'}（原型演示）`)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import './networkPanel.scss';
</style>
