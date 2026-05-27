/** 检测中心：设备自检项、定时策略、执行记录（原型 localStorage） */

const SCHEDULE_KEY = 'svs_inspect_schedule'
const HISTORY_KEY = 'svs_inspect_history'
const MAX_HISTORY = 100

/** @typedef {'rng'|'sm1'|'sm2'|'sm3'|'sm4'|'key-integrity'|'hsm-card'|'device-full'} DeviceInspectItemId */

export const DEVICE_INSPECT_ITEMS = [
  { id: 'rng', name: '随机数质量自检', category: 'crypto-base' },
  { id: 'sm1', name: 'SM1算法自检', category: 'sm-algo' },
  { id: 'sm2', name: 'SM2算法自检', category: 'sm-algo' },
  { id: 'sm3', name: 'SM3算法自检', category: 'sm-algo' },
  { id: 'sm4', name: 'SM4算法自检', category: 'sm-algo' },
  { id: 'key-integrity', name: '存储密钥和数据完整性自检', category: 'data-key' },
  { id: 'hsm-card', name: '内置密码卡状态自检', category: 'hardware' },
  { id: 'device-full', name: '设备自检', category: 'summary' }
]

export const DEVICE_CATEGORY_LABELS = {
  'crypto-base': '密码学基础',
  'sm-algo': '国密算法',
  'data-key': '数据与密钥',
  hardware: '硬件',
  summary: '综合'
}

export const ALL_DEVICE_ITEM_IDS = DEVICE_INSPECT_ITEMS.map((i) => i.id)

const DEFAULT_SCHEDULE = {
  enabled: false,
  scheduleType: 'daily',
  time: '02:00',
  weekDay: 1,
  scopeMode: 'all',
  scopeItems: [],
  onFailure: 'alert',
  notifyChannels: []
}

function readJson (key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJson (key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadInspectSchedule () {
  const data = readJson(SCHEDULE_KEY, null)
  if (!data) return { ...DEFAULT_SCHEDULE }
  return { ...DEFAULT_SCHEDULE, ...data }
}

export function saveInspectSchedule (schedule) {
  writeJson(SCHEDULE_KEY, schedule)
}

export function loadInspectHistory () {
  return readJson(HISTORY_KEY, [])
}

export function appendInspectHistory (record) {
  const list = loadInspectHistory()
  const entry = {
    id: `hist-${Date.now()}`,
    ...record
  }
  list.unshift(entry)
  if (list.length > MAX_HISTORY) list.length = MAX_HISTORY
  writeJson(HISTORY_KEY, list)
  return entry
}

export function getInspectHistoryById (id) {
  return loadInspectHistory().find((h) => h.id === id)
}

export function resolveDeviceScopeItems (scopeMode, scopeItems) {
  if (scopeMode === 'all') return [...ALL_DEVICE_ITEM_IDS]
  const set = new Set(scopeItems.filter((id) => ALL_DEVICE_ITEM_IDS.includes(id)))
  return ALL_DEVICE_ITEM_IDS.filter((id) => set.has(id))
}

/** 原型：根据项 ID 生成演示结果 */
export function buildDeviceInspectResults (itemIds) {
  const now = formatDateTime(new Date())
  const items = itemIds.map((id) => {
    const def = DEVICE_INSPECT_ITEMS.find((i) => i.id === id)
    const ok = id !== 'sm1' || Math.random() > 0.15
    return {
      id,
      name: def?.name || id,
      category: def?.category || 'summary',
      status: ok ? '正常' : '异常',
      tagType: ok ? 'success' : 'danger',
      detail: ok ? '自检通过' : '算法自检未通过（原型模拟）',
      durationMs: 80 + Math.floor(Math.random() * 120)
    }
  })
  const passed = items.filter((i) => i.status === '正常').length
  return {
    items,
    total: items.length,
    passed,
    failed: items.length - passed,
    warning: 0,
    time: now,
    targetLabel: '本机 192.168.1.100 · 设备自检'
  }
}

export function groupDeviceResultsByCategory (items) {
  const order = ['crypto-base', 'sm-algo', 'data-key', 'hardware', 'summary']
  const groups = {}
  for (const item of items) {
    const cat = item.category || 'summary'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push({
      name: item.name,
      label: item.status,
      tagType: item.tagType,
      metaLines: item.detail ? [`说明：${item.detail} · 耗时 ${item.durationMs}ms`] : []
    })
  }
  return order
    .filter((k) => groups[k]?.length)
    .map((k) => ({
      name: DEVICE_CATEGORY_LABELS[k] || k,
      items: groups[k]
    }))
}

export function formatDateTime (d) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const WEEK_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export function describeSchedule (schedule) {
  if (!schedule?.enabled) return '未启用'
  const t = schedule.time || '02:00'
  if (schedule.scheduleType === 'weekly') {
    const w = WEEK_LABELS[schedule.weekDay ?? 1] || '周一'
    return `每${w} ${t}`
  }
  return `每天 ${t}`
}

/** 原型：估算下次执行时间展示 */
export function computeNextRunDisplay (schedule) {
  if (!schedule?.enabled) return '—'
  const [hh, mm] = (schedule.time || '02:00').split(':').map(Number)
  const next = new Date()
  next.setHours(hh, mm || 0, 0, 0)
  if (next <= new Date()) next.setDate(next.getDate() + 1)
  if (schedule.scheduleType === 'weekly') {
    const target = schedule.weekDay ?? 1
    while (next.getDay() !== target) {
      next.setDate(next.getDate() + 1)
    }
  }
  return formatDateTime(next)
}

export function getLastDeviceInspectFromHistory () {
  const list = loadInspectHistory().filter((h) => h.inspectType === 'device')
  return list[0] || null
}
