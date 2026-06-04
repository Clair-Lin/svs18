<template>
  <div class="network-bond-panel">
    <div class="network-panel-toolbar">
      <el-button type="primary" @click="openAdd">添加</el-button>
    </div>

    <el-table :data="list" border class="network-table" empty-text="暂无数据">
      <el-table-column prop="bondName" label="bond 名称" min-width="120" />
      <el-table-column prop="bondMode" label="bond模式" min-width="100" />
      <el-table-column prop="boundPorts" label="绑定网口" min-width="140" show-overflow-tooltip />
      <el-table-column prop="ipAddress" label="IP地址" min-width="140" />
      <el-table-column prop="subnetMask" label="子网掩码" min-width="120" />
      <el-table-column prop="gateway" label="网关" min-width="120" />
      <el-table-column label="状态" width="88" align="center">
        <template #default="{ row }">
          <el-tag :type="row.enabled ? 'success' : 'info'" size="small">
            {{ row.enabled ? '启用' : '禁用' }}
          </el-tag>
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
      title="添加聚合接口"
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
        label-width="110px"
      >
        <el-form-item label="bond 名称" prop="bondSuffix">
          <div class="input-with-prefix">
            <span class="prefix">bond.</span>
            <el-input
              v-model="addForm.bondSuffix"
              placeholder="0-6区间的正整数，如：bond.1"
              clearable
            />
          </div>
        </el-form-item>
        <el-form-item label="bond模式" prop="bondMode">
          <el-select
            v-model="addForm.bondMode"
            placeholder="请选择bond模式"
            style="width: 100%"
          >
            <el-option
              v-for="opt in BOND_MODE_OPTIONS"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="boundPorts">
          <template #label>
            <span>绑定网口</span>
            <el-tooltip content="请选择至少一个未绑定的物理网口" placement="top">
              <el-icon class="bond-bind-hint"><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-checkbox-group v-model="addForm.boundPorts">
            <el-checkbox
              v-for="opt in BINDABLE_PORT_OPTIONS"
              :key="opt.value"
              :label="opt.value"
            >
              {{ opt.label }}
            </el-checkbox>
          </el-checkbox-group>
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
import { QuestionFilled } from '@element-plus/icons-vue'
import {
  BOND_MODE_OPTIONS,
  BINDABLE_PORT_OPTIONS,
  emptyIpStack
} from '@/utils/networkInterface'

const list = ref([])
const addVisible = ref(false)
const addSubmitting = ref(false)
const addFormRef = ref(null)
const addIpTab = ref('ipv4')

const defaultAddForm = () => ({
  bondSuffix: '',
  bondMode: '',
  boundPorts: [],
  ipv4: emptyIpStack(),
  ipv6: emptyIpStack()
})

const addForm = ref(defaultAddForm())

const addRules = {
  bondSuffix: [
    { required: true, message: '请输入 bond 编号', trigger: 'blur' },
    {
      pattern: /^[0-6]$/,
      message: '请输入 0-6 区间的正整数',
      trigger: 'blur'
    }
  ],
  bondMode: [{ required: true, message: '请选择bond模式', trigger: 'change' }],
  boundPorts: [
    {
      type: 'array',
      required: true,
      min: 1,
      message: '请至少选择一个绑定网口',
      trigger: 'change'
    }
  ]
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
      const modeLabel = BOND_MODE_OPTIONS.find((o) => o.value === addForm.value.bondMode)?.label ?? addForm.value.bondMode
      list.value.push({
        bondName: `bond.${addForm.value.bondSuffix}`,
        bondMode: modeLabel,
        boundPorts: addForm.value.boundPorts.join('、'),
        ipAddress: stack.ip,
        subnetMask: stack.mask,
        gateway: stack.gateway || '--',
        enabled: true
      })
      addSubmitting.value = false
      addVisible.value = false
      ElMessage.success('聚合接口已添加（原型演示）')
    }, 300)
  })
}

function handleEdit () {
  ElMessage.info('编辑聚合接口（原型演示）')
}

function handleDelete (row) {
  ElMessageBox.confirm(`确定删除聚合接口「${row.bondName}」？`, '提示', { type: 'warning' })
    .then(() => {
      list.value = list.value.filter((r) => r.bondName !== row.bondName)
      ElMessage.success('已删除（原型演示）')
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import './networkPanel.scss';
</style>
