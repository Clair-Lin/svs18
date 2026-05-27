const STORAGE_KEY = 'svs_hot_standby_nodes'

/** @typedef {'初始化'|'数据同步中'|'活动'|'异常'} HotStandbyStatus */

export function defaultHotStandbyNodes () {
  return []
}

export function loadHotStandbyNodes () {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultHotStandbyNodes()
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : defaultHotStandbyNodes()
  } catch {
    return defaultHotStandbyNodes()
  }
}

export function persistHotStandbyNodes (nodes) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nodes))
  return nodes
}

export function statusClass (status) {
  const map = {
    初始化: 'is-init',
    数据同步中: 'is-sync',
    活动: 'is-active',
    异常: 'is-error'
  }
  return map[status] || ''
}
