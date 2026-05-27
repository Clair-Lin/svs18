<template>
  <div class="cluster-config">
    <div class="card-title">集群管理</div>

    <template v-if="!cluster.active">
      <div class="empty-actions">
        <el-button type="primary" @click="openCreateDialog">创建集群</el-button>
        <el-button @click="openJoinDialog">加入集群</el-button>
      </div>
      <p class="empty-hint">子节点加入集群时需使用中心节点自动生成的 32 位授权码作为身份凭证。</p>
    </template>

    <template v-else>
      <el-alert
        v-if="cluster.authCode"
        type="info"
        :closable="false"
        show-icon
        class="auth-alert"
      >
        <template #title>集群授权码</template>
        中心节点已自动生成授权码，子节点加入时请填写此授权码：
        <code class="auth-code">{{ cluster.authCode }}</code>
        <el-button type="primary" link @click="copyAuthCode">复制</el-button>
      </el-alert>

      <div class="action-bar">
        <el-button type="primary" @click="openJoinDialog">添加子节点</el-button>
        <el-button @click="onDissolve">解散集群</el-button>
      </div>

      <el-table :data="cluster.nodes" border class="sys-table">
        <el-table-column prop="role" label="角色" width="120" align="center" />
        <el-table-column prop="nodeId" label="节点ID" min-width="120" />
        <el-table-column prop="nodeIp" label="节点IP" min-width="160" />
        <el-table-column prop="joinTime" label="加入时间" width="180" align="center" />
        <el-table-column label="状态" width="130" align="center">
          <template #default="{ row }">
            <span class="status-cell" :class="statusClass(row.status)">
              <span class="status-dot" aria-hidden="true" />
              {{ row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200" align="center" fixed="right">
          <template #default="{ row }">
            <div class="row-actions">
              <el-button
                v-if="isCenterNode(row)"
                type="primary"
                link
                @click="showAuthCode"
              >
                授权码
              </el-button>
              <el-button
                v-if="isChildNode(row)"
                type="primary"
                link
                :loading="row._syncing"
                @click="handleDataSync(row)"
              >
                数据同步
              </el-button>
              <el-button
                v-if="isChildNode(row)"
                type="primary"
                link
                @click="handleRemoveChild(row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!-- 创建集群 -->
    <el-dialog v-model="createVisible" title="创建集群" width="520px" destroy-on-close @closed="resetCreateForm">
      <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="100px">
        <el-form-item label="角色" prop="role" required>
          <el-select v-model="createForm.role" class="dialog-field">
            <el-option label="中心节点" value="center" />
          </el-select>
        </el-form-item>
        <el-form-item label="本机IP" prop="localIp" required>
          <el-input v-model="createForm.localIp" class="dialog-field" placeholder="请输入本机IP" clearable />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="createForm.port" class="dialog-field" placeholder="请输入端口" clearable />
        </el-form-item>
        <el-form-item label="网络延时" prop="latency" required>
          <el-input v-model="createForm.latency" class="dialog-field" placeholder="请输入网络延时">
            <template #append>ms</template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" :loading="createSubmitting" @click="onCreateConfirm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 加入集群 -->
    <el-dialog v-model="joinVisible" title="加入集群" width="520px" destroy-on-close @closed="resetJoinForm">
      <el-form ref="joinFormRef" :model="joinForm" :rules="joinRules" label-width="110px">
        <el-form-item label="角色" prop="role" required>
          <el-select v-model="joinForm.role" class="dialog-field" disabled>
            <el-option label="子节点" value="child" />
          </el-select>
        </el-form-item>
        <el-form-item label="中心节点IP" prop="centerIp" required>
          <el-input v-model="joinForm.centerIp" class="dialog-field" placeholder="请输入中心节点IP" clearable />
        </el-form-item>
        <el-form-item label="子节点IP" prop="childIp" required>
          <el-input v-model="joinForm.childIp" class="dialog-field" placeholder="请输入子节点IP" clearable />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="joinForm.port" class="dialog-field" placeholder="请输入端口" clearable />
        </el-form-item>
        <el-form-item label="授权码" prop="authCode" required>
          <el-input
            v-model="joinForm.authCode"
            class="dialog-field"
            placeholder="请输入中心节点提供的 32 位授权码"
            clearable
            maxlength="32"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="joinVisible = false">取消</el-button>
        <el-button type="primary" :loading="joinSubmitting" @click="onJoinConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  loadClusterConfig,
  persistClusterConfig,
  generateNodeId,
  generateAuthCode,
  formatNow,
  isCenterNode,
  isChildNode
} from '@/utils/systemCluster'

const cluster = reactive(loadClusterConfig())

const createVisible = ref(false)
const joinVisible = ref(false)
const createSubmitting = ref(false)
const joinSubmitting = ref(false)
const createFormRef = ref(null)
const joinFormRef = ref(null)

const createForm = reactive({
  role: 'center',
  localIp: '',
  port: '',
  latency: ''
})

const joinForm = reactive({
  role: 'child',
  centerIp: '',
  childIp: '',
  port: '',
  authCode: ''
})

const createRules = {
  localIp: [{ required: true, message: '请输入本机IP', trigger: 'blur' }],
  latency: [{ required: true, message: '请输入网络延时', trigger: 'blur' }]
}

const joinRules = {
  centerIp: [{ required: true, message: '请输入中心节点IP', trigger: 'blur' }],
  childIp: [{ required: true, message: '请输入子节点IP', trigger: 'blur' }],
  authCode: [
    { required: true, message: '请输入授权码', trigger: 'blur' },
    { len: 32, message: '授权码为 32 位字符串', trigger: 'blur' }
  ]
}

function statusClass (status) {
  const map = {
    已同步: 'is-synced',
    数据同步中: 'is-syncing',
    初始化: 'is-init'
  }
  return map[status] || ''
}

function saveCluster () {
  persistClusterConfig(cluster)
}

function getCenterNode () {
  return cluster.nodes.find((n) => isCenterNode(n))
}

function openCreateDialog () {
  createVisible.value = true
}

function openJoinDialog () {
  if (!cluster.active || !cluster.authCode) {
    ElMessage.warning('请先在中心节点创建集群，获取授权码后再加入')
    return
  }
  const center = getCenterNode()
  if (center) {
    joinForm.centerIp = center.nodeIp
  }
  joinVisible.value = true
}

function resetCreateForm () {
  createForm.localIp = ''
  createForm.port = ''
  createForm.latency = ''
}

function resetJoinForm () {
  joinForm.centerIp = getCenterNode()?.nodeIp || ''
  joinForm.childIp = ''
  joinForm.port = ''
  joinForm.authCode = ''
}

function onCreateConfirm () {
  createFormRef.value?.validate((valid) => {
    if (!valid) return
    createSubmitting.value = true
    setTimeout(() => {
      const authCode = generateAuthCode()
      cluster.active = true
      cluster.authCode = authCode
      cluster.servicePort = createForm.port || ''
      cluster.nodes = [
        {
          role: '中心节点',
          nodeId: generateNodeId(),
          nodeIp: createForm.localIp,
          joinTime: formatNow(),
          status: '已同步'
        }
      ]
      saveCluster()
      createSubmitting.value = false
      createVisible.value = false
      ElMessage.success('集群创建成功，已自动生成 32 位授权码')
    }, 300)
  })
}

function onJoinConfirm () {
  joinFormRef.value?.validate((valid) => {
    if (!valid) return

    if (!cluster.active || !cluster.authCode) {
      ElMessage.error('集群尚未创建，请先在中心节点执行「创建集群」')
      return
    }

    if (joinForm.authCode.trim() !== cluster.authCode) {
      ElMessage.error('授权码不正确，请使用中心节点提供的授权码')
      return
    }

    const center = getCenterNode()
    if (!center) {
      ElMessage.error('未找到中心节点，请检查集群状态')
      return
    }

    if (joinForm.centerIp !== center.nodeIp) {
      ElMessage.error('中心节点 IP 与当前集群不一致')
      return
    }

    if (cluster.nodes.some((n) => n.nodeIp === joinForm.childIp)) {
      ElMessage.warning('该子节点 IP 已在集群中')
      return
    }

    joinSubmitting.value = true
    setTimeout(() => {
      cluster.nodes.push({
        role: '子节点',
        nodeId: generateNodeId(),
        nodeIp: joinForm.childIp,
        joinTime: formatNow(),
        status: '初始化'
      })
      saveCluster()
      joinSubmitting.value = false
      joinVisible.value = false
      ElMessage.success('子节点已加入集群（原型演示）')
    }, 300)
  })
}

function showAuthCode () {
  ElMessageBox.alert(cluster.authCode || '—', '集群授权码', {
    confirmButtonText: '确定',
    message: '请将此授权码提供给子节点，用于加入集群时的身份校验。'
  })
}

function copyAuthCode () {
  if (!cluster.authCode) return
  navigator.clipboard?.writeText(cluster.authCode).then(() => {
    ElMessage.success('授权码已复制')
  }).catch(() => {
    ElMessage.info(cluster.authCode)
  })
}

function handleDataSync (row) {
  if (!isChildNode(row)) return
  row._syncing = true
  row.status = '数据同步中'
  saveCluster()
  ElMessage.info('正在由中心节点向子节点发起全量数据同步…')
  setTimeout(() => {
    row.status = '已同步'
    row._syncing = false
    saveCluster()
    ElMessage.success(`子节点 ${row.nodeIp} 全量数据同步完成（原型演示）`)
  }, 1500)
}

function handleRemoveChild (row) {
  if (!isChildNode(row)) return
  ElMessageBox.confirm(`确定将子节点「${row.nodeIp}」踢出集群吗？`, '删除子节点', {
    type: 'warning'
  })
    .then(() => {
      cluster.nodes = cluster.nodes.filter((n) => n.nodeId !== row.nodeId)
      saveCluster()
      ElMessage.success('子节点已从集群中移除（原型演示）')
    })
    .catch(() => {})
}

function onDissolve () {
  ElMessageBox.confirm('确定要解散当前集群吗？解散后授权码将失效。', '提示', { type: 'warning' })
    .then(() => {
      cluster.active = false
      cluster.authCode = ''
      cluster.servicePort = ''
      cluster.nodes = []
      saveCluster()
      ElMessage.success('集群已解散（原型演示）')
    })
    .catch(() => {})
}

onMounted(() => {
  Object.assign(cluster, loadClusterConfig())
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.cluster-config {
  .empty-actions {
    display: flex;
    gap: 12px;
    margin-bottom: 8px;
  }

  .empty-hint {
    font-size: 13px;
    color: $text-secondary;
    line-height: 1.6;
  }

  .auth-alert {
    margin-bottom: 16px;

    .auth-code {
      margin: 0 8px;
      padding: 2px 8px;
      background: #f5f7fa;
      border-radius: 4px;
      font-family: monospace;
      font-size: 13px;
      word-break: break-all;
    }
  }

  .action-bar {
    margin-bottom: 12px;
  }

  .dialog-field {
    width: 100%;
  }

  :deep(.sys-table) {
    .el-table__header-wrapper th.el-table__cell {
      background-color: #f5f7fa !important;
      font-weight: 600;
    }
  }

  .status-cell {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;

    &.is-synced {
      color: #52c41a;
    }

    &.is-syncing {
      color: #faad14;
    }

    &.is-init {
      color: #909399;
    }
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }

  .row-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 8px;
  }
}
</style>
