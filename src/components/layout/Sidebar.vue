<template>
  <div class="sidebar" :class="{ collapsed }">
    <el-menu
      class="sidebar-menu"
      :default-active="activeMenu"
      :default-openeds="['sign-service', 'system']"
      :collapse="collapsed"
      :collapse-transition="false"
      router
    >
      <el-menu-item index="/dashboard">
        <el-icon><Monitor /></el-icon>
        <template #title>设备资源</template>
      </el-menu-item>

      <el-menu-item index="/application">
        <el-icon><Grid /></el-icon>
        <template #title>应用管理</template>
      </el-menu-item>

      <el-sub-menu index="sign-service">
        <template #title>
          <el-icon><Edit /></el-icon>
          <span>签名验签服务</span>
        </template>
        <el-menu-item index="/key/manage">
          <template #title>密钥管理<el-tag type="danger" effect="dark" size="small" class="menu-tag">新</el-tag></template>
        </el-menu-item>
        <el-menu-item index="/cert/manage">证书管理</el-menu-item>
        <el-menu-item index="/cert/user">用户证书管理</el-menu-item>
        <el-menu-item index="/cert/ca">CA根证管理</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="system">
        <template #title>
          <el-icon><Tools /></el-icon>
          <span>系统管理</span>
        </template>
        <el-menu-item index="/system/admin">管理员管理</el-menu-item>
        <el-menu-item index="/system/permission">权限管理</el-menu-item>
        <el-menu-item index="/system/info">系统信息</el-menu-item>
        <el-menu-item index="/system/network">网络配置<el-tag type="danger" effect="dark" size="small" class="menu-tag">新</el-tag></el-menu-item>
        <el-menu-item index="/system/service">服务管理</el-menu-item>
        <el-menu-item index="/system/whitelist">白名单配置</el-menu-item>
        <el-menu-item index="/system/ntp">NTP时间源管理</el-menu-item>
        <el-menu-item index="/system/snmp">SNMP管理<el-tag type="danger" effect="dark" size="small" class="menu-tag">新</el-tag></el-menu-item>
        <el-menu-item index="/system/syslog">Syslog配置<el-tag type="danger" effect="dark" size="small" class="menu-tag">新</el-tag></el-menu-item>
        <el-menu-item index="/system/pool">连接池配置</el-menu-item>
        <el-menu-item index="/system/detect">一键检测</el-menu-item>
        <el-menu-item index="/system/config">系统配置<el-tag type="danger" effect="dark" size="small" class="menu-tag">新</el-tag></el-menu-item>
      </el-sub-menu>
    </el-menu>

    <div class="sidebar-footer" @click="$emit('toggle')">
      <el-icon><Fold v-if="!collapsed" /><Expand v-else /></el-icon>
      <span v-show="!collapsed" class="footer-text">收起菜单</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Monitor, Grid, Edit, Tools, Fold, Expand
} from '@element-plus/icons-vue'

defineProps({
  collapsed: Boolean
})

defineEmits(['toggle'])

const route = useRoute()
const activeMenu = computed(() => {
  if (route.path.startsWith('/key/manage')) return '/key/manage'
  if (route.path.startsWith('/application')) return '/application'
  if (route.path.startsWith('/system/config')) return '/system/config'
  if (route.path.startsWith('/system/general')) return '/system/config'
  return route.path
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.sidebar {
  width: $sidebar-width;
  height: 100%;
  background: $sidebar-bg;
  border-right: 1px solid $sidebar-border;
  transition: width $transition-duration;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  &.collapsed {
    width: $sidebar-collapsed-width;

    .sidebar-footer {
      justify-content: center;
      padding: 0;
    }
  }
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  border-right: none !important;
  background: $sidebar-bg !important;
  padding-top: 8px;
}

.menu-tag {
  margin-left: 6px;
}

.sidebar-footer {
  height: 48px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  border-top: 1px solid $sidebar-border;
  cursor: pointer;
  color: $sidebar-text;
  font-size: $font-size-base;
  flex-shrink: 0;
  transition: color $transition-duration, background $transition-duration;

  .el-icon {
    font-size: 18px;
  }

  &:hover {
    color: $sidebar-text-active;
    background: rgba(45, 90, 241, 0.06);
  }
}

.footer-text {
  white-space: nowrap;
}

:deep(.el-menu) {
  --el-menu-bg-color: #{$sidebar-bg};
  --el-menu-text-color: #{$sidebar-text};
  --el-menu-active-color: #{$sidebar-text-active};
  --el-menu-hover-bg-color: rgba(45, 90, 241, 0.06);

  .el-menu-item {
    height: 44px;
    line-height: 44px;
    color: $sidebar-text;

    .el-icon {
      color: $sidebar-text;
    }

    &:hover {
      background-color: rgba(45, 90, 241, 0.06) !important;
      color: $sidebar-text-active;

      .el-icon {
        color: $sidebar-text-active;
      }
    }

    &.is-active {
      background-color: $sidebar-active-bg !important;
      color: $sidebar-text-active !important;
      font-weight: 500;

      .el-icon {
        color: $sidebar-text-active !important;
      }
    }
  }

  .el-sub-menu {
    .el-sub-menu__title {
      height: 44px;
      line-height: 44px;
      color: $sidebar-text;

      .el-icon {
        color: $sidebar-text;
      }

      &:hover {
        background-color: rgba(45, 90, 241, 0.06) !important;
        color: $sidebar-text-active;

        .el-icon {
          color: $sidebar-text-active;
        }
      }
    }

    .el-menu {
      background: $sidebar-bg !important;
    }

    .el-menu-item {
      height: 40px;
      line-height: 40px;
      padding-left: 50px !important;
      background: $sidebar-bg !important;
      min-width: auto;

      &:hover {
        background: rgba(45, 90, 241, 0.06) !important;
      }

      &.is-active {
        background: $sidebar-active-bg !important;
      }
    }
  }
}
</style>
