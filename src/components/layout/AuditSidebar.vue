<template>
  <div class="sidebar" :class="{ collapsed }">
    <el-menu class="sidebar-menu" :default-active="activeMenu" :default-openeds="['logs', 'system']" :collapse="collapsed" :collapse-transition="false" router>
      <el-sub-menu index="logs">
        <template #title><el-icon><Document /></el-icon><span>日志管理</span></template>
        <el-menu-item index="/audit/compute-log">运算日志</el-menu-item>
        <el-menu-item index="/audit/admin-log">管理员操作日志</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="system">
        <template #title><el-icon><Tools /></el-icon><span>系统管理</span></template>
        <el-menu-item index="/system/admin">管理员管理</el-menu-item>
        <el-menu-item index="/system/permission">权限管理</el-menu-item>
      </el-sub-menu>
    </el-menu>
    <div class="sidebar-footer" @click="$emit('toggle')"><el-icon><Fold v-if="!collapsed" /><Expand v-else /></el-icon><span v-show="!collapsed" class="footer-text">收起菜单</span></div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Document, Tools, Fold, Expand } from '@element-plus/icons-vue'
defineProps({ collapsed: Boolean })
defineEmits(['toggle'])
const route = useRoute()
const activeMenu = computed(() => {
  if (route.path.startsWith('/audit/compute-log')) return '/audit/compute-log'
  if (route.path.startsWith('/audit/admin-log')) return '/audit/admin-log'
  if (route.path.startsWith('/system/permission')) return '/system/permission'
  if (route.path.startsWith('/system/admin')) return '/system/admin'
  return ''
})
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.sidebar { width: $sidebar-width; height: 100%; background: $sidebar-bg; border-right: 1px solid $sidebar-border; transition: width $transition-duration; overflow: hidden; display: flex; flex-direction: column; flex-shrink: 0; }
.sidebar.collapsed { width: $sidebar-collapsed-width; }.sidebar-menu { flex: 1; overflow-y: auto; overflow-x: hidden; border-right: none !important; background: $sidebar-bg !important; padding-top: 8px; }.sidebar-footer { height: 48px; display: flex; align-items: center; gap: 8px; padding: 0 20px; border-top: 1px solid $sidebar-border; cursor: pointer; color: $sidebar-text; font-size: $font-size-base; flex-shrink: 0; }.sidebar.collapsed .sidebar-footer { justify-content: center; padding: 0; }.footer-text { white-space: nowrap; }
:deep(.el-menu) { --el-menu-bg-color: #{$sidebar-bg}; --el-menu-text-color: #{$sidebar-text}; --el-menu-active-color: #{$sidebar-text-active}; --el-menu-hover-bg-color: rgba(45, 90, 241, 0.06); }.sidebar :deep(.el-menu-item) { height: 44px; line-height: 44px; color: $sidebar-text; }.sidebar :deep(.el-sub-menu__title) { height: 44px; line-height: 44px; color: $sidebar-text; }.sidebar :deep(.el-menu-item:hover), .sidebar :deep(.el-sub-menu__title:hover) { background-color: rgba(45, 90, 241, 0.06) !important; color: $sidebar-text-active; }.sidebar :deep(.el-menu-item.is-active) { background-color: $sidebar-active-bg !important; color: $sidebar-text-active !important; font-weight: 500; }.sidebar :deep(.el-menu .el-menu) { background: $sidebar-bg !important; }.sidebar :deep(.el-sub-menu .el-menu-item) { height: 40px; line-height: 40px; padding-left: 50px !important; background: $sidebar-bg !important; min-width: auto; }.sidebar :deep(.el-sub-menu .el-menu-item:hover), .sidebar :deep(.el-sub-menu .el-menu-item.is-active) { background: $sidebar-active-bg !important; }
</style>