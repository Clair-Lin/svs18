<template>
  <div class="pool-config">
    <div class="page-card">
      <div class="card-title">连接池配置</div>

      <div class="pool-setting-row">
        <span class="pool-label">密码运算连接池：</span>
        <el-input
          v-model="poolSizeInput"
          class="pool-input"
          placeholder="请输入"
          maxlength="6"
          @input="onPoolSizeInput"
        />
        <el-button type="primary" :loading="saving" @click="handleModify">修改</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const STORAGE_KEY = 'svs_pool_crypto_size'

const poolSize = ref(5)
const poolSizeInput = ref('5')
const saving = ref(false)

function onPoolSizeInput (val) {
  poolSizeInput.value = String(val ?? '').replace(/\D/g, '')
}

function loadPoolSize () {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw != null && raw !== '') {
      const n = parseInt(raw, 10)
      if (!Number.isNaN(n) && n > 0) {
        poolSize.value = n
        poolSizeInput.value = String(n)
        return
      }
    }
  } catch {
    /* ignore */
  }
  poolSizeInput.value = String(poolSize.value)
}

onMounted(loadPoolSize)

function handleModify () {
  const n = parseInt(poolSizeInput.value, 10)
  if (!poolSizeInput.value.trim() || Number.isNaN(n) || n < 1) {
    ElMessage.warning('请输入有效的连接池数量（正整数）')
    return
  }
  if (n > 9999) {
    ElMessage.warning('连接池数量不能超过 9999')
    return
  }
  saving.value = true
  setTimeout(() => {
    poolSize.value = n
    poolSizeInput.value = String(n)
    sessionStorage.setItem(STORAGE_KEY, String(n))
    saving.value = false
    ElMessage.success('连接池配置已修改（原型演示）')
  }, 300)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.pool-config {
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 20px;
  }

  .pool-setting-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .pool-label {
    font-size: 14px;
    color: $text-primary;
    white-space: nowrap;
  }

  .pool-input {
    width: 120px;

    :deep(.el-input__inner) {
      text-align: left;
    }
  }
}
</style>
