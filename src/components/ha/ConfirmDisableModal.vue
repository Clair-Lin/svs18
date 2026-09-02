<template>
  <el-dialog :visible.sync="visible" title="确认停用双机热备？" width="480px">
    <div>
      <p>停用后系统将不再提供主备故障接替能力。若主机异常，业务签名验签服务可能中断。</p>
      <el-checkbox v-model="ack">我已知晓风险</el-checkbox>
    </div>
    <template #footer>
      <el-button @click="visible=false">取消</el-button>
      <el-button type="danger" :disabled="!ack" @click="confirm">确认停用</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
const ack = ref(false)
const emit = defineEmits(['confirm'])
function open(){ ack.value=false; visible.value = true }
function confirm(){ visible.value=false; emit('confirm') }
defineExpose({ open })
</script>
