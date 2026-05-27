const STORAGE_KEY = 'svs_network_routes'

export function defaultRoutes () {
  return [
    {
      id: 'sys-1',
      ipType: 'ipv4',
      routeType: '系统路由',
      destination: '0.0.0.0',
      netmask: '0.0.0.0',
      gateway: '192.168.137.1',
      interface: 'ens192',
      status: '启用',
      isSystem: true
    },
    {
      id: 'sys-2',
      ipType: 'ipv4',
      routeType: '系统路由',
      destination: '192.168.137.0',
      netmask: '255.255.255.0',
      gateway: '0.0.0.0',
      interface: 'ens192',
      status: '启用',
      isSystem: true
    }
  ]
}

export function loadNetworkRoutes () {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultRoutes()
    const data = JSON.parse(raw)
    return Array.isArray(data) && data.length ? data : defaultRoutes()
  } catch {
    return defaultRoutes()
  }
}

export function persistNetworkRoutes (routes) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(routes))
  return routes
}
