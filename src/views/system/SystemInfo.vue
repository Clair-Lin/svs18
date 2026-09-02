<template>
  <div class="system-info">
    <div class="page-card">
      <div class="card-title">系统信息</div>

      <div class="info-body">
        <div class="info-row">
          <span class="info-label">设备名称：</span>
          <span class="info-value">{{ deviceName }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">软件版本信息：</span>
          <span class="info-value">{{ softwareVersion }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const deviceName = '签名验签服务器'
const softwareVersion = '1.9.1'
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.system-info {
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 24px;
  }

  .info-body {
    padding: 8px 0;
  }

  .info-row {
    display: flex;
    align-items: flex-start;
    padding: 12px 0;
    font-size: 14px;
    line-height: 22px;
  }

  .info-label {
    flex-shrink: 0;
    color: $text-primary;
  }

  .info-value {
    color: $text-primary;
  }
}
</style>
