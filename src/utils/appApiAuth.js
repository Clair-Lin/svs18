import { loadSystemApiAuth } from '@/utils/systemApiAuth'

const STORAGE_PREFIX = 'svs_app_api_auth_'
const AUDIT_LOG_KEY = 'svs_audit_log'

export function randomHex (len = 32) {
  const chars = '0123456789abcdef'
  let s = ''
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * 16)]
  return s
}

export function genAppSecret () {
  return randomHex(32)
}

export function maskSecret (secret) {
  if (!secret) return '—'
  if (secret.length <= 8) return '********'
  return `${secret.slice(0, 4)}${'*'.repeat(12)}${secret.slice(-4)}`
}

export function createInitialApiAuth (appId, overrides = {}) {
  const sys = loadSystemApiAuth()
  return {
    method: 'HMAC-SM3',
    secret: genAppSecret(),
    requestTtlMinutes: sys.defaultRequestTtlMinutes ?? 5,
    allowedScopes: ['签名', '验签'],
    authStatus: '停用',
    ...overrides
  }
}



export function loadApiAuth (appId) {
  if (!appId) return null
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + appId)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/** 持久化时去掉已废弃的 accessKey 字段 */
export function persistApiAuth (appId, data) {
  if (!appId) return
  const { accessKey: _removed, enabled: _enabled, ...rest } = data || {}
  const payload = {
    ...rest,
    method: 'HMAC-SM3',
    allowedScopes: (rest.allowedScopes || []).filter((s) => s === '签名' || s === '验签')
  }
  sessionStorage.setItem(STORAGE_PREFIX + appId, JSON.stringify(payload))
}

/** 创建应用时写入接口鉴权（应用 ID 即调用方标识，仅自动生成应用密钥） */
export function initApiAuthForApp (appId, overrides = {}) {
  const existing = loadApiAuth(appId)
  if (existing?.secret) {
    persistApiAuth(appId, normalizeApiAuth(appId, existing))
    return normalizeApiAuth(appId, existing)
  }
  const initial = createInitialApiAuth(appId, overrides)
  persistApiAuth(appId, initial)
  return initial
}

/** 兼容旧版 enabled、accessKey；补全缺失密钥 */
export function normalizeApiAuth (appId, raw) {
  const sys = loadSystemApiAuth()
  const data = raw ? { ...raw } : createInitialApiAuth(appId)
  delete data.accessKey
  if (data.authStatus !== '启用' && data.authStatus !== '停用') {
    data.authStatus = data.enabled === true ? '启用' : '停用'
  }
  delete data.enabled
  if (!data.secret) data.secret = genAppSecret()
  data.allowedScopes = (Array.isArray(data.allowedScopes) ? data.allowedScopes : ['签名', '验签'])
    .filter((s) => s === '签名' || s === '验签')
  data.method = 'HMAC-SM3'
  data.requestTtlMinutes = data.requestTtlMinutes ?? sys.defaultRequestTtlMinutes ?? 5
  return data
}

/** 原型：重置应用密钥审计日志 */
export function recordApiAuthAudit ({ appId, appName, action, detail }) {
  const entry = {
    time: new Date().toISOString(),
    module: '应用管理',
    action,
    appId,
    appName: appName || '',
    detail,
    operator: '当前管理员（原型）'
  }
  let list = []
  try {
    const raw = sessionStorage.getItem(AUDIT_LOG_KEY)
    if (raw) list = JSON.parse(raw)
  } catch {
    list = []
  }
  list.unshift(entry)
  sessionStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(list.slice(0, 200)))
  return entry
}


