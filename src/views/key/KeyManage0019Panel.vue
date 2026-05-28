<template>
  <div class="key-panel">
    <div class="action-bar">
      <el-button type="primary" @click="handleCreate">生成容器</el-button>
      <el-button @click="handleImportContainer">导入容器</el-button>
    </div>

    <el-table :data="pagedKeyList" border stripe>
      <el-table-column prop="containerName" label="容器名" min-width="180" />
      <el-table-column prop="keyAlgorithm" label="密钥算法" width="110" />
      <el-table-column prop="keyLength" label="密钥长度" width="100" align="center" />
      <el-table-column prop="usageLabel" label="用途" width="120" />
      <el-table-column prop="exportableLabel" label="是否可导出" width="110" align="center" />
      <el-table-column prop="addedTime" label="添加时间" width="180" />
      <el-table-column label="操作" fixed="right" width="140">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="handleDetail(row)">详情</el-button>
          <el-button type="primary" size="small" link @click="handleBackup(row)">备份</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next"
        :total="keyList.length"
        :page-sizes="[10, 20, 50]"
      />
    </div>

    <el-dialog
      v-model="createDialogVisible"
      title="生成容器"
      width="560px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="keyForm" :rules="keyRules" label-width="120px">
        <el-form-item label="容器名" prop="containerName">
          <el-input v-model="keyForm.containerName" clearable placeholder="手动输入，唯一" />
        </el-form-item>
        <el-form-item label="密钥算法" prop="keyAlgorithm">
          <el-select v-model="keyForm.keyAlgorithm" style="width: 100%" @change="handleCreateAlgorithmChange">
            <el-option label="SM2" value="SM2" />
            <el-option label="RSA" value="RSA" />
          </el-select>
        </el-form-item>
        <el-form-item label="密钥长度" prop="keyLength">
          <el-select v-model="keyForm.keyLength" style="width: 100%">
            <el-option
              v-for="len in createAvailableKeyLengths"
              :key="len"
              :label="String(len)"
              :value="len"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="密钥用途">
          <el-radio-group v-model="keyForm.usageLabel">
            <el-radio value="签名验签">签名验签</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否可导出" prop="exportFlag">
          <el-radio-group v-model="keyForm.exportFlag">
            <el-radio
              v-for="opt in EXPORT_FLAG_OPTIONS"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="creating" @click="handleCreateKey">
          {{ creating ? '生成中...' : '确定' }}
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" title="密钥详情" width="560px" class="detail-dialog-p2" align-center>
      <div v-if="currentKey" class="detail-p2-body">
        <div class="detail-p2-row">
          <span class="detail-p2-label">容器名</span>
          <span class="detail-p2-value">{{ currentKey.containerName }}</span>
        </div>
        <div class="detail-p2-row">
          <span class="detail-p2-label">密钥算法</span>
          <span class="detail-p2-value">{{ currentKey.keyAlgorithm }}</span>
        </div>
        <div class="detail-p2-row">
          <span class="detail-p2-label">密钥长度</span>
          <span class="detail-p2-value">{{ currentKey.keyLength }}</span>
        </div>
        <div class="detail-p2-row">
          <span class="detail-p2-label">密钥用途</span>
          <span class="detail-p2-value">{{ currentKey.usageLabel }}</span>
        </div>
        <div class="detail-p2-row">
          <span class="detail-p2-label">是否可导出</span>
          <span class="detail-p2-value">{{ currentKey.exportableLabel }}</span>
        </div>
        <div class="detail-p2-row">
          <span class="detail-p2-label">添加时间</span>
          <span class="detail-p2-value">{{ currentKey.addedTime }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject } from 'vue'
import { ElMessage } from 'element-plus'
import { EXPORT_FLAG_OPTIONS } from '@/constants/gmt0019.js'
import { KEY_MANAGE_SECURITY_KEY } from './keyManageSecurityKey.js'

function exportFlagToLabel (flag) {
  return flag === 1 ? '是' : '否'
}
const currentPage = ref(1)
const pageSize = ref(10)
const createDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const creating = ref(false)
const currentKey = ref(null)
const formRef = ref(null)
const securityModalsRef = inject(KEY_MANAGE_SECURITY_KEY) ?? ref(null)

const keyForm = reactive({
  containerName: '',
  keyAlgorithm: 'SM2',
  keyLength: 256,
  usageLabel: '签名验签',
  exportFlag: 0
})

/** 生成容器：各算法可选密钥长度（位） */
const CREATE_KEY_LENGTHS_BY_ALGORITHM = {
  SM2: [256],
  RSA: [2048]
}

const createAvailableKeyLengths = computed(() => CREATE_KEY_LENGTHS_BY_ALGORITHM[keyForm.keyAlgorithm] ?? [256])

function handleCreateAlgorithmChange () {
  const sizes = CREATE_KEY_LENGTHS_BY_ALGORITHM[keyForm.keyAlgorithm]
  keyForm.keyLength = sizes?.length ? sizes[0] : 256
}

const keyRules = {
  containerName: [{ required: true, message: '请输入容器名', trigger: 'blur' }],
  keyAlgorithm: [{ required: true, message: '请选择密钥算法', trigger: 'change' }],
  keyLength: [{ required: true, message: '请选择密钥长度', trigger: 'change' }],
  exportFlag: [{ required: true, message: '请选择是否可导出', trigger: 'change' }]
}

const keyList = ref([
  {
    keyId: 'SVS_userA',
    containerName: 'SVS_userA',
    keyAlgorithm: 'SM2',
    keyLength: 256,
    usageLabel: '签名验签',
    exportFlag: 1,
    exportableLabel: '是',
    publicKeyContent: '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoEcz1UBgi0DQgAE6f4Mwl7F9qJQxM7kR8I5f2Q1c0hN\np0j4R1sD8n7xS2t9M6kY7h1Qxw3aD2Y9V6t8r1L5j2f9m0v8q3x2Yw==\n-----END PUBLIC KEY-----',
    addedTime: '2026-04-30 10:00:00'
  },
  {
    keyId: 'SVS_userB',
    containerName: 'SVS_userB',
    keyAlgorithm: 'SM2',
    keyLength: 256,
    usageLabel: '签名验签',
    exportFlag: 0,
    exportableLabel: '否',
    publicKeyContent: '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoEcz1UBgi0DQgAE8r2Jm6kN9xS3p4Qw7tY2v1c0hN5L\nq8p3D1sF6n9xT2v7B5kY4h1Qxw3aD2Y9V6t8r1L5j2f9m0v8q3x2Yw==\n-----END PUBLIC KEY-----',
    addedTime: '2026-04-30 10:01:00'
  }
])

const pagedKeyList = computed(() => {
  const list = keyList.value
  const start = (currentPage.value - 1) * pageSize.value
  return list.slice(start, start + pageSize.value)
})

const handleCreate = () => {
  Object.assign(keyForm, {
    containerName: '',
    keyAlgorithm: 'SM2',
    keyLength: 256,
    usageLabel: '签名验签',
    exportFlag: 0
  })
  createDialogVisible.value = true
}

async function handleCreateKey () {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  creating.value = true
  const name = keyForm.containerName.trim()
  setTimeout(() => {
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const addedTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    keyList.value.unshift({
      keyId: name,
      containerName: name,
      keyAlgorithm: keyForm.keyAlgorithm,
      keyLength: keyForm.keyLength,
      usageLabel: keyForm.usageLabel,
      exportFlag: keyForm.exportFlag,
      exportableLabel: exportFlagToLabel(keyForm.exportFlag),
      publicKeyContent: '-----BEGIN PUBLIC KEY-----\n（原型演示）\n-----END PUBLIC KEY-----',
      addedTime
    })
    creating.value = false
    createDialogVisible.value = false
    ElMessage.success('容器生成成功（通用密码服务接口 GM/T 0019-2023 原型）')
  }, 1500)
}

const handleImportContainer = () => {
  securityModalsRef.value?.openUkeyImport?.()
}

const handleDetail = (row) => {
  currentKey.value = row
  detailDialogVisible.value = true
}

const handleBackup = (row) => {
  securityModalsRef.value?.openUkeyBackup?.(row)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.action-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.detail-p2-body {
  padding: 8px 0 0;
}

.detail-p2-row {
  display: flex;
  align-items: flex-start;
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.detail-p2-label {
  flex: 0 0 120px;
  text-align: right;
  padding-right: 16px;
  color: $text-secondary;
  font-size: 14px;
  line-height: 22px;
}

.detail-p2-value {
  flex: 1;
  color: $text-primary;
  font-size: 14px;
  line-height: 22px;
  word-break: break-all;
}

</style>
