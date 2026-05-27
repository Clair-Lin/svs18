<template>
  <div class="ha-config">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="160px"
        class="ha-form"
      >
        <el-form-item label="高可用开关" prop="enabled" required>
          <el-switch v-model="form.enabled" />
        </el-form-item>

        <template v-if="form.enabled">
          <el-form-item label="高可用类型" prop="haType" required>
            <el-select v-model="form.haType" class="field-md" @change="onHaTypeChange">
              <el-option
                v-for="opt in haTypeOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>

          <!-- 双机热备 -->
          <template v-if="form.haType === HA_TYPES.HOT_STANDBY">
            <el-form-item label="本机角色" prop="localRole" required>
              <el-select v-model="form.localRole" class="field-md" placeholder="请选择本机角色">
                <el-option label="主机" value="master" />
                <el-option label="备机" value="backup" />
              </el-select>
            </el-form-item>

            <div class="ha-section">
              <div class="ha-section-label">节点信息</div>
              <div class="ha-section-body">
                <div class="inline-field-row">
                  <span class="inline-label">节点名称</span>
                  <el-input
                    v-model="form.nodeName"
                    class="field-inline"
                    placeholder="请输入节点名称"
                    clearable
                  />
                </div>
              </div>
            </div>

            <div class="ha-section">
              <div class="ha-section-label">绑定外网网口</div>
              <div class="ha-section-body">
                <div class="field-grid-2">
                  <div class="inline-field-row">
                    <span class="inline-label">外网网口</span>
                    <el-select
                      v-model="form.externalPort"
                      class="field-inline"
                      placeholder="请选择外网网口"
                      clearable
                    >
                      <el-option v-for="p in portOptions" :key="'ext-' + p" :label="p" :value="p" />
                    </el-select>
                  </div>
                  <div class="inline-field-row">
                    <span class="inline-label is-required">外网虚拟IP</span>
                    <el-input
                      v-model="form.externalVip"
                      class="field-inline"
                      placeholder="请输入外网虚拟IP"
                      clearable
                    />
                  </div>
                </div>
                <div class="inline-field-row inline-field-row--block">
                  <span class="inline-label">外网虚拟路由ID</span>
                  <div class="field-with-hint">
                    <el-input
                      v-model="form.externalVrid"
                      class="field-inline"
                      placeholder="请输入外网虚拟路由ID"
                      clearable
                    />
                    <div class="field-hint">
                      主备机要配置相同的ID，同一局域网内有多对时需要配置不同的ID，范围1-254
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="ha-section">
              <div class="ha-section-label">绑定内网网口</div>
              <div class="ha-section-body">
                <div class="field-grid-2">
                  <div class="inline-field-row">
                    <span class="inline-label">内网网口</span>
                    <el-select
                      v-model="form.internalPort"
                      class="field-inline"
                      placeholder="请选择内网网口"
                      clearable
                    >
                      <el-option v-for="p in portOptions" :key="'int-' + p" :label="p" :value="p" />
                    </el-select>
                  </div>
                  <div class="inline-field-row">
                    <span class="inline-label">内网虚拟IP</span>
                    <el-input
                      v-model="form.internalVip"
                      class="field-inline"
                      placeholder="请输入内网虚拟IP"
                      clearable
                    />
                  </div>
                </div>
                <div class="inline-field-row inline-field-row--block">
                  <span class="inline-label">内网虚拟路由ID</span>
                  <div class="field-with-hint">
                    <el-input
                      v-model="form.internalVrid"
                      class="field-inline"
                      placeholder="请输入内网虚拟路由ID"
                      readonly
                    />
                    <div class="field-hint">自动设置，内网虚拟路由ID=外网虚拟路由ID+1</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="ha-section ha-section--plain">
              <div class="ha-section-label">模式</div>
              <div class="ha-section-content">
                <el-radio-group v-model="form.mode">
                  <el-radio label="preempt">抢占模式</el-radio>
                  <el-radio label="non_preempt">非抢占模式</el-radio>
                </el-radio-group>
                <div class="field-hint">主备机的设置需保持一致</div>
              </div>
            </div>
          </template>

          <!-- 集群（内置负载均衡） -->
          <template v-else-if="form.haType === HA_TYPES.CLUSTER_INTERNAL">
            <el-form-item label="节点角色" prop="nodeRole" required>
              <el-select v-model="form.nodeRole" class="field-md" placeholder="请选择节点角色">
                <el-option label="主节点" value="master" />
                <el-option label="从节点" value="slave" />
              </el-select>
            </el-form-item>
            <el-form-item label="网络接口" prop="networkInterface" required>
              <el-select v-model="form.networkInterface" class="field-md" placeholder="请选择网络接口" clearable>
                <el-option v-for="p in portOptions" :key="p" :label="p" :value="p" />
              </el-select>
            </el-form-item>
            <el-form-item label="虚拟IP" prop="virtualIp" required>
              <el-input v-model="form.virtualIp" class="field-md" placeholder="请输入虚拟IP" clearable />
            </el-form-item>
            <el-form-item label="虚拟服务端口" prop="virtualPort" required>
              <el-input v-model="form.virtualPort" class="field-md" placeholder="请输入虚拟服务端口" clearable />
            </el-form-item>
            <el-form-item label="监听协议" prop="listenProtocol" required>
              <el-select v-model="form.listenProtocol" class="field-md" placeholder="请选择监听协议" clearable>
                <el-option label="TCP" value="TCP" />
                <el-option label="UDP" value="UDP" />
              </el-select>
            </el-form-item>
            <el-form-item label="负载均衡策略" prop="lbStrategy" required>
              <el-select v-model="form.lbStrategy" class="field-md" placeholder="请选择负载均衡策略">
                <el-option
                  v-for="opt in LB_STRATEGY_OPTIONS"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="路由ID" prop="routerId">
              <el-input v-model="form.routerId" class="field-md" placeholder="请输入路由ID" clearable />
            </el-form-item>

            <div class="ha-section ha-section--plain">
              <div class="ha-section-label">集群设备信息</div>
              <div class="ha-section-content ha-section-content--full">
                <el-table
                  :data="clusterDeviceRows"
                  border
                  class="device-table"
                  :empty-text="clusterDeviceEmptyText"
                >
                  <el-table-column prop="index" label="序号" width="80" align="center" />
                  <el-table-column prop="clusterIp" label="集群IP" min-width="180" />
                  <el-table-column prop="servicePort" label="服务端口" width="120" align="center" />
                </el-table>
                <p v-if="!clusterDeviceRows.length" class="cluster-device-hint">
                  请先在
                  <router-link :to="{ path: '/system/ha', query: { tab: 'cluster' } }">集群配置</router-link>
                  中完成集群管理（创建集群并添加子节点）。
                </p>
              </div>
            </div>
          </template>

          <!-- 集群（外置负载均衡）：仅类型选择 -->
        </template>

        <el-form-item label=" ">
          <div class="footer-actions">
            <el-button type="primary" :loading="applying" @click="onApply">应用</el-button>
            <el-button @click="onReset">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted, onActivated } from 'vue'
import { ElMessage } from 'element-plus'
import {
  HA_TYPES,
  HA_TYPE_LABELS,
  LB_STRATEGY_OPTIONS,
  loadHaConfig,
  persistHaConfig
} from '@/utils/systemHa'
import { loadHotStandbyNodes, persistHotStandbyNodes } from '@/utils/systemHotStandby'
import { loadClusterConfig, buildClusterDeviceRows } from '@/utils/systemCluster'

const portOptions = ['eth0', 'eth1', 'bond0']

const haTypeOptions = Object.entries(HA_TYPE_LABELS).map(([value, label]) => ({ value, label }))

const formRef = ref(null)
const applying = ref(false)

const form = reactive(loadHaConfig())
const clusterListTick = ref(0)

const clusterDeviceRows = computed(() => {
  clusterListTick.value
  const cluster = loadClusterConfig()
  return buildClusterDeviceRows(cluster, form.virtualPort)
})

onActivated(() => {
  clusterListTick.value++
})

watch(() => form.virtualPort, () => {
  clusterListTick.value++
})

const clusterDeviceEmptyText = computed(() =>
  clusterDeviceRows.value.length ? '暂无数据' : ' '
)

const rules = computed(() => {
  if (!form.enabled) return {}
  if (form.haType === HA_TYPES.HOT_STANDBY) {
    return {
      localRole: [{ required: true, message: '请选择本机角色', trigger: 'change' }]
    }
  }
  if (form.haType === HA_TYPES.CLUSTER_INTERNAL) {
    return {
      nodeRole: [{ required: true, message: '请选择本机角色', trigger: 'change' }],
      virtualPort: [
        { required: true, message: '请输入虚拟服务端口', trigger: 'blur' },
        {
          validator: (_rule, val, cb) => {
            const n = Number(val)
            if (!val || Number.isNaN(n) || n < 1 || n > 65535) {
              cb(new Error('端口取值范围为1-65535'))
            } else {
              cb()
            }
          },
          trigger: 'blur'
        }
      ],
      networkInterface: [{ required: true, message: '请选择网络接口', trigger: 'change' }],
      virtualIp: [{ required: true, message: '请输入虚拟IP', trigger: 'blur' }],
      listenProtocol: [{ required: true, message: '请选择监听协议', trigger: 'change' }],
      lbStrategy: [{ required: true, message: '请选择负载均衡策略', trigger: 'change' }]
    }
  }
  return {}
})

let snapshot = JSON.stringify(form)

watch(
  () => form.externalVrid,
  (val) => {
    const n = parseInt(val, 10)
    if (!Number.isNaN(n) && n >= 1 && n <= 253) {
      form.internalVrid = String(n + 1)
    } else if (!val) {
      form.internalVrid = ''
    }
  }
)

function onHaTypeChange () {
  formRef.value?.clearValidate()
}

function doApply () {
  applying.value = true
  setTimeout(() => {
    persistHaConfig(form)
    if (form.haType === HA_TYPES.HOT_STANDBY && form.localRole) {
      syncHotStandbyDemo()
    }
    applying.value = false
    snapshot = JSON.stringify(form)
    ElMessage.success('高可用配置已应用（原型演示）')
  }, 300)
}

function onApply () {
  if (!form.enabled) {
    persistHaConfig(form)
    snapshot = JSON.stringify(form)
    ElMessage.success('高可用配置已应用（已关闭高可用，原型演示）')
    return
  }

  if (form.haType === HA_TYPES.CLUSTER_EXTERNAL) {
    doApply()
    return
  }

  formRef.value?.validate((valid) => {
    if (!valid) return
    doApply()
  })
}

function syncHotStandbyDemo () {
  const nodes = loadHotStandbyNodes()
  if (nodes.length) return
  const roleLabel = form.localRole === 'master' ? '主机' : '备机'
  persistHotStandbyNodes([
    {
      role: roleLabel,
      nodeId: 'local-node',
      nodeIp: form.externalVip || '192.168.1.100',
      joinTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      status: '初始化'
    }
  ])
}

function onReset () {
  Object.assign(form, JSON.parse(snapshot))
  formRef.value?.clearValidate()
  ElMessage.info('已重置为上次应用前的配置')
}

onMounted(() => {
  snapshot = JSON.stringify(form)
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.ha-config {
  .ha-form {
    max-width: 960px;
  }

  .field-md {
    width: 360px;
    max-width: 100%;
  }

  .field-inline {
    width: 240px;
    max-width: 100%;
  }

  .ha-section {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 16px;

    &--plain .ha-section-label {
      padding-top: 4px;
    }
  }

  .ha-section-label {
    width: 144px;
    flex-shrink: 0;
    padding-top: 10px;
    font-size: 14px;
    color: $text-primary;
    text-align: right;
    line-height: 1.5;
  }

  .ha-section-body {
    flex: 1;
    min-width: 0;
    padding: 16px 20px 12px;
    background: #f5f7fa;
    border-radius: $border-radius;
  }

  .ha-section-content {
    flex: 1;
    min-width: 0;
    padding-top: 2px;

    &--full {
      max-width: 720px;
    }
  }

  .field-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 32px;
    margin-bottom: 12px;
  }

  .inline-field-row {
    display: flex;
    align-items: center;
    gap: 8px;

    &--block {
      align-items: flex-start;

      .inline-label {
        padding-top: 8px;
      }
    }
  }

  .inline-label {
    width: 112px;
    flex-shrink: 0;
    text-align: right;
    font-size: 14px;
    color: $text-primary;
    line-height: 1.5;

    &.is-required::before {
      content: '*';
      color: #f5222d;
      margin-right: 4px;
    }
  }

  .field-with-hint {
    flex: 1;
    min-width: 0;
  }

  .field-hint {
    margin-top: 4px;
    font-size: 12px;
    color: $text-secondary;
    line-height: 1.5;
  }

  .device-table {
    width: 100%;
  }

  .cluster-device-hint {
    margin-top: 8px;
    font-size: 13px;
    color: $text-secondary;
    line-height: 1.6;

    a {
      color: $primary-color;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .footer-actions {
    display: flex;
    gap: 12px;
  }
}
</style>
