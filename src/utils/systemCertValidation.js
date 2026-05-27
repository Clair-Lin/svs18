const STORAGE_KEY = 'svs_system_cert_validation'

export function defaultSystemCertValidation () {
  return {
    /** 是否启用证书合法性校验 */
    enabled: true
  }
}

export function loadSystemCertValidation () {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSystemCertValidation()
    const data = JSON.parse(raw)
    return {
      ...defaultSystemCertValidation(),
      ...data
    }
  } catch {
    return defaultSystemCertValidation()
  }
}

export function persistSystemCertValidation (data) {
  const payload = {
    enabled: !!data.enabled
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  return payload
}
