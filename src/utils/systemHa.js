const STORAGE_KEY = 'svs_system_ha_config'

export const HA_TYPES = {
  HOT_STANDBY: 'hot_standby',
  CLUSTER_INTERNAL: 'cluster_internal',
  CLUSTER_EXTERNAL: 'cluster_external'
}

export const HA_TYPE_LABELS = {
  [HA_TYPES.HOT_STANDBY]: '双机热备',
  [HA_TYPES.CLUSTER_INTERNAL]: '集群（内置负载均衡）',
  [HA_TYPES.CLUSTER_EXTERNAL]: '集群（外置负载均衡）'
}

/** 负载均衡策略选项，默认 wrr */
export const LB_STRATEGY_OPTIONS = [
  { value: 'rr', label: 'rr - 轮询' },
  { value: 'wrr', label: 'wrr - 加权轮询' },
  { value: 'lc', label: 'lc - 最少连接数' },
  { value: 'wlc', label: 'wlc - 加权最少连接数' },
  { value: 'lblc', label: 'lblc - 基于局部性的最少连接数' },
  { value: 'lblcr', label: 'lblcr - 带复制功能的基于局部性的最少连接数' },
  { value: 'dh', label: 'dh - 目标地址哈希' },
  { value: 'sh', label: 'sh - 源地址哈希' }
]

export function defaultHaConfig () {
  return {
    enabled: false,
    haType: HA_TYPES.HOT_STANDBY,
    // 双机热备
    localRole: '',
    nodeName: '',
    externalPort: '',
    externalVip: '',
    externalVrid: '',
    internalPort: '',
    internalVip: '',
    internalVrid: '',
    mode: 'non_preempt',
    // 集群内置
    nodeRole: '',
    networkInterface: '',
    virtualIp: '',
    virtualPort: '',
    listenProtocol: '',
    lbStrategy: 'wrr',
    routerId: ''
  }
}

export function loadHaConfig () {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultHaConfig()
    const data = JSON.parse(raw)
    const merged = { ...defaultHaConfig(), ...data }
    if (!merged.lbStrategy) merged.lbStrategy = 'wrr'
    return merged
  } catch {
    return defaultHaConfig()
  }
}

export function persistHaConfig (data) {
  const payload = { ...defaultHaConfig(), ...data }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  return payload
}
