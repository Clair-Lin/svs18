<template>
  <div class="network-sub-panel">
    <div class="network-panel-toolbar">
      <el-button type="primary" @click="openAdd">添加</el-button>
    </div>

    <el-table :data="list" border class="network-table" empty-text="暂无数据">
      <el-table-column prop="subName" label="子接口" min-width="120" />
      <el-table-column prop="parentInterface" label="归属主接口" min-width="120" />
      <el-table-column prop="ipAddress" label="IP地址" min-width="140" />
      <el-table-column prop="subnetMask" label="子网掩码" min-width="120" />
      <el-table-column label="网口状态" width="100" align="center">
        <template #default="{ row }">
          <span class="port-status-icon" :class="{ down: !row.portUp }" />
        </template>
      </el-table-column>
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
      title="添加子接口"
      width="520px"
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
        <el-form-item label="归属主接口" prop="parentInterface">
          <el-select
            v-model="addForm.parentInterface"
            placeholder="请选择归属主接口"
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
        <el-form-item label="IP类型">
          <el-radio-group v-model="addForm.ipType">
            <el-radio label="IPV4">IPV4</el-radio>
            <el-radio label="IPV6">IPV6</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="IP地址" prop="ipAddress">
          <el-input v-model="addForm.ipAddress" placeholder="请输入IP地址" clearable />
        </el-form-item>
        <el-form-item label="子网掩码" prop="subnetMask">
          <el-input v-model="addForm.subnetMask" placeholder="请输入子网掩码" clearable />
        </el-form-item>
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
import { PARENT_INTERFACE_OPTIONS } from '@/utils/networkInterface'

const list = ref([])
const addVisible = ref(false)
const addSubmitting = ref(false)
const addFormRef = ref(null)

const defaultAddForm = () => ({
  parentInterface: '',
  enabled: true,
  ipType: 'IPV4',
  ipAddress: '',
  subnetMask: ''
})

const addForm = ref(defaultAddForm())

const addRules = {
  parentInterface: [{ required: true, message: '请选择归属主接口', trigger: 'change' }],
  ipAddress: [{ required: true, message: '请输入IP地址', trigger: 'blur' }],
  subnetMask: [{ required: true, message: '请输入子网掩码', trigger: 'blur' }]
}

function openAdd () {
  addForm.value = defaultAddForm()
  addVisible.value = true
}

function resetAddForm () {
  addForm.value = defaultAddForm()
  addSubmitting.value = false
}

function submitAdd () {
  addFormRef.value?.validate((valid) => {
    if (!valid) return
    addSubmitting.value = true
    setTimeout(() => {
      const parent = PARENT_INTERFACE_OPTIONS.find((o) => o.value === addForm.value.parentInterface)
      list.value.push({
        subName: `${addForm.value.parentInterface}:${list.value.length + 1}`,
        parentInterface: parent?.label ?? addForm.value.parentInterface,
        ipAddress: addForm.value.ipAddress,
        subnetMask: addForm.value.subnetMask,
        ipType: addForm.value.ipType,
        enabled: addForm.value.enabled,
        portUp: true
      })
      addSubmitting.value = false
      addVisible.value = false
      ElMessage.success('子接口已添加（原型演示）')
    }, 300)
  })
}

function handleEdit () {
  ElMessage.info('编辑子接口（原型演示）')
}

function handleDelete (row) {
  ElMessageBox.confirm(`确定删除子接口「${row.subName}」？`, '提示', { type: 'warning' })
    .then(() => {
      list.value = list.value.filter((r) => r.subName !== row.subName)
      ElMessage.success('已删除（原型演示）')
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import './networkPanel.scss';
</style>
