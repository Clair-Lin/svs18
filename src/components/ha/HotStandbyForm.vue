<template>
  <el-form ref="form" :model="local" label-width="120px" size="small">
    <el-form-item label="启用双机热备" prop="enabled">
      <el-switch v-model="local.enabled" />
      <div v-if="local.enabled" class="hint">启用前请确认主备节点网络、服务、密钥和证书资源已准备完成。</div>
    </el-form-item>

    <el-form-item label="本机角色">
      <el-radio-group v-model="local.role">
        <el-radio label="primary">主机</el-radio>
        <el-radio label="secondary">备机</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="主机 IP" prop="primaryIp">
      <el-input v-model="local.primaryIp" placeholder="IPv4" />
    </el-form-item>

    <el-form-item label="备机 IP" prop="secondaryIp">
      <el-input v-model="local.secondaryIp" placeholder="IPv4" />
    </el-form-item>

    <el-form-item label="服务入口 (VIP)" prop="vip">
      <el-input v-model="local.vip" placeholder="IPv4" />
    </el-form-item>

    <el-form-item label="绑定网卡">
      <el-select v-model="local.bindInterface" placeholder="请选择">
        <el-option label="eth0" value="eth0" />
        <el-option label="eth1" value="eth1" />
        <el-option label="bond0" value="bond0" />
      </el-select>
    </el-form-item>

    <el-form-item label="心跳网卡">
      <el-select v-model="local.heartbeatInterface" placeholder="请选择">
        <el-option label="eth0" value="eth0" />
        <el-option label="eth1" value="eth1" />
        <el-option label="bond0" value="bond0" />
      </el-select>
    </el-form-item>

    <el-form-item label="主备认证密钥">
      <SensitiveInput v-model="local.authKey" :configured="local.authKeyConfigured" />
    </el-form-item>

    <el-form-item label="自动切换">
      <el-switch v-model="local.autoSwitch" />
    </el-form-item>

    <el-form-item label="自动回切">
      <el-switch v-model="local.autoFallback" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, watch, toRefs } from 'vue'
import SensitiveInput from './SensitiveInput.vue'

const props = defineProps({ value: { type: Object, required: true }, disabled: Boolean })
const emit = defineEmits(['update'])

const local = ref(Object.assign({}, props.value))
watch(()=>props.value, v => Object.assign(local.value, v))
watch(local, v => emit('update', v), { deep:true })

function validate(){
  // simple checks (to be extended)
  if(!local.value.primaryIp || !local.value.secondaryIp || !local.value.vip) return false
  if(local.value.primaryIp === local.value.secondaryIp) return false
  return true
}

const form = ref(null)
// expose validate method
const exposed = { validate: () => validate() }
defineExpose(exposed)
</script>

<style scoped>
.hint{ color:var(--el-color-warning); font-size:12px; margin-top:6px }
</style>
