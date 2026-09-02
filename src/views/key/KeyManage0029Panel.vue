<template>
  <div class="key-panel">
    <div class="key-search-toolbar">
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">密钥ID</span>
          <el-input
            v-model="filterKeyId"
            placeholder="请输入密钥ID"
            clearable
            class="filter-input"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">密码算法</span>
          <el-select
            v-model="filterAlgorithm"
            placeholder="全部"
            class="filter-select"
            popper-class="key-algorithm-filter-popper"
          >
            <el-option label="全部" value="" />
            <el-option label="SM2" value="SM2" />
            <el-option label="RSA" value="RSA" />
            <el-option label="SM9" value="SM9" />
            <el-option-group label="PQC算法" class="filter-pqc-group">
              <el-option
                v-for="opt in PQC_KEY_OPTIONS"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-option-group>
            <el-option label="SM4" value="SM4" />
            <el-option label="3DES" value="3DES" />
            <el-option label="AES" value="AES" />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">密钥用途</span>
          <el-select v-model="filterUsage" placeholder="全部" class="filter-select">
            <el-option label="全部" value="" />
            <el-option label="签名验签" value="签名验签" />
            <el-option label="加密解密" value="加密解密" />
          </el-select>
        </div>
        <div class="filter-item filter-item--range">
          <span class="filter-label">添加时间</span>
          <el-date-picker
            v-model="filterDateRange"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="x"
            class="filter-daterange"
          />
        </div>
        <div class="filter-item filter-actions">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>

    <div class="action-bar">
      <el-button type="primary" @click="handleCreate">生成密钥  <el-tag type="danger" effect="dark" size="small" style="margin-left: 6px;">新</el-tag></el-button>
      <el-button @click="handleRecover">恢复密钥</el-button>
    </div>

    <el-table :data="pagedKeyList" border stripe>
      <el-table-column prop="index" label="密钥索引" width="100" align="center" />
      <el-table-column prop="keyId" label="密钥ID" min-width="160" show-overflow-tooltip />
      <el-table-column prop="keyAlgorithm" label="密钥算法" width="150" />
      <el-table-column prop="keyUsage" label="密钥用途" min-width="140" show-overflow-tooltip />
      <el-table-column prop="keyLength" label="密钥长度" width="120" align="center" show-overflow-tooltip />
      <el-table-column prop="addedTime" label="添加时间" width="180" />
      <el-table-column label="操作" fixed="right" width="320">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="handleDetail(row)">详情</el-button>
          <el-button type="primary" size="small" link @click="handleBackup(row)">备份</el-button>
          <el-button type="primary" size="small" link @click="handleDestroy(row)">销毁</el-button>
          <el-button type="primary" size="small" link @click="handleViewPassword(row)">
            查看密钥访问口令
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next"
        :total="filteredKeyList.length"
        :page-sizes="[10, 20, 50]"
      />
    </div>

    <el-dialog
      v-model="createDialogVisible"
      title="生成密钥"
      width="560px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="keyForm"
        :rules="formRules"
        label-width="140px"
        :validate-on-rule-change="false"
      >
        <el-form-item prop="keyType">
          <template #label>
            <span class="form-label-with-tag">
              密钥类型
              <el-tag v-if="isIbcKeyType || isPqcKeyType" type="danger" effect="dark" size="small">V1.9.1</el-tag>
            </span>
          </template>
          <el-select
            v-model="keyForm.keyType"
            class="key-type-group-select"
            popper-class="key-type-group-select-popper"
            style="width: 100%"
            @change="handleKeyTypeChange"
          >
            <el-option-group
              v-for="group in KEY_TYPE_GROUPS"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="opt in group.options"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-option-group>
            <el-option-group label="IBC体系密钥" class="key-type-ibc-group">
              <el-option
                v-for="opt in IBC_KEY_TYPE_OPTIONS"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-option-group>
            <el-option-group label="PQC体系密钥" class="key-type-pqc-group">
              <el-option
                v-for="opt in PQC_KEY_OPTIONS"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-option-group>
          </el-select>
        </el-form-item>

        <template v-if="isIbcKeyType" :key="`ibc-${keyForm.keyType}`">
          <el-form-item label="密钥用途" prop="usage">
            <el-checkbox-group v-model="keyForm.usage">
              <el-checkbox :label="SM9_KEY_USAGE">{{ SM9_KEY_USAGE }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <!-- SM9主密钥 -->
          <template v-if="isSm9MasterKey">
            <el-form-item prop="keySize">
              <template #label>
                <span class="form-label-with-tip">
                  密钥长度
                </span>
              </template>
              <el-select v-model="keyForm.keySize" style="width: 100%">
                <el-option label="256" :value="256" />
              </el-select>
            </el-form-item>
            <el-form-item prop="paramDomain">
              <template #label>
                <span class="form-label-with-tip">
                  参数域名
                  <el-tooltip
                    content="参数域名在系统内唯一，不作为用户 Identity 使用"
                    placement="top"
                  >
                    <el-icon class="field-tip-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </span>
              </template>
              <el-input v-model="keyForm.paramDomain" clearable placeholder="请输入参数域名" />
            </el-form-item>
            <el-form-item label="参数版本" prop="paramVersion">
              <el-input v-model="keyForm.paramVersion" clearable placeholder="请输入参数版本" />
            </el-form-item>
          </template>

          <!-- SM9标识密钥 -->
          <template v-if="isSm9IdentityKey">
            <el-form-item label="私钥标识" prop="privateKeyIdentity">
              <el-input
                v-model="keyForm.privateKeyIdentity"
                clearable
                placeholder="请输入私钥标识"
              />
            </el-form-item>
            <el-form-item label="主密钥" prop="masterKeyRef">
              <el-select
                v-model="keyForm.masterKeyRef"
                style="width: 100%"
                placeholder="请选择主密钥"
                clearable
              >
                <el-option
                  v-for="mk in sm9MasterKeyOptions"
                  :key="mk.keyId"
                  :label="mk.paramDomain"
                  :value="mk.keyId"
                />
              </el-select>
            </el-form-item>
          </template>

          <!-- SM9分片主密钥 -->
          <!-- <template v-if="isSm9ShardMasterKey">
            <el-form-item label="主密钥" prop="masterKeyRef">
              <el-select
                v-model="keyForm.masterKeyRef"
                style="width: 100%"
                placeholder="请选择主密钥"
                clearable
              >
                <el-option
                  v-for="mk in sm9MasterKeyOptions"
                  :key="mk.keyId"
                  :label="mk.paramDomain"
                  :value="mk.keyId"
                />
              </el-select>
            </el-form-item>
          </template> -->

          <el-form-item label="密钥访问口令" prop="password">
            <el-input
              v-model="keyForm.password"
              type="password"
              placeholder="请输入密钥访问口令"
              show-password
              autocomplete="new-password"
            />
          </el-form-item>
        </template>

        <template v-else-if="isPqcKeyType" :key="`pqc-${keyForm.keyType}`">
          <el-form-item label="密钥用途" prop="usage">
            <el-checkbox-group v-model="keyForm.usage">
              <el-checkbox :label="PQC_KEY_USAGE">{{ PQC_KEY_USAGE }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="密钥访问口令" prop="password">
            <el-input
              v-model="keyForm.password"
              type="password"
              placeholder="请输入密钥访问口令"
              show-password
              autocomplete="new-password"
            />
          </el-form-item>
        </template>

        <template v-else :key="'std-fields'">
          <el-form-item label="密钥用途" prop="usage">
            <el-checkbox-group v-model="keyForm.usage">
              <el-checkbox label="签名验签" :disabled="isSymmetricKeyType">
                签名验签
              </el-checkbox>
              <el-checkbox label="加密解密">加密解密</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="密钥长度" prop="keySize">
            <el-select v-model="keyForm.keySize" style="width: 100%">
              <el-option
                v-for="size in availableSizes"
                :key="size"
                :label="String(size)"
                :value="size"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="密钥访问口令" prop="password">
            <el-input
              v-model="keyForm.password"
              type="password"
              placeholder="请输入密钥访问口令"
              show-password
              autocomplete="new-password"
            />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="creating" @click="handleCreateKey">
          {{ creating ? '生成中...' : '确定' }}
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="detailDialogVisible"
      title="密钥详情"
      width="520px"
      class="detail-dialog-p2"
      align-center
    >
      <div v-if="currentKey" class="detail-p2-body">
        <div class="detail-p2-row">
          <span class="detail-p2-label">密钥索引</span>
          <span class="detail-p2-value">{{ currentKey.index }}</span>
        </div>
        <div class="detail-p2-row">
          <span class="detail-p2-label">密钥ID</span>
          <span class="detail-p2-value">{{ currentKey.keyId }}</span>
        </div>
        <div class="detail-p2-row">
          <span class="detail-p2-label">密钥算法</span>
          <span class="detail-p2-value">{{ currentKey.keyAlgorithm }}</span>
        </div>
        <div class="detail-p2-row">
          <span class="detail-p2-label">密钥类型</span>
          <span class="detail-p2-value">{{ currentKey.keyType || '—' }}</span>
        </div>
        <div class="detail-p2-row">
          <span class="detail-p2-label">密钥用途</span>
          <span class="detail-p2-value">{{ currentKey.keyUsage }}</span>
        </div>
        <div v-if="!isPqcKeyRow(currentKey)" class="detail-p2-row">
          <span class="detail-p2-label">密钥长度</span>
          <span class="detail-p2-value">{{ currentKey.keyLength }}</span>
        </div>
        <template v-if="isIbcKeyRow(currentKey)">
          <div class="detail-p2-row">
            <span class="detail-p2-label">参数域名</span>
            <span class="detail-p2-value">{{ currentKey.paramDomain || '—' }}</span>
          </div>
          <div class="detail-p2-row">
            <span class="detail-p2-label">参数版本</span>
            <span class="detail-p2-value">{{ currentKey.paramVersion || '—' }}</span>
          </div>
          <template v-if="currentKey.keyType === KEY_TYPE.SM9_IDENTITY">
            <div class="detail-p2-row">
              <span class="detail-p2-label">私钥标识</span>
              <span class="detail-p2-value">{{ currentKey.privateKeyIdentity }}</span>
            </div>
            <div class="detail-p2-row">
              <span class="detail-p2-label">主密钥</span>
              <span class="detail-p2-value">{{ formatMasterKeyRef(currentKey) }}</span>
            </div>
          </template>
          <template v-if="currentKey.keyType === KEY_TYPE.SM9_SHARD">
            <div class="detail-p2-row">
              <span class="detail-p2-label">主密钥</span>
              <span class="detail-p2-value">{{ formatMasterKeyRef(currentKey) }}</span>
            </div>
          </template>
        </template>
        <div class="detail-p2-row">
          <span class="detail-p2-label">添加时间</span>
          <span class="detail-p2-value">{{ currentKey.addedTime }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import { KEY_MANAGE_SECURITY_KEY } from './keyManageSecurityKey.js'

/** 密钥类型（下拉分组选项值） */
const KEY_TYPE = {
  SM2: 'SM2密钥',
  RSA: 'RSA',
  SM4: 'SM4',
  TDES: '3DES',
  AES: 'AES',
  SM9_MASTER: 'SM9主密钥',
  SM9_IDENTITY: 'SM9标识密钥',
  // SM9_SHARD: 'SM9分片主密钥'
}

/** PQC 体系密钥：类型即算法变体，生成时无单独长度选择 */
const PQC_KEY_OPTIONS = [
  { label: 'ML_DSA_44', value: 'ML_DSA_44' },
  { label: 'ML_DSA_65', value: 'ML_DSA_65' },
  { label: 'ML_DSA_87', value: 'ML_DSA_87' },
  { label: 'SLH_DSA_SHA2_128s', value: 'SLH_DSA_SHA2_128s' },
  { label: 'SLH_DSA_SHA2_128f', value: 'SLH_DSA_SHA2_128f' },
  { label: 'SLH_DSA_SHA2_192s', value: 'SLH_DSA_SHA2_192s' },
  { label: 'SLH_DSA_SHA2_192f', value: 'SLH_DSA_SHA2_192f' },
  { label: 'SLH_DSA_SHA2_256s', value: 'SLH_DSA_SHA2_256s' },
  { label: 'SLH_DSA_SHA2_256f', value: 'SLH_DSA_SHA2_256f' },
  { label: 'AIGIS_SIG1', value: 'AIGIS_SIG1' },
  { label: 'AIGIS_SIG2', value: 'AIGIS_SIG2' },
  { label: 'AIGIS_SIG3', value: 'AIGIS_SIG3' }
]

const PQC_KEY_TYPES = PQC_KEY_OPTIONS.map((o) => o.value)

/** 对称密钥类型（块密码，仅加密解密） */
const SYMMETRIC_KEY_TYPES = [KEY_TYPE.SM4, KEY_TYPE.TDES, KEY_TYPE.AES]

/** 分组下拉：PKI / 对称密钥（IBC、PQC 在模板中单独渲染） */
const KEY_TYPE_GROUPS = [
  {
    label: 'PKI体系密钥',
    options: [
      { label: 'SM2密钥', value: KEY_TYPE.SM2 },
      { label: 'RSA', value: KEY_TYPE.RSA }
    ]
  },
  {
    label: '对称密钥体系',
    options: [
      { label: 'SM4', value: KEY_TYPE.SM4 },
      { label: '3DES', value: KEY_TYPE.TDES },
      { label: 'AES', value: KEY_TYPE.AES }
    ]
  }
]

const IBC_KEY_TYPE_OPTIONS = [
  { label: 'SM9主密钥', value: KEY_TYPE.SM9_MASTER },
  { label: 'SM9标识密钥', value: KEY_TYPE.SM9_IDENTITY },
  // { label: 'SM9分片主密钥', value: KEY_TYPE.SM9_SHARD }
]

const IBC_KEY_TYPES = [KEY_TYPE.SM9_MASTER, KEY_TYPE.SM9_IDENTITY, KEY_TYPE.SM9_SHARD]

/** SM9 固定密钥用途 */
const SM9_KEY_USAGE = '签名验签'

/** PQC 固定密钥用途 */
const PQC_KEY_USAGE = '签名验签'

function resolveKeyAlgorithm (keyType) {
  if (IBC_KEY_TYPES.includes(keyType)) return 'SM9'
  if (PQC_KEY_TYPES.includes(keyType)) return keyType
  if (keyType === KEY_TYPE.SM2) return 'SM2'
  if (keyType === KEY_TYPE.RSA) return 'RSA'
  if (SYMMETRIC_KEY_TYPES.includes(keyType)) {
    if (keyType === KEY_TYPE.TDES) return '3DES'
    return keyType
  }
  return 'SM2'
}

function isIbcKeyRow (row) {
  return row && IBC_KEY_TYPES.includes(row.keyType)
}

function isPqcKeyRow (row) {
  return row && PQC_KEY_TYPES.includes(row.keyType)
}

function findSm9MasterByRef (masterKeyRef) {
  return keyList.value.find(
    (row) => row.keyType === KEY_TYPE.SM9_MASTER && row.keyId === masterKeyRef
  )
}

function formatMasterKeyRef (row) {
  if (!row?.masterKeyRef) return '—'
  const master = findSm9MasterByRef(row.masterKeyRef)
  return master?.paramDomain ? `${master.paramDomain}（${row.masterKeyRef}）` : row.masterKeyRef
}

const filterKeyId = ref('')
const filterAlgorithm = ref('')
const filterUsage = ref('')
const filterDateRange = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const createDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const creating = ref(false)
const currentKey = ref(null)
const formRef = ref(null)
const securityModalsRef = inject(KEY_MANAGE_SECURITY_KEY) ?? ref(null)

const keyForm = reactive({
  keyType: KEY_TYPE.SM2,
  usage: ['签名验签'],
  keySize: 256,
  password: '',
  paramDomain: '',
  paramVersion: '',
  privateKeyIdentity: '',
  masterKeyRef: ''
})

const PASSWORD_RULES = [
  { required: true, message: '请输入密钥访问口令', trigger: 'blur' },
  { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' }
]

function validateParamDomainUnique (_rule, value, callback) {
  const domain = String(value ?? '').trim()
  if (!domain) {
    callback()
    return
  }
  const exists = keyList.value.some(
    (row) => row.keyType === KEY_TYPE.SM9_MASTER && row.paramDomain === domain
  )
  if (exists) {
    callback(new Error('参数域名已存在，请使用其他域名'))
  } else {
    callback()
  }
}

const formRules = computed(() => {
  const base = {
    keyType: [{ required: true, message: '请选择密钥类型', trigger: 'change' }],
    usage: [{ required: true, message: '请选择密钥用途', trigger: 'blur', type: 'array', min: 1 }],
    password: PASSWORD_RULES
  }
  if (isPqcKeyType.value) {
    return base
  }
  if (!isIbcKeyType.value) {
    return {
      ...base,
      keySize: [{ required: true, message: '请选择密钥长度', trigger: 'blur' }]
    }
  }
  const ibcBase = { ...base }
  if (isSm9MasterKey.value) {
    return {
      ...ibcBase,
      keySize: [{ required: true, message: '请选择密钥长度', trigger: 'blur' }],
      paramDomain: [
        { required: true, message: '请输入参数域名', trigger: 'blur' },
        { validator: validateParamDomainUnique, trigger: 'blur' }
      ],
      paramVersion: [{ required: true, message: '请输入参数版本', trigger: 'blur' }]
    }
  }
  if (isSm9IdentityKey.value) {
    return {
      ...ibcBase,
      privateKeyIdentity: [{ required: true, message: '请输入私钥标识', trigger: 'blur' }],
      masterKeyRef: [{ required: true, message: '请选择主密钥', trigger: 'change' }]
    }
  }
  if (isSm9ShardMasterKey.value) {
    return {
      ...ibcBase,
      masterKeyRef: [{ required: true, message: '请选择主密钥', trigger: 'change' }]
    }
  }
  return ibcBase
})

async function clearFormValidation () {
  await nextTick()
  formRef.value?.clearValidate()
}

/** 各算法可选密钥长度（位），与算法类型一致 */
const KEY_SIZES_BY_ALGORITHM = {
  SM2: [256],
  RSA: [2048],
  SM4: [128],
  '3DES': [168],
  AES: [128]
}

/** SM9 密钥长度由系统维护 */
const SM9_SYSTEM_KEY_LENGTH = '256'

const formKeyAlgorithm = computed(() => resolveKeyAlgorithm(keyForm.keyType))

const availableSizes = computed(() => KEY_SIZES_BY_ALGORITHM[formKeyAlgorithm.value] ?? [256])

/** 对称密钥体系仅支持加密解密 */
const isSymmetricKeyType = computed(() => SYMMETRIC_KEY_TYPES.includes(keyForm.keyType))

const isIbcKeyType = computed(() => IBC_KEY_TYPES.includes(keyForm.keyType))
const isPqcKeyType = computed(() => PQC_KEY_TYPES.includes(keyForm.keyType))
const isSm9MasterKey = computed(() => keyForm.keyType === KEY_TYPE.SM9_MASTER)
const isSm9IdentityKey = computed(() => keyForm.keyType === KEY_TYPE.SM9_IDENTITY)
const isSm9ShardMasterKey = computed(() => keyForm.keyType === KEY_TYPE.SM9_SHARD)

const sm9MasterKeyOptions = computed(() =>
  keyList.value.filter((row) => row.keyType === KEY_TYPE.SM9_MASTER)
)

function resetIbcFields () {
  keyForm.paramDomain = ''
  keyForm.paramVersion = ''
  keyForm.privateKeyIdentity = ''
  keyForm.masterKeyRef = ''
  keyForm.keySize = 256
}

function applyKeyTypeDefaults () {
  if (isIbcKeyType.value) {
    resetIbcFields()
    keyForm.usage = [SM9_KEY_USAGE]
    return
  }
  if (isPqcKeyType.value) {
    resetIbcFields()
    keyForm.usage = [PQC_KEY_USAGE]
    return
  }
  resetIbcFields()
  const algo = formKeyAlgorithm.value
  const sizes = KEY_SIZES_BY_ALGORITHM[algo]
  keyForm.keySize = sizes?.length ? sizes[0] : 256
  if (isSymmetricKeyType.value) {
    keyForm.usage = ['加密解密']
  } else {
    keyForm.usage = ['签名验签']
  }
}

async function handleKeyTypeChange () {
  applyKeyTypeDefaults()
  await clearFormValidation()
}

function getIbcValidateFields () {
  const common = ['keyType', 'usage', 'password']
  if (isSm9MasterKey.value) {
    return [...common, 'keySize', 'paramDomain', 'paramVersion']
  }
  if (isSm9IdentityKey.value) {
    return [...common, 'privateKeyIdentity', 'masterKeyRef']
  }
  if (isSm9ShardMasterKey.value) {
    return [...common, 'masterKeyRef']
  }
  return common
}

function resolveIbcParamFromMaster (masterKeyRef) {
  const master = findSm9MasterByRef(masterKeyRef)
  return {
    paramDomain: master?.paramDomain ?? '',
    paramVersion: master?.paramVersion ?? ''
  }
}

function buildIbcKeyRow (now, addedTime) {
  const base = {
    index: nextKeyIndex(),
    keyId: String(now),
    keyAlgorithm: 'SM9',
    keyType: keyForm.keyType,
    keyUsage: SM9_KEY_USAGE,
    keyLength: SM9_SYSTEM_KEY_LENGTH,
    addedTime,
    addedTimeMs: now
  }
  if (isSm9MasterKey.value) {
    return {
      ...base,
      keyLength: String(keyForm.keySize),
      paramDomain: keyForm.paramDomain.trim(),
      paramVersion: keyForm.paramVersion.trim()
    }
  }
  const params = resolveIbcParamFromMaster(keyForm.masterKeyRef)
  if (isSm9IdentityKey.value) {
    return {
      ...base,
      ...params,
      privateKeyIdentity: keyForm.privateKeyIdentity.trim(),
      masterKeyRef: keyForm.masterKeyRef
    }
  }
  return {
    ...base,
    ...params,
    masterKeyRef: keyForm.masterKeyRef
  }
}

function buildPkiKeyRow (now, addedTime) {
  const usageLabel = keyForm.usage.join('、')
  return {
    index: nextKeyIndex(),
    keyId: String(now),
    keyAlgorithm: formKeyAlgorithm.value,
    keyType: keyForm.keyType,
    keyUsage: usageLabel,
    keyLength: String(keyForm.keySize),
    addedTime,
    addedTimeMs: now
  }
}

function buildPqcKeyRow (now, addedTime) {
  return {
    index: nextKeyIndex(),
    keyId: String(now),
    keyAlgorithm: keyForm.keyType,
    keyType: keyForm.keyType,
    keyUsage: PQC_KEY_USAGE,
    keyLength: '—',
    addedTime,
    addedTimeMs: now
  }
}

const keyList = ref([
  {
    index: 106,
    keyId: '1763200300666004',
    keyAlgorithm: 'ML_DSA_65',
    keyType: 'ML_DSA_65',
    keyUsage: PQC_KEY_USAGE,
    keyLength: '—',
    addedTime: '2025-11-15 12:00:00',
    addedTimeMs: 1763185200000
  },
  {
    index: 105,
    keyId: '1763200200555003',
    keyAlgorithm: 'SM9',
    keyType: KEY_TYPE.SM9_SHARD,
    keyUsage: SM9_KEY_USAGE,
    keyLength: SM9_SYSTEM_KEY_LENGTH,
    paramDomain: 'svs.sm9.domain.demo',
    paramVersion: '1.0',
    masterKeyRef: '1763200100888001',
    addedTime: '2025-11-15 11:00:00',
    addedTimeMs: 1763181600000
  },
  {
    index: 104,
    keyId: '1763200150444002',
    keyAlgorithm: 'SM9',
    keyType: KEY_TYPE.SM9_IDENTITY,
    keyUsage: SM9_KEY_USAGE,
    keyLength: SM9_SYSTEM_KEY_LENGTH,
    paramDomain: 'svs.sm9.domain.demo',
    paramVersion: '1.0',
    privateKeyIdentity: 'user-identity-001',
    masterKeyRef: '1763200100888001',
    addedTime: '2025-11-15 10:15:00',
    addedTimeMs: 1763178900000
  },
  {
    index: 103,
    keyId: '1763200100888001',
    keyAlgorithm: 'SM9',
    keyType: KEY_TYPE.SM9_MASTER,
    keyUsage: SM9_KEY_USAGE,
    keyLength: '256',
    paramDomain: 'svs.sm9.domain.demo',
    paramVersion: '1.0',
    addedTime: '2025-11-15 09:30:00',
    addedTimeMs: 1763176200000
  },
  {
    index: 102,
    keyId: '1763124279630301',
    keyAlgorithm: 'RSA',
    keyType: KEY_TYPE.RSA,
    keyUsage: '签名验签',
    keyLength: '2048',
    addedTime: '2025-11-14 20:44:39',
    addedTimeMs: 1763124279000
  },
  {
    index: 101,
    keyId: '1763124100123456',
    keyAlgorithm: 'SM2',
    keyType: KEY_TYPE.SM2,
    keyUsage: '签名验签',
    keyLength: '256',
    addedTime: '2025-11-14 18:22:10',
    addedTimeMs: 1763118130000
  }
])

const filteredKeyList = computed(() =>
  keyList.value.filter((row) => {
    if (filterKeyId.value && !String(row.keyId).includes(filterKeyId.value.trim())) {
      return false
    }
    if (filterAlgorithm.value && row.keyAlgorithm !== filterAlgorithm.value) {
      return false
    }
    if (filterUsage.value && row.keyUsage !== filterUsage.value) {
      return false
    }
    if (filterDateRange.value && filterDateRange.value.length === 2) {
      const [start, end] = filterDateRange.value.map(Number)
      if (row.addedTimeMs < start || row.addedTimeMs > end) return false
    }
    return true
  })
)

const pagedKeyList = computed(() => {
  const list = filteredKeyList.value
  const start = (currentPage.value - 1) * pageSize.value
  return list.slice(start, start + pageSize.value)
})

function formatNow () {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function nextKeyIndex () {
  const max = keyList.value.reduce((m, row) => Math.max(m, row.index ?? 0), 0)
  return max + 1
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  filterKeyId.value = ''
  filterAlgorithm.value = ''
  filterUsage.value = ''
  filterDateRange.value = null
  currentPage.value = 1
}

const handleCreate = async () => {
  Object.assign(keyForm, {
    keyType: KEY_TYPE.SM2,
    usage: ['签名验签'],
    keySize: 256,
    password: '',
    paramDomain: '',
    paramVersion: '',
    privateKeyIdentity: '',
    masterKeyRef: ''
  })
  createDialogVisible.value = true
  await clearFormValidation()
}

async function handleCreateKey () {
  const fieldsToValidate = isIbcKeyType.value
    ? getIbcValidateFields()
    : isPqcKeyType.value
      ? ['keyType', 'usage', 'password']
      : ['keyType', 'usage', 'keySize', 'password']
  try {
    for (const field of fieldsToValidate) {
      await formRef.value?.validateField(field)
    }
  } catch {
    return
  }
  if (isIbcKeyType.value && !isSm9MasterKey.value && !sm9MasterKeyOptions.value.length) {
    ElMessage.warning('请先创建 SM9 主密钥')
    return
  }
  creating.value = true
  setTimeout(() => {
    const now = Date.now()
    const addedTime = formatNow()
    if (isIbcKeyType.value) {
      keyList.value.unshift(buildIbcKeyRow(now, addedTime))
    } else if (isPqcKeyType.value) {
      keyList.value.unshift(buildPqcKeyRow(now, addedTime))
    } else {
      keyList.value.unshift(buildPkiKeyRow(now, addedTime))
    }
    creating.value = false
    createDialogVisible.value = false
    keyForm.password = ''
    let msg = '密钥生成成功（签名验签服务器 GM/T 0029-2014 原型）'
    if (isIbcKeyType.value) {
      msg = `${keyForm.keyType} 生成成功（密钥索引、密钥 ID 由系统分配）`
    } else if (isPqcKeyType.value) {
      msg = `${keyForm.keyType} 密钥生成成功（用途：${PQC_KEY_USAGE}）`
    }
    ElMessage.success(msg)
  }, 1500)
}

const handleRecover = () => {
  ElMessage.info('恢复密钥：请选择密钥备份文件（原型演示）')
}

const handleDetail = (row) => {
  currentKey.value = row
  detailDialogVisible.value = true
}

const handleBackup = (row) => {
  securityModalsRef.value?.openUkeyBackup?.(row)
}

const handleDestroy = (row) => {
  securityModalsRef.value?.openDestroyFlow?.(row)
}

const handleViewPassword = (row) => {
  securityModalsRef.value?.openViewPasswordFlow?.(row)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.key-search-toolbar {
  background: $card-bg;
  padding: $spacing-md;
  margin-bottom: $spacing-sm;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md $spacing-lg;
  align-items: center;
}

.filter-item {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: $spacing-xs;
}

.filter-item--range {
  flex: 1 1 320px;
  min-width: 280px;
}

.filter-label {
  flex-shrink: 0;
  font-size: $font-size-base;
  color: $text-secondary;
  white-space: nowrap;
}

.filter-input {
  width: 200px;
}

.filter-select {
  width: 140px;
}

.filter-daterange {
  flex: 1;
  min-width: 180px;
  max-width: 300px;
}

.filter-actions {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: $spacing-xs;
}

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

.form-label-with-tag,
.form-label-with-tip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.field-tip-icon {
  font-size: 14px;
  color: $text-secondary;
  cursor: help;
}

.key-type-group-select {
  width: 100%;
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
  flex: 0 0 140px;
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

<style lang="scss">
@import '@/styles/variables.scss';

@mixin select-group-title-badge($text) {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &::after {
    content: $text;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: #fff;
    background-color: var(--el-color-danger);
    border-radius: var(--el-border-radius-base);
    font-weight: normal;
  }
}

.key-type-group-select-popper,
.key-algorithm-filter-popper {
  .key-type-ibc-group .el-select-group__title {
    @include select-group-title-badge('V1.9.1');
  }

  .key-type-pqc-group .el-select-group__title,
  .filter-pqc-group .el-select-group__title {
    @include select-group-title-badge('V1.9.1');
  }

  .el-select-group__title {
    color: $primary-color;
    font-weight: 600;
    font-size: 13px;
    padding-left: 12px;
  }
}
</style>
