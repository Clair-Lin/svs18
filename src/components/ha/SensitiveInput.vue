<template>
  <div class="sensitive-input">
    <el-input :type="visible? 'text':'password'" v-model="local" size="small" placeholder="未配置时为空" :disabled="configured" />
    <el-button type="text" size="small" @click="reset" v-if="configured">重置</el-button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ modelValue: String, configured: Boolean })
const emit = defineEmits(['update:modelValue'])
const local = ref(props.modelValue || '')
const visible = ref(false)
watch(()=>props.modelValue, v=> local.value = v)
function reset(){ emit('update:modelValue', ''); }
watch(local, v=> emit('update:modelValue', v))
</script>

<style scoped>
.sensitive-input{ display:flex; align-items:center; gap:8px }
</style>
