<template>
  <el-dialog :visible.sync="visible" title="确认手工切换？" width="520px">
    <div>
      <p>当前服务将从“{{data.from}}”切换到“{{data.to}}”。切换过程中业务连接可能短暂中断。</p>
      <el-descriptions column="1" border>
        <el-descriptions-item label="当前主机">{{data.from}}</el-descriptions-item>
        <el-descriptions-item label="目标主机">{{data.to}}</el-descriptions-item>
        <el-descriptions-item label="服务入口">{{data.vip}}</el-descriptions-item>
        <el-descriptions-item label="最近健康检查">{{data.health}}</el-descriptions-item>
      </el-descriptions>

      <el-input v-model="confirmText" placeholder='请输入“确认切换”' />
    </div>
    <template #footer>
      <el-button @click="visible=false">取消</el-button>
      <el-button type="primary" :disabled="confirmText!=='确认切换'" @click="confirm">确认切换</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
const data = ref({ from:'', to:'', vip:'', health:'' })
const confirmText = ref('')
const emit = defineEmits(['confirm'])
function open(d){ Object.assign(data.value, d); confirmText.value=''; visible.value = true }
function confirm(){ visible.value=false; emit('confirm', data.value) }
defineExpose({ open })
</script>
