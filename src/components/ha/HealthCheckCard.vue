<template>
  <el-card>
    <h4>健康检查配置</h4>
    <el-checkbox-group v-model="local.targets">
      <el-checkbox label="connectivity">节点连通性</el-checkbox>
      <el-checkbox label="sign-service">签名验签服务</el-checkbox>
      <el-checkbox label="port">业务端口</el-checkbox>
      <el-checkbox label="password-chain">密码服务调用链路</el-checkbox>
    </el-checkbox-group>

    <el-form label-width="120px" size="small" class="mt-8">
      <el-form-item label="检查周期(秒)">
        <el-input-number v-model="local.interval" :min="1" />
      </el-form-item>
      <el-form-item label="连续失败次数">
        <el-input-number v-model="local.failThreshold" :min="1" />
      </el-form-item>
      <el-form-item label="恢复判定次数">
        <el-input-number v-model="local.recoverThreshold" :min="1" />
      </el-form-item>
      <el-form-item label="异常后动作">
        <el-radio-group v-model="local.onFailure">
          <el-radio label="alert">仅告警</el-radio>
          <el-radio label="auto">自动切换</el-radio>
          <el-radio label="manual">等待人工处理</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ value: { type: Object, default: () => ({ targets:[], interval:5, failThreshold:3, recoverThreshold:3, onFailure:'alert' }) }, disabled: Boolean })
const emit = defineEmits(['update'])
const local = ref(Object.assign({}, props.value))
watch(()=>props.value, v=> Object.assign(local.value, v))
watch(local, v=> emit('update', v), { deep:true })
</script>

<style scoped>
.mt-8{ margin-top:8px }
</style>
