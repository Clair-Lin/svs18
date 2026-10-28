<template>
  <div class="layout-container">
    <Header />

    <div class="layout-body">
      <AuditSidebar v-if="isAudit" :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />
      <Sidebar v-else :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />

      <div class="content-wrapper">
        <el-breadcrumb
          v-if="breadcrumbItems.length && !isAuditHome"
          class="page-breadcrumb"
          separator="/"
        >
          <el-breadcrumb-item
            v-for="(item, index) in breadcrumbItems"
            :key="index"
            :to="item.to"
          >
            {{ item.label }}
          </el-breadcrumb-item>
        </el-breadcrumb>

        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import AuditSidebar from '@/components/layout/AuditSidebar.vue'
import Header from '@/components/layout/Header.vue'
import { breadcrumbItems } from '@/composables/pageBreadcrumb'

const sidebarCollapsed = ref(false)
const route = useRoute()
const isAudit = computed(() => route.path.startsWith('/audit'))
const isAuditHome = computed(() => route.path === '/audit')

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page-breadcrumb {
  margin-bottom: $spacing-md;
  font-size: $font-size-base;

  :deep(.el-breadcrumb__inner) {
    color: $text-secondary;
    font-weight: 400;
  }

  :deep(.el-breadcrumb__inner.is-link:hover) {
    color: $primary-color;
  }

  :deep(.el-breadcrumb__separator) {
    color: $text-muted;
  }

  :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
    color: $text-primary;
  }
}
</style>
