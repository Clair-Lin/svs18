const STORAGE_KEY = 'svs_system_general_api_auth'

export function defaultSystemApiAuth () {
  return {
    /** 系统级：是否启用开放接口 HMAC 鉴权能力 */
    globalEnabled: true,
    method: 'HMAC-SM3',
    /** 新建应用时默认请求有效期（分钟） */
    defaultRequestTtlMinutes: 5
  }
}

export function loadSystemApiAuth () {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSystemApiAuth()
    const data = JSON.parse(raw)
    return {
      ...defaultSystemApiAuth(),
      ...data,
      method: 'HMAC-SM3',
      defaultRequestTtlMinutes: data.defaultRequestTtlMinutes ?? 5
    }
  } catch {
    return defaultSystemApiAuth()
  }
}

export function persistSystemApiAuth (data) {
  const payload = {
    globalEnabled: !!data.globalEnabled,
    method: 'HMAC-SM3',
    defaultRequestTtlMinutes: data.defaultRequestTtlMinutes ?? 5
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  return payload
}
