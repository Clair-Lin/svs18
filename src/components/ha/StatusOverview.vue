<template>
  <el-card>
    <div class="status-top">
      <el-tag :type="statusTagType(data.state)">{{ data.state }}</el-tag>
      <div class="role">本机角色：<strong>{{ data.role }}</strong></div>
    </div>

    <el-descriptions column="1" border>
      <el-descriptions-item label="对端状态">{{ data.peerState }}</el-descriptions-item>
      <el-descriptions-item label="当前服务节点">{{ data.currentNode }}</el-descriptions-item>
      <el-descriptions-item label="服务入口"><el-input v-model="data.vip" readonly size="small" /></el-descriptions-item>
      <el-descriptions-item label="最近切换时间">{{ data.lastSwitchTime }}</el-descriptions-item>
      <el-descriptions-item label="最近切换原因">{{ data.lastSwitchReason }}</el-descriptions-item>
      <el-descriptions-item label="最近健康检查">{{ data.lastHealth }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({ data: { type: Object, required: true } })
function statusTagType(state){
  if(!state) return ''
  if(state.includes('正常')) return 'success'
  if(state.includes('未启用')) return ''
  if(state.includes('异常')) return 'danger'
  if(state.includes('切换')) return 'info'
  return ''
}
</script>

<style scoped>
.status-top{ display:flex; align-items:center; gap:12px; margin-bottom:12px }
.role{ color:var(--el-text-color-secondary) }
</style>
