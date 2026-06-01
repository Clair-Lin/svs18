<template>
  <div class="header">
    <div class="header-left">
      <div class="logo-wrap">
        <div class="logo-icon">
          <span class="logo-shape shape-1" />
          <span class="logo-shape shape-2" />
          <span class="logo-shape shape-3" />
        </div>
      </div>
      <span class="system-title">签名验签服务器</span>
      <span class="system-version">1.9.0</span>
    </div>

    <div class="header-right">
      <div class="fullscreen-btn" @click="toggleFullscreen">
        <el-icon><FullScreen /></el-icon>
        <span>全屏</span>
      </div>
      <el-dropdown trigger="click">
        <div class="user-info">
          <el-avatar :size="28" class="user-avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
          <span class="username">sys_admin</span>
          <el-icon class="arrow-icon"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-icon><User /></el-icon>
              个人信息
            </el-dropdown-item>
            <el-dropdown-item>
              <el-icon><Lock /></el-icon>
              修改密码
            </el-dropdown-item>
            <el-dropdown-item divided>
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { FullScreen, User, ArrowDown, Lock, SwitchButton } from '@element-plus/icons-vue'

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.header {
  height: $header-height;
  background: $header-bg;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.logo-wrap {
  flex-shrink: 0;
}

.logo-icon {
  position: relative;
  width: 28px;
  height: 28px;
}

.logo-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);

  &.shape-1 {
    width: 14px;
    height: 14px;
    top: 2px;
    left: 0;
    opacity: 0.95;
  }

  &.shape-2 {
    width: 12px;
    height: 12px;
    top: 8px;
    left: 10px;
    opacity: 0.75;
  }

  &.shape-3 {
    width: 10px;
    height: 10px;
    top: 14px;
    left: 4px;
    opacity: 0.6;
  }
}

.system-title {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-white;
  white-space: nowrap;
}

.system-version {
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.75);
  margin-left: 2px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.fullscreen-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: $text-white;
  font-size: $font-size-base;
  padding: 4px 8px;
  border-radius: $border-radius;
  transition: background $transition-duration;

  .el-icon {
    font-size: 16px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: $border-radius;
  transition: background $transition-duration;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
}

.user-avatar {
  background: rgba(255, 255, 255, 0.25);
  color: $text-white;
}

.username {
  color: $text-white;
  font-size: $font-size-base;
}

.arrow-icon {
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
}
</style>
