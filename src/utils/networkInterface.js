/** 网口用途 */
export const PORT_USAGE_MANAGE = 'manage'
export const PORT_USAGE_BUSINESS = 'business'

export const PORT_USAGE_LABEL = {
  [PORT_USAGE_MANAGE]: '管理网口',
  [PORT_USAGE_BUSINESS]: '业务网口'
}

export function emptyIpStack () {
  return { ip: '', mask: '', gateway: '' }
}

/** 物理网口演示数据（网口配置 Tab） */
export const MOCK_PHYSICAL_PORTS = [
  {
    alias: 'ETH0',
    name: 'eth0',
    usage: PORT_USAGE_MANAGE,
    enabled: true,
    portUp: true,
    ipv4: emptyIpStack(),
    ipv6: emptyIpStack(),
    vendor: 'vmxnet3',
    driverVersion: '1.4.17.0-k-NAPI',
    speed: '10000Mb/s'
  },
  {
    alias: 'ETH1',
    name: 'eth1',
    usage: PORT_USAGE_MANAGE,
    enabled: true,
    portUp: true,
    ipv4: emptyIpStack(),
    ipv6: emptyIpStack(),
    vendor: 'vmxnet3',
    driverVersion: '1.4.17.0-k-NAPI',
    speed: '10000Mb/s'
  },
  {
    alias: 'ETH2',
    name: 'eth2',
    usage: PORT_USAGE_MANAGE,
    enabled: true,
    portUp: true,
    ipv4: emptyIpStack(),
    ipv6: emptyIpStack(),
    vendor: 'vmxnet3',
    driverVersion: '1.4.17.0-k-NAPI',
    speed: '10000Mb/s'
  },
  {
    alias: 'ETH3',
    name: 'eth3',
    usage: PORT_USAGE_BUSINESS,
    enabled: true,
    portUp: true,
    ipv4: emptyIpStack(),
    ipv6: emptyIpStack(),
    vendor: 'vmxnet3',
    driverVersion: '1.4.17.0-k-NAPI',
    speed: '10000Mb/s'
  },
  {
    alias: 'ETH4',
    name: 'eth4',
    usage: PORT_USAGE_MANAGE,
    enabled: true,
    portUp: true,
    ipv4: { ip: '192.168.204.163', mask: '255.255.255.0', gateway: '192.168.204.1' },
    ipv6: emptyIpStack(),
    vendor: 'vmxnet3',
    driverVersion: '1.4.17.0-k-NAPI',
    speed: '10000Mb/s'
  }
]

export const PARENT_INTERFACE_OPTIONS = MOCK_PHYSICAL_PORTS.map((p) => ({
  label: p.alias,
  value: p.name
}))

export const BOND_MODE_OPTIONS = [
  { label: 'mode=0 (balance-rr)', value: '0' },
  { label: 'mode=1 (active-backup)', value: '1' },
  { label: 'mode=4 (802.3ad)', value: '4' },
  { label: 'mode=6 (balance-alb)', value: '6' }
]

export const BINDABLE_PORT_OPTIONS = MOCK_PHYSICAL_PORTS.map((p) => ({
  label: p.alias,
  value: p.alias
}))

export function formatIpCell (stack, field = 'ip') {
  const val = String(stack?.[field] ?? '').trim()
  return val || '--'
}

export function formatIpv6Detail (stack) {
  const ip = String(stack?.ip ?? '').trim()
  return ip || '未设置'
}

/** 系统默认网桥，不可删除 */
export const DEFAULT_BRIDGE_BR0 = {
  bridgeName: 'br0',
  boundPort: 'ETH4',
  gateway: '192.168.204.1',
  subnetMask: '255.255.255.0'
}

export function isSystemBridgeName (name) {
  return String(name ?? '').trim() === DEFAULT_BRIDGE_BR0.bridgeName
}

/** @returns {number|null} */
export function parseBridgeSuffix (value) {
  const raw = String(value ?? '').trim()
  if (!/^\d+$/.test(raw)) return null
  const n = Number(raw)
  if (!Number.isInteger(n) || n < 0 || n > 10) return null
  return n
}

export function toBridgeName (suffix) {
  return `br${suffix}`
}
