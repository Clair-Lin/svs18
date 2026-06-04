/** 检测中心：设备自检项、定时策略、执行记录（原型 localStorage） */

const SCHEDULE_KEY = 'svs_inspect_schedule'
const HISTORY_KEY = 'svs_inspect_history'
const MAX_HISTORY = 100

/** @typedef {'sm1'|'sm2'|'sm3'|'sm4'|'rsa'|'des3'|'aes'|'sha'|'hsm-card'|'ntp'|'network'|'disk'|'memory'|'cpu'} DeviceInspectItemId */

export const DEVICE_INSPECT_ITEMS = [
  { id: 'sm1', name: 'SM1算法自检', category: 'sm-algo' },
  { id: 'sm2', name: 'SM2算法自检', category: 'sm-algo' },
  { id: 'sm3', name: 'SM3算法自检', category: 'sm-algo' },
  { id: 'sm4', name: 'SM4算法自检', category: 'sm-algo' },
  { id: 'rsa', name: 'RSA算法自检', category: 'intl-algo' },
  { id: 'des3', name: '3DES算法自检', category: 'intl-algo' },
  { id: 'aes', name: 'AES算法自检', category: 'intl-algo' },
  { id: 'sha', name: 'SHA算法自检', category: 'intl-algo' },
  { id: 'hsm-card', name: '内置密码卡状态自检', category: 'hardware' },
  { id: 'ntp', name: 'NTP', category: 'system-resource' },
  { id: 'network', name: '网络', category: 'system-resource' },
  { id: 'disk', name: '硬盘', category: 'system-resource' },
  { id: 'memory', name: '内存', category: 'system-resource' },
  { id: 'cpu', name: 'CPU', category: 'system-resource' }
]

export const DEVICE_CATEGORY_LABELS = {
  'sm-algo': '国密算法',
  'intl-algo': '国际算法',
  hardware: '硬件',
  'system-resource': '系统资源'
}

export const ALL_DEVICE_ITEM_IDS = DEVICE_INSPECT_ITEMS.map((i) => i.id)

/** 设备自检数据结构版本（变更检测项时需递增并触发迁移） */
const DEVICE_INSPECT_SCHEMA_VERSION = 6
const DEVICE_INSPECT_SCHEMA_KEY = 'svs_device_inspect_schema_v'

const DEVICE_INSPECT_ITEM_PROTOTYPES = {
  sm1: { detailOk: 'SM1 算法自检通过', detailFail: 'SM1 算法自检未通过' },
  sm2: { detailOk: 'SM2 算法自检通过', detailFail: 'SM2 算法自检未通过' },
  sm3: { detailOk: 'SM3 算法自检通过', detailFail: 'SM3 算法自检未通过' },
  sm4: { detailOk: 'SM4 算法自检通过', detailFail: 'SM4 算法自检未通过' },
  rsa: { detailOk: 'RSA 算法自检通过', detailFail: 'RSA 算法自检未通过', failRate: 0.12 },
  des3: { detailOk: '3DES 算法自检通过', detailFail: '3DES 算法自检未通过' },
  aes: { detailOk: 'AES 算法自检通过', detailFail: 'AES 算法自检未通过' },
  sha: { detailOk: 'SHA 算法自检通过', detailFail: 'SHA 算法自检未通过' },
  'hsm-card': {
    detailOk: '内置密码卡状态正常',
    detailFail: '内置密码卡状态异常'
  },
  ntp: { failRate: 0.1 },
  network: {
    detailOk: '网络: ens192 (running)',
    detailFail: '网络: ens192 (down); 请检查网卡或链路',
    failRate: 0.08
  },
  disk: {
    detailOk: '硬盘: 已用 10 GB / 总共 23 GB',
    detailFail: '硬盘: 使用率过高或读写异常',
    failRate: 0.05
  },
  memory: {
    detailOk: '内存: 已用 2777 MB / 总共 3728 MB',
    detailFail: '内存: 已用 3100 MB / 总共 3728 MB'
  },
  cpu: {
    detailOk: 'CPU: Intel(R) Xeon(R) CPU E5-2650 v4 @ 2.20GHz (4核心)',
    detailFail: 'CPU: 负载过高或硬件状态异常'
  }
}

function stableHash (seed) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h) + seed.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

/** 按记录 ID 稳定判定单项是否通过（用于迁移新增项） */
function stableItemOk (recordId, itemId, failRate = 0) {
  if (!failRate) return true
  const bucket = stableHash(`${recordId}:${itemId}`) % 100
  return bucket / 100 > failRate
}

function stableDurationMs (recordId, itemId) {
  return 80 + (stableHash(`${recordId}:${itemId}:dur`) % 120)
}

/** 原型：NTP 时间偏差（秒）；正常 ≤5，异常 >5 */
function resolveNtpDeviationSec (recordId, ok) {
  if (recordId) {
    const h = stableHash(`${recordId}:ntp:offset`)
    return ok ? 1 + (h % 5) : 6 + (h % 25)
  }
  return ok
    ? 1 + Math.floor(Math.random() * 5)
    : 6 + Math.floor(Math.random() * 25)
}

function formatNtpDetail (ok, deviationSec) {
  const offsetText = `设备时间与NTP服务器时间偏差 ${deviationSec} 秒`
  if (ok) return `NTP: 服务运行中，${offsetText}`
  return `NTP: 时间同步异常，${offsetText}`
}

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
  migrateDeviceInspectHistoryIfNeeded()
  return loadInspectHistory().find((h) => h.id === id)
}

export function resolveDeviceScopeItems (scopeMode, scopeItems) {
  if (scopeMode === 'all') return [...ALL_DEVICE_ITEM_IDS]
  const set = new Set(scopeItems.filter((id) => ALL_DEVICE_ITEM_IDS.includes(id)))
  return ALL_DEVICE_ITEM_IDS.filter((id) => set.has(id))
}

function buildDeviceInspectItemResultFromStatus (id, ok, durationMs, recordId = '') {
  const def = DEVICE_INSPECT_ITEMS.find((i) => i.id === id)
  const name = def?.name || id
  const category = def?.category || 'system-resource'
  const proto = DEVICE_INSPECT_ITEM_PROTOTYPES[id] || {
    detailOk: '自检通过',
    detailFail: '自检未通过'
  }

  if (id === 'ntp') {
    const deviationSec = resolveNtpDeviationSec(recordId, ok)
    const detail = formatNtpDetail(ok, deviationSec)
    return {
      id,
      name,
      category,
      status: ok ? '正常' : '异常',
      tagType: ok ? 'success' : 'danger',
      detail,
      abnormalDesc: ok ? '' : detail,
      durationMs
    }
  }

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

/** 原型：单项检测结果 */
function buildDeviceInspectItemResult (id) {
  const proto = DEVICE_INSPECT_ITEM_PROTOTYPES[id] || {}
  const failRate = proto.failRate ?? 0
  const ok = failRate ? Math.random() > failRate : true
  const durationMs = 80 + Math.floor(Math.random() * 120)
  return buildDeviceInspectItemResultFromStatus(id, ok, durationMs)
}

function applyDeviceInspectSummary (record, detailItems) {
  const passed = detailItems.filter((i) => i.status === '正常').length
  const failed = detailItems.length - passed
  const targetLabel =
    record.summary?.targetLabel || record.targetLabel || '本机 192.168.1.100 · 设备自检'
  return {
    ...record,
    scopeMode: record.scopeMode === 'custom' ? record.scopeMode : 'all',
    scopeItems: [...ALL_DEVICE_ITEM_IDS],
    detailItems,
    resultCategories: groupDeviceResultsByCategory(detailItems),
    itemCount: detailItems.length,
    passedCount: passed,
    failedCount: failed,
    overallStatus: failed > 0 ? '异常' : '正常',
    summary: {
      ...(record.summary || {}),
      total: detailItems.length,
      passed,
      warning: 0,
      failed,
      time: record.finishedAt || record.summary?.time,
      targetLabel
    }
  }
}

function migrateDeviceInspectRecord (record) {
  const oldById = new Map()
  for (const item of record.detailItems || []) {
    if (item.id) oldById.set(item.id, item)
    else if (item.name) {
      const def = DEVICE_INSPECT_ITEMS.find((d) => d.name === item.name)
      if (def) oldById.set(def.id, { ...item, id: def.id })
    }
  }

  const detailItems = ALL_DEVICE_ITEM_IDS.map((id) => {
    const old = oldById.get(id)
    const proto = DEVICE_INSPECT_ITEM_PROTOTYPES[id] || {}
    const ok = old
      ? old.status === '正常'
      : stableItemOk(record.id, id, proto.failRate ?? 0)
    const durationMs = old?.durationMs ?? stableDurationMs(record.id, id)
    return buildDeviceInspectItemResultFromStatus(id, ok, durationMs, record.id)
  })

  return applyDeviceInspectSummary(record, detailItems)
}

/** 将 localStorage 中已有设备自检记录迁移到当前检测项与详情文案 */
export function migrateDeviceInspectHistoryIfNeeded () {
  const current = readJson(DEVICE_INSPECT_SCHEMA_KEY, 0)
  if (current >= DEVICE_INSPECT_SCHEMA_VERSION) return false

  const list = loadInspectHistory()
  let changed = false
  const next = list.map((record) => {
    if (record.inspectType !== 'device') return record
    changed = true
    return migrateDeviceInspectRecord(record)
  })

  if (changed) writeJson(HISTORY_KEY, next)
  writeJson(DEVICE_INSPECT_SCHEMA_KEY, DEVICE_INSPECT_SCHEMA_VERSION)
  return changed
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
  const order = ['sm-algo', 'intl-algo', 'hardware', 'system-resource']
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
  migrateDeviceInspectHistoryIfNeeded()
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

/** 生成设备自检报告文本（原型） */
export function buildDeviceInspectReportText (record) {
  if (!record) return ''
  const s = record.summary || {}
  const total = s.total ?? record.itemCount ?? 0
  const passed = s.passed ?? record.passedCount ?? 0
  const failed = s.failed ?? record.failedCount ?? 0
  const warn = s.warning ?? 0
  const target = s.targetLabel || '本机 192.168.1.100 · 设备自检'
  const lines = [
    '设备自检报告',
    '========================================',
    `报告编号：${record.id || '—'}`,
    `自检时间：${record.finishedAt || '—'}`,
    `检测类型：${detectTypeLabel(record)}`,
    `检测结果：${overallResultLabel(record)}`,
    `检测对象：${target}`,
    `检测项总数：${total}    正常：${passed}    警告：${warn}    异常：${failed}`,
    '',
    '检测明细',
    '----------------------------------------'
  ]

  const categories = record.resultCategories?.length
    ? record.resultCategories
    : groupDeviceResultsByCategory(record.detailItems || [])

  let index = 1
  for (const cat of categories) {
    lines.push('')
    lines.push(`【${cat.name}】`)
    for (const item of cat.items || []) {
      lines.push(`${index}. ${item.name}`)
      lines.push(`   状态：${item.label || '—'}`)
      const meta = item.metaLines || []
      if (meta.length) {
        for (const line of meta) {
          lines.push(`   ${line}`)
        }
      } else {
        const raw = (record.detailItems || []).find((d) => d.name === item.name)
        if (raw?.detail) lines.push(`   说明：${raw.detail}`)
        if (raw?.abnormalDesc) lines.push(`   异常说明：${raw.abnormalDesc}`)
      }
      index++
    }
  }

  lines.push('')
  lines.push('----------------------------------------')
  lines.push(`报告生成时间：${formatDateTime(new Date())}`)
  return lines.join('\n')
}

/** 下载设备自检报告（.txt，原型） */
export function downloadDeviceInspectReport (record) {
  const content = buildDeviceInspectReportText(record)
  const blob = new Blob(['\ufeff', content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const timePart = String(record.finishedAt || 'report').replace(/[:\s]/g, '-')
  link.href = url
  link.download = `设备自检报告_${timePart}.txt`
  link.click()
  URL.revokeObjectURL(url)
}
