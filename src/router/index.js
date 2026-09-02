import { createRouter, createWebHashHistory } from 'vue-router'
import { applyBreadcrumbFromRoute } from '@/composables/pageBreadcrumb'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  // 监控功能：系统状态、资源与业务统计等统一展示（监控总览页）
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '监控总览',
      breadcrumb: [{ label: '设备资源' }, { label: '监控总览' }]
    }
  },
  {
    path: '/detect',
    redirect: '/system/detect'
  },
  // 应用管理
  // 应用管理 - 根证书配置（从应用列表「根证书配置」进入）
  {
    path: '/application/root-cert-config',
    name: 'ApplicationRootCertConfig',
    component: () => import('@/views/ApplicationRootCertConfig.vue'),
    meta: {
      title: '根证书配置',
      breadcrumb: [{ label: '应用管理', to: '/application' }, { label: '根证书配置' }]
    }
  },
  // 应用管理 - 应用详情（从应用列表「详情」进入）
  {
    path: '/application/detail',
    name: 'ApplicationDetail',
    component: () => import('@/views/ApplicationDetail.vue'),
    meta: {
      title: '应用详情',
      breadcrumb: [{ label: '应用管理', to: '/application' }, { label: '应用详情' }]
    }
  },
  // 应用管理 - 应用证书关联（从应用列表「证书配置」进入）
  {
    path: '/application/cert-link',
    name: 'ApplicationCertLink',
    component: () => import('@/views/ApplicationCertLink.vue'),
    meta: {
      title: '应用证书关联',
      breadcrumb: [{ label: '应用管理', to: '/application' }, { label: '应用证书关联' }]
    }
  },
  {
    path: '/application',
    name: 'Application',
    component: () => import('@/views/Application.vue'),
    meta: { title: '应用管理', breadcrumb: [{ label: '应用管理' }] }
  },
  // 签名验签服务 - 密钥管理：Tab 切换 GM/T 0029-2014（签名验签服务器）与 GM/T 0019-2023（通用密码服务接口）
  {
    path: '/key/manage',
    name: 'KeyManage',
    component: () => import('@/views/key/KeyManage.vue'),
    meta: { title: '密钥管理', dynamicBreadcrumb: true }
  },
  {
    path: '/key/manage/0029',
    redirect: { path: '/key/manage', query: { tab: '0029' } }
  },
  {
    path: '/key/manage/0019',
    redirect: { path: '/key/manage', query: { tab: '0019' } }
  },
  // 签名验签管理 - 应用证书管理（顶栏面包屑由页面 Tab 动态设置）
  {
    path: '/cert/manage',
    name: 'CertManage',
    component: () => import('@/views/cert/CertManage.vue'),
    meta: { title: '应用证书管理', dynamicBreadcrumb: true }
  },
  // 签名验签管理 - 用户证书管理
  {
    path: '/cert/user',
    name: 'UserCert',
    component: () => import('@/views/cert/UserCert.vue'),
    meta: {
      title: '用户证书管理',
      breadcrumb: [{ label: '签名验签管理' }, { label: '用户证书管理' }]
    }
  },
  // 签名验签管理 - CA证书管理
  {
    path: '/cert/ca',
    name: 'CACert',
    component: () => import('@/views/cert/CACert.vue'),
    meta: {
      title: 'CA证书管理',
      breadcrumb: [{ label: '签名验签管理' }, { label: 'CA证书管理' }]
    }
  },
  {
    path: '/cert/ca/chain/:id',
    name: 'CACertChain',
    component: () => import('@/views/cert/CACertChain.vue'),
    meta: {
      title: 'CA-证书链',
      breadcrumb: [
        { label: '签名验签管理' },
        { label: 'CA证书管理', to: '/cert/ca' },
        { label: 'CA-证书链' }
      ]
    }
  },
  // 系统管理 - 服务配置（服务管理 / 连接池配置）
  {
    path: '/system/service-config',
    name: 'SystemServiceConfig',
    component: () => import('@/views/system/SystemServiceConfig.vue'),
    meta: {
      title: '服务配置',
      dynamicBreadcrumb: true
    }
  },
  {
    path: '/system/service',
    redirect: { path: '/system/service-config' }
  },
  {
    path: '/system/pool',
    redirect: { path: '/system/service-config', query: { tab: 'pool' } }
  },
  // 系统管理 - 检测管理（设备自检 / 业务检测）
  {
    path: '/system/status',
    name: 'SystemStatus',
    component: () => import('@/views/system/SystemStatus.vue'),
    meta: {
      title: '检测管理',
      dynamicBreadcrumb: true
    }
  },
  {
    path: '/system/info',
    redirect: { path: '/system/status' }
  },
  {
    path: '/system/inspect',
    redirect: { path: '/system/status', query: { tab: 'service' } }
  },
  {
    path: '/system/detect',
    redirect: { path: '/system/status', query: { tab: 'service' } }
  },
  {
    path: '/system/inspect/device-detail',
    name: 'DeviceInspectDetail',
    component: () => import('@/views/system/inspect/DeviceInspectDetail.vue'),
    meta: {
      title: '设备自检详情',
      dynamicBreadcrumb: true
    }
  },
  // 系统管理 - 系统设置（时间设置 / Syslog配置 / SNMP配置）
  {
    path: '/system/settings',
    name: 'SystemSettings',
    component: () => import('@/views/system/SystemSettings.vue'),
    meta: {
      title: '系统设置',
      dynamicBreadcrumb: true
    }
  },
  {
    path: '/system/ntp',
    redirect: { path: '/system/settings' }
  },
  {
    path: '/system/syslog',
    redirect: { path: '/system/settings', query: { tab: 'syslog' } }
  },
  {
    path: '/system/snmp',
    redirect: { path: '/system/settings', query: { tab: 'snmp' } }
  },
  // 系统管理 - 高级设置（白名单配置 / 接口鉴权 / 证书校验）
  {
    path: '/system/advanced',
    name: 'SystemAdvanced',
    component: () => import('@/views/system/SystemAdvanced.vue'),
    meta: {
      title: '高级设置',
      dynamicBreadcrumb: true
    }
  },
  {
    path: '/system/config',
    redirect: { path: '/system/advanced' }
  },
  {
    path: '/system/general/api-auth',
    redirect: { path: '/system/advanced', query: { tab: 'api-auth' } }
  },
  {
    path: '/system/general/cert-validation',
    redirect: { path: '/system/advanced', query: { tab: 'cert-validation' } }
  },
  {
    path: '/system/admin',
    name: 'AdminManage',
    component: () => import('@/views/system/AdminManage.vue'),
    meta: {
      title: '管理员管理',
      breadcrumb: [{ label: '系统管理' }, { label: '管理员管理' }]
    }
  },
  {
    path: '/system/permission',
    name: 'Permission',
    component: () => import('@/views/system/Permission.vue'),
    meta: {
      title: '权限管理',
      breadcrumb: [{ label: '系统管理' }, { label: '权限管理' }]
    }
  },
  // 网络管理 - 网口管理（网口/子网口/聚合/VLAN）
  {
    path: '/network/interface',
    name: 'NetworkInterface',
    component: () => import('@/views/system/NetworkConfig.vue'),
    meta: {
      title: '网口管理',
      dynamicBreadcrumb: true
    }
  },
  {
    path: '/network/route',
    name: 'NetworkRoute',
    component: () => import('@/views/network/RouteConfig.vue'),
    meta: {
      title: '路由配置',
      breadcrumb: [{ label: '网络管理' }, { label: '路由配置' }]
    }
  },
  {
    path: '/system/network',
    redirect: '/network/interface'
  },
  {
    path: '/system/ha',
    name: 'HaManage',
    component: () => import('@/views/system/HaManage.vue'),
    meta: {
      title: '高可用配置',
      dynamicBreadcrumb: true
    }
  },
  {
    path: '/system/hot-standby',
    redirect: { path: '/system/ha', query: { tab: 'hot-standby' } }
  },
  {
    path: '/system/cluster',
    redirect: { path: '/system/ha', query: { tab: 'cluster' } }
  },
  {
    path: '/system/inspect/device-detail',
    name: 'DeviceInspectDetail',
    component: () => import('@/views/system/inspect/DeviceInspectDetail.vue'),
    meta: {
      title: '设备自检详情',
      dynamicBreadcrumb: true
    }
  },
  {
    path: '/system/detect',
    redirect: { path: '/system/status', query: { tab: 'service' } }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.afterEach((to) => {
  applyBreadcrumbFromRoute(to)
})

export default router
