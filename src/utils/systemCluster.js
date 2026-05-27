const STORAGE_KEY = 'svs_cluster_config'

export function defaultClusterConfig () {
  return {
    active: false,
    /** 集群级授权码，创建集群时由中心节点自动生成 */
    authCode: '',
    /** 集群服务端口（创建时可选填写） */
    servicePort: '',
    nodes: []
  }
}

export function loadClusterConfig () {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultClusterConfig()
    const data = JSON.parse(raw)
    return {
      ...defaultClusterConfig(),
      ...data,
      nodes: Array.isArray(data.nodes) ? data.nodes : []
    }
  } catch {
    return defaultClusterConfig()
  }
}

export function persistClusterConfig (data) {
  const payload = {
    active: !!data.active,
    authCode: data.authCode || '',
    servicePort: data.servicePort || '',
    nodes: Array.isArray(data.nodes) ? data.nodes : []
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  return payload
}

export function generateNodeId () {
  return Math.random().toString(16).slice(2, 10)
}

/** 32 位随机授权码（十六进制） */
export function generateAuthCode () {
  const chars = '0123456789abcdef'
  let code = ''
  for (let i = 0; i < 32; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export function formatNow () {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function isCenterNode (node) {
  return node?.role === '中心节点'
}

export function isChildNode (node) {
  return node?.role === '子节点'
}

/**
 * 根据集群节点列表构建「集群设备信息」表格数据
 * @param {string} [servicePort] 虚拟服务端口（优先取高可用配置）
 */
export function buildClusterDeviceRows (cluster, servicePort) {
  if (!cluster?.active || !cluster.nodes?.length) return []
  const port = servicePort || cluster.servicePort || '—'
  return cluster.nodes.map((node, index) => ({
    index: index + 1,
    clusterIp: node.nodeIp,
    servicePort: port
  }))
}
