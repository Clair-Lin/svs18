<template>
  <div class="app-detail">
    <header class="app-detail__head">
      <div class="app-detail__nav">
        <el-button link type="primary" class="app-detail__back" @click="goApplicationList">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <span class="app-detail__nav-hint">应用详情</span>
      </div>
      <h2 class="app-detail__title">应用详情</h2>
      <p class="app-detail__meta">
        当前应用：<strong>{{ appName }}</strong>（ID：{{ appId }}）
      </p>
    </header>

    <div class="page-card app-detail__panel">
      <div class="section-head">
        <span class="section-bar" />
        <span class="section-title">基本信息</span>
      </div>
      <el-descriptions :column="2" border class="basic-desc">
        <el-descriptions-item label="应用名称">{{ appName }}</el-descriptions-item>
        <el-descriptions-item label="应用 ID">{{ appId }}</el-descriptions-item>
        <el-descriptions-item label="应用状态">
          <el-tag :type="appStatus === '启用' ? 'success' : 'info'" size="small">{{ appStatus }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ createTime || '—' }}</el-descriptions-item>
      </el-descriptions>
      <p class="detail-tip">
        接入凭证请通过应用列表「凭证」查看；接口鉴权策略请在
        <router-link to="/system/config" class="detail-tip__link">系统管理 → 系统配置 → 接口鉴权</router-link>
        中配置。
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setPageBreadcrumbItems } from '@/composables/pageBreadcrumb'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const appId = computed(() => String(route.query.appId || '').trim())
const appName = computed(() => String(route.query.name || '').trim() || '未命名应用')
const appStatus = computed(() => String(route.query.status || '启用'))
const createTime = computed(() => String(route.query.createTime || ''))

watchEffect(() => {
  setPageBreadcrumbItems([
    { label: '应用管理', to: '/application' },
    { label: '应用详情' }
  ])
})

onMounted(() => {
  if (!appId.value) {
    ElMessage.warning('缺少应用 ID，请从应用管理进入')
  }
})

function goApplicationList () {
  router.push('/application')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.app-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.app-detail__head {
  .app-detail__nav {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .app-detail__back {
    padding-left: 0;
    font-size: 13px;
  }

  .app-detail__nav-hint {
    font-size: 13px;
    color: $text-secondary;
  }

  .app-detail__title {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: 600;
    color: $text-primary;
  }

  .app-detail__meta {
    margin: 0;
    font-size: 13px;
    color: $text-secondary;

    strong {
      color: $text-primary;
      font-weight: 500;
    }
  }
}

.app-detail__panel {
  padding: 20px 24px;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-bar {
  width: 3px;
  height: 16px;
  background: $primary-color;
  border-radius: 2px;
  flex-shrink: 0;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: $text-primary;
}

.basic-desc {
  max-width: 900px;
}

.detail-tip {
  margin: 16px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: $text-secondary;

  &__link {
    color: $primary-color;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
