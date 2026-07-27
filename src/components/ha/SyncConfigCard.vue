<template>
  <el-card>
    <h4>同步范围配置</h4>
    <el-table :data="items" size="small" style="width:100%">
      <el-table-column prop="name" label="同步项" />
      <el-table-column label="勾选" width="80">
        <template #default="{row}">
          <el-checkbox v-model="row.checked" :disabled="row.highRisk && !row.confirmed" />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="160">
        <template #default="{row}">
          <div>{{ row.lastSync || '-' }} / {{ row.lastResult || '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template #default="{row}">
          <el-button size="small" @click="manualSync(row)" :disabled="disabled">手动同步</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ value: { type: Object, default: () => ({ items:[] }) }, disabled: Boolean })
const emit = defineEmits(['update'])
const local = ref({ items: props.value.items || [
  { name:'服务配置', checked:true },
  { name:'应用配置', checked:true },
  { name:'IP 白名单', checked:false },
  { name:'证书链', checked:false },
  { name:'验证策略', checked:false },
  { name:'密钥资源', checked:false, highRisk:true, confirmed:false }
] })
watch(()=>props.value, v=> { if(v && v.items) local.value.items = v.items })
watch(local, v=> emit('update', v), { deep:true })

function manualSync(row){
  if(row.highRisk && !row.confirmed){
    return this.$message.warning('高风险项需先确认')
  }
  // emit sync request
  emit('update', local.value)
}
</script>

<style scoped>
h4{ margin:0 0 12px 0 }
</style>
