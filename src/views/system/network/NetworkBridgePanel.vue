<template>
  <div class="network-bridge-panel">
    <div class="network-panel-toolbar">
      <el-button type="primary" @click="openAdd">添加网桥</el-button>
    </div>

    <el-table :data="list" border class="network-table" empty-text="暂无数据">
      <el-table-column prop="bridgeName" label="网桥名称" min-width="120" />
      <el-table-column prop="boundPort" label="绑定网口" min-width="140" show-overflow-tooltip />
      <el-table-column label="操作" width="140" fixed="right" align="center">
        <template #default="{ row }">
          <div class="network-row-actions">
            <el-button type="primary" link @click="openEdit(row)">编辑</el-button>
            <el-button
              v-if="!isSystemBridge(row)"
              type="primary"
              link
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="480px"
      align-center
      destroy-on-close
      :close-on-click-modal="false"
      class="network-form-dialog network-bridge-form-dialog"
      @closed="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="108px"
        label-position="right"
        class="bridge-dialog-form"
      >
        <el-form-item label="网桥名称" prop="brSuffix" class="bridge-form-item">
          <div v-if="isEditingSystemBridge" class="readonly-br-name bridge-form-control">br0</div>
          <div v-else class="input-with-prefix bridge-form-control">
            <span class="prefix">br</span>
            <el-input
              v-model="form.brSuffix"
              placeholder="请输入 0-10 的数字"
              clearable
              :disabled="isEditMode"
            />
          </div>
        </el-form-item>
        <el-form-item label="绑定网口" prop="boundPort" class="bridge-form-item">
          <el-select
            v-model="form.boundPort"
            placeholder="请选择网口"
            class="bridge-form-control"
          >
            <el-option
              v-for="opt in BINDABLE_PORT_OPTIONS"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="网关" prop="gateway" class="bridge-form-item">
          <el-input
            v-model="form.gateway"
            placeholder="请输入网关"
            clearable
            class="bridge-form-control"
          />
        </el-form-item>
        <el-form-item label="子网掩码" class="bridge-form-item bridge-form-item--last">
          <el-input
            v-model="form.subnetMask"
            placeholder="请输入子网掩码"
            clearable
            class="bridge-form-control"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="bridge-dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="submitForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  BINDABLE_PORT_OPTIONS,
  DEFAULT_BRIDGE_BR0,
  isSystemBridgeName,
  parseBridgeSuffix,
  toBridgeName
} from '@/utils/networkInterface'

const list = ref([
  {
    bridgeName: DEFAULT_BRIDGE_BR0.bridgeName,
    boundPort: DEFAULT_BRIDGE_BR0.boundPort,
    gateway: DEFAULT_BRIDGE_BR0.gateway,
    subnetMask: DEFAULT_BRIDGE_BR0.subnetMask
  }
])

const dialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const editingBridgeName = ref('')

const defaultForm = () => ({
  brSuffix: '',
  boundPort: '',
  gateway: '',
  subnetMask: ''
})

const form = ref(defaultForm())

const isEditMode = computed(() => !!editingBridgeName.value)
const isEditingSystemBridge = computed(
  () => isEditMode.value && isSystemBridgeName(editingBridgeName.value)
)
const dialogTitle = computed(() => (isEditMode.value ? '编辑网桥' : '添加网桥'))

function isSystemBridge (row) {
  return isSystemBridgeName(row?.bridgeName)
}

function validateBrSuffix (_rule, value, callback) {
  if (isEditingSystemBridge.value) {
    callback()
    return
  }
  const n = parseBridgeSuffix(value)
  if (n === null) {
    callback(new Error('请输入 0-10 区间的数字'))
    return
  }
  const name = toBridgeName(n)
  const duplicate = list.value.some(
    (item) => item.bridgeName === name && item.bridgeName !== editingBridgeName.value
  )
  if (duplicate) {
    callback(new Error('该网桥名称已存在'))
    return
  }
  callback()
}

const formRules = {
  brSuffix: [{ validator: validateBrSuffix, trigger: 'blur' }],
  boundPort: [{ required: true, message: '请选择网口', trigger: 'change' }],
  gateway: [{ required: true, message: '请输入网关', trigger: 'blur' }]
}

function openAdd () {
  editingBridgeName.value = ''
  form.value = defaultForm()
  dialogVisible.value = true
}

function openEdit (row) {
  editingBridgeName.value = row.bridgeName
  const suffix = row.bridgeName.replace(/^br/, '')
  form.value = {
    brSuffix: suffix,
    boundPort: row.boundPort,
    gateway: row.gateway,
    subnetMask: row.subnetMask || ''
  }
  dialogVisible.value = true
}

function resetForm () {
  editingBridgeName.value = ''
  form.value = defaultForm()
  submitting.value = false
}

function submitForm () {
  formRef.value?.validate((valid) => {
    if (!valid) return
    submitting.value = true
    setTimeout(() => {
      const bridgeName = isEditingSystemBridge.value
        ? DEFAULT_BRIDGE_BR0.bridgeName
        : toBridgeName(form.value.brSuffix)
      const payload = {
        bridgeName,
        boundPort: form.value.boundPort,
        gateway: String(form.value.gateway ?? '').trim(),
        subnetMask: String(form.value.subnetMask ?? '').trim()
      }
      if (isEditMode.value) {
        const target = list.value.find((r) => r.bridgeName === editingBridgeName.value)
        if (target) Object.assign(target, payload)
        ElMessage.success('网桥已更新（原型演示）')
      } else {
        list.value.push(payload)
        ElMessage.success('网桥已添加（原型演示）')
      }
      submitting.value = false
      dialogVisible.value = false
    }, 300)
  })
}

function handleDelete (row) {
  ElMessageBox.confirm(`确定删除网桥「${row.bridgeName}」？`, '提示', { type: 'warning' })
    .then(() => {
      list.value = list.value.filter((r) => r.bridgeName !== row.bridgeName)
      ElMessage.success('已删除（原型演示）')
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import './networkPanel.scss';
</style>

<style lang="scss">
@import '@/styles/variables.scss';

.network-bridge-form-dialog {
  border-radius: 4px;
  overflow: hidden;

  .el-dialog__header {
    margin-right: 0;
    padding: 12px 16px;
    background: #fff;
    border-bottom: 1px solid #ebeef5;
  }

  .el-dialog__title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    line-height: 24px;
  }

  .el-dialog__headerbtn {
    top: 14px;
    right: 14px;
    width: 20px;
    height: 20px;
  }

  .el-dialog__body {
    padding: 16px 20px 4px;
  }

  .bridge-dialog-form {
    .bridge-form-item {
      margin-bottom: 16px;

      &.bridge-form-item--last {
        margin-bottom: 0;
      }
    }

    .el-form-item__label {
      height: 32px;
      line-height: 32px;
      padding-right: 12px;
      color: #606266;
      font-size: 14px;
      font-weight: 400;
    }

    .el-form-item__content {
      min-height: 32px;
    }

    .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label::before {
      margin-right: 2px;
    }

    .bridge-form-control {
      width: 100%;
    }

    .el-input__wrapper,
    .el-select__wrapper {
      min-height: 32px;
    }
  }

  .input-with-prefix {
    width: 100%;

    .prefix {
      height: 32px;
      line-height: 30px;
      font-size: 14px;
      color: #909399;
      background: #f5f7fa;
      border-color: #dcdfe6;
    }

    .el-input {
      flex: 1;
    }
  }

  .readonly-br-name {
    width: 100%;
    height: 32px;
    line-height: 30px;
    padding: 0 11px;
    font-size: 14px;
    color: #606266;
    background: #f5f7fa;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .el-dialog__footer {
    padding: 10px 16px 12px;
    background: #fff;
    border-top: 1px solid #ebeef5;
  }

  .bridge-dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;

    .el-button {
      min-width: 72px;
      height: 32px;
      padding: 0 20px;
      font-size: 14px;
    }

    .el-button--default {
      color: #303133;
      border-color: #dcdfe6;
      background: #fff;
    }

    .el-button--primary {
      border: none;
      background-color: $primary-color;
    }
  }
}
</style>
