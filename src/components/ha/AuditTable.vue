<template>
  <el-card>
    <div class="table-actions">
      <el-date-picker v-model="range" type="daterange" size="small" />
      <el-select v-model="filter.type" placeholder="类型" clearable size="small">
        <el-option label="自动切换" value="auto" />
        <el-option label="手工切换" value="manual" />
        <el-option label="同步失败" value="sync-fail" />
      </el-select>
      <el-button size="small" @click="load">筛选</el-button>
    </div>

    <el-table :data="rows" size="small" style="width:100%">
      <el-table-column prop="time" label="时间" width="180" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="from" label="原主机" width="120" />
      <el-table-column prop="to" label="新主机" width="120" />
      <el-table-column prop="reason" label="触发原因" />
      <el-table-column prop="result" label="执行结果" width="100" />
      <el-table-column prop="operator" label="操作人" width="120" />
      <el-table-column label="操作" width="120">
        <template #default="{row}">
          <el-button type="text" size="small" @click="viewDetail(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
const range = ref(null)
const filter = ref({ type: '' })
const rows = ref([])

function load(){
  // load audit logs (stub)
  rows.value = [
    { time:'2026-07-27 10:00', type:'手工切换', from:'10.0.0.1', to:'10.0.0.2', reason:'测试', result:'成功', operator:'admin' }
  ]
}

function viewDetail(row){
  // show detail modal or drawer
  console.log('view', row)
}

load()
</script>

<style scoped>
.table-actions{ display:flex; gap:8px; align-items:center; margin-bottom:12px }
</style>
