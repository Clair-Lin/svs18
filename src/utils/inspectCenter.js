/** 检测中心：设备自检项、定时策略、执行记录（原型 localStorage） */

const SCHEDULE_KEY = 'svs_inspect_schedule'
const HISTORY_KEY = 'svs_inspect_history'
const MAX_HISTORY = 100

/** @typedef {'rng'|'sm1'|'sm2'|'sm3'|'sm4'|'key-integrity'|'hsm-card'|'network'|'disk'|'memory'|'cpu'} DeviceInspectItemId */

export const DEVICE_INSPECT_ITEMS = [
  { id: 'rng', name: '随机数质量自检', category: 'crypto-base' },
  { id: 'sm1', name: 'SM1算法自检', category: 'sm-algo' },
  { id: 'sm2', name: 'SM2算法自检', category: 'sm-algo' },
  { id: 'sm3', name: 'SM3算法自检', category: 'sm-algo' },
  { id: 'sm4', name: 'SM4算法自检', category: 'sm-algo' },
  { id: 'key-integrity', name: '存储密钥和数据完整性自检', category: 'data-key' },
  { id: 'hsm-card', name: '内置密码卡状态自检', category: 'hardware' },
  { id: 'network', name: '网络', category: 'system-resource' },
  { id: 'disk', name: '硬盘', category: 'system-resource' },
  { id: 'memory', name: '内存', category: 'system-resource' },
  { id: 'cpu', name: 'CPU', category: 'system-resource' }
]

export const DEVICE_CATEGORY_LABELS = {
  'crypto-base': '密码学基础',
  'sm-algo': '国密算法',
  'data-key': '数据与密钥',
  hardware: '硬件',
  'system-resource': '系统资源'
}

export const ALL_DEVICE_ITEM_IDS = DEVICE_INSPECT_ITEMS.map((i) => i.id)

const DEFAULT_SCHEDULE = {
  enabled: false,
  intervalValue: 30,
  intervalUnit: 'hour',
  scopeMode: 'all',
  scopeItems: [],
  onFailure: 'alert',
  notifyChannels: []
}

const INTERVAL_UNIT_LABELS = {
  minute: '分钟',
  hour: '小时',
  day: '天'
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
  const merged = { ...DEFAULT_SCHEDULE, ...data }
  if (data.scheduleType && merged.intervalValue == null) {
    merged.intervalValue = 1
    merged.intervalUnit = data.scheduleType === 'weekly' ? 'day' : 'day'
  }
  return merged
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

/** 原型：单项检测结果 */
function buildDeviceInspectItemResult (id) {
  const def = DEVICE_INSPECT_ITEMS.find((i) => i.id === id)
  const name = def?.name || id
  const category = def?.category || 'system-resource'
  const durationMs = 80 + Math.floor(Math.random() * 120)

  const prototypes = {
    rng: {
      ok: true,
      detailOk: '随机数发生器自检通过',
      detailFail: '随机数质量检测未通过'
    },
    sm1: {
      ok: Math.random() > 0.15,
      detailOk: 'SM1 算法自检通过',
      detailFail: 'SM1 算法自检未通过'
    },
    sm2: { ok: true, detailOk: 'SM2 算法自检通过', detailFail: 'SM2 算法自检未通过' },
    sm3: { ok: true, detailOk: 'SM3 算法自检通过', detailFail: 'SM3 算法自检未通过' },
    sm4: { ok: true, detailOk: 'SM4 算法自检通过', detailFail: 'SM4 算法自检未通过' },
    'key-integrity': {
      ok: true,
      detailOk: '存储密钥与数据完整性校验通过',
      detailFail: '密钥或数据完整性校验失败'
    },
    'hsm-card': {
      ok: true,
      detailOk: '内置密码卡状态正常',
      detailFail: '内置密码卡状态异常'
    },
    network: {
      ok: Math.random() > 0.08,
      detailOk: '网络: ens192 (running)',
      detailFail: '网络: ens192 (down); 请检查网卡或链路'
    },
    disk: {
      ok: Math.random() > 0.05,
      detailOk: '硬盘: 已用 10 GB / 总共 23 GB',
      detailFail: '硬盘: 使用率过高或读写异常'
    },
    memory: {
      ok: true,
      detailOk: '内存: 已用 2777 MB, 总共 3728 MB, 交换空间: 8075 MB, 已使用空间: 834 MB',
      detailFail: '内存: 可用空间不足或交换分区异常'
    },
    cpu: {
      ok: true,
      detailOk: 'CPU: Intel(R) Xeon(R) CPU E5-2650 v4 @ 2.20GHz (4核心)',
      detailFail: 'CPU: 负载过高或硬件状态异常'
    }
  }

  const proto = prototypes[id] || {
    ok: true,
    detailOk: '自检通过',
    detailFail: '自检未通过'
  }
  const ok = proto.ok

  return {
    id,
    name,
    category,
    status: ok ? '正常' : '异常',
    tagType: ok ? 'success' : 'danger',
    detail: ok ? proto.detailOk : proto.detailFail,
    abnormalDesc: ok ? '' : proto.detailFail,
    durationMs
  }
}

/** 原型：根据项 ID 生成演示结果 */
export function buildDeviceInspectResults (itemIds) {
  const now = formatDateTime(new Date())
  const items = itemIds.map((id) => buildDeviceInspectItemResult(id))
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
  const order = ['crypto-base', 'sm-algo', 'data-key', 'hardware', 'system-resource']
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

export function describeAutoSchedule (schedule) {
  if (!schedule?.enabled) return '未启用'
  const val = schedule.intervalValue ?? 30
  const unit = INTERVAL_UNIT_LABELS[schedule.intervalUnit] || '小时'
  return `每 ${val} ${unit} 执行一次`
}

/** @deprecated 兼容旧引用 */
export function describeSchedule (schedule) {
  if (schedule?.intervalValue != null) return describeAutoSchedule(schedule)
  if (!schedule?.enabled) return '未启用'
  const t = schedule.time || '02:00'
  if (schedule.scheduleType === 'weekly') {
    const w = WEEK_LABELS[schedule.weekDay ?? 1] || '周一'
    return `每${w} ${t}`
  }
  return `每天 ${t}`
}

export function detectTypeLabel (row) {
  if (!row) return '—'
  if (row.trigger === 'scheduled' || row.triggerLabel === '自动检测' || row.triggerLabel === '定时') {
    return '自动检测'
  }
  return '手动检测'
}

export function overallResultLabel (row) {
  if (!row) return '—'
  return row.overallStatus === '正常' ? '成功' : '失败'
}

export function overallResultClass (row) {
  return overallResultLabel(row) === '成功' ? 'is-on' : 'is-fail'
}

export function filterDeviceHistory (rows, filters = {}) {
  return rows.filter((row) => {
    if (filters.detectType && row.trigger !== filters.detectType) return false
    if (filters.result) {
      const ok = row.overallStatus === '正常'
      if (filters.result === 'success' && !ok) return false
      if (filters.result === 'fail' && ok) return false
    }
    if (filters.dateRange?.length === 2) {
      const ts = new Date(row.finishedAt.replace(/-/g, '/')).getTime()
      const start = new Date(filters.dateRange[0].replace(/-/g, '/')).getTime()
      const end = new Date(filters.dateRange[1].replace(/-/g, '/')).getTime()
      if (Number.isNaN(ts) || ts < start || ts > end) return false
    }
    return true
  })
}

/** 原型：无设备自检记录时写入演示数据 */
export function seedDeviceInspectHistoryIfEmpty () {
  const list = loadInspectHistory()
  if (list.some((h) => h.inspectType === 'device')) return
  const now = Date.now()
  for (let i = 0; i < 26; i++) {
    const d = new Date(now - i * 3600 * 1000 * 4)
    const itemIds = [...ALL_DEVICE_ITEM_IDS]
    const built = buildDeviceInspectResults(itemIds)
    const isManual = i % 3 !== 0
    appendInspectHistory({
      inspectType: 'device',
      trigger: isManual ? 'manual' : 'scheduled',
      triggerLabel: isManual ? '手动检测' : '自动检测',
      scopeMode: 'all',
      scopeItems: itemIds,
      overallStatus: built.failed > 0 ? '异常' : '正常',
      finishedAt: formatDateTime(d),
      itemCount: built.total,
      passedCount: built.passed,
      failedCount: built.failed,
      detailItems: built.items,
      resultCategories: groupDeviceResultsByCategory(built.items),
      summary: {
        total: built.total,
        passed: built.passed,
        warning: 0,
        failed: built.failed,
        time: formatDateTime(d),
        targetLabel: built.targetLabel
      }
    })
  }
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
