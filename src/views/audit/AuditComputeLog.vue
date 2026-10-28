<template>
  <section class="log-page">
    <div class="page-title">运算日志</div>
    <div class="filter-card">
      <div class="filter-item"><span>运算类型</span><el-select v-model="filters.type" placeholder="请选择运算类型" clearable><el-option label="签名" value="sign" /><el-option label="验签" value="verify" /></el-select></div>
      <div class="filter-item"><span>算法</span><el-select v-model="filters.algorithm" placeholder="请选择算法" clearable><el-option label="SM2" value="sm2" /><el-option label="RSA" value="rsa" /></el-select></div>
      <div class="filter-item"><span>状态</span><el-select v-model="filters.status" placeholder="请选择状态" clearable><el-option label="成功" value="success" /><el-option label="失败" value="failed" /></el-select></div>
      <div class="filter-item keyword"><span>关键词</span><el-input v-model="filters.keyword" placeholder="请输入关键词" clearable /></div>
      <el-button type="primary" @click="search">查询</el-button><el-button @click="reset">重置</el-button>
    </div>
    <div class="table-card">
      <el-button type="primary" @click="exportLogs">导出日志</el-button>
      <el-table :data="rows" class="log-table" empty-text="暂无数据">
        <el-table-column prop="time" label="时间" min-width="170" />
        <el-table-column prop="type" label="运算类型" min-width="170" />
        <el-table-column prop="algorithm" label="算法" min-width="170" />
        <el-table-column prop="keyIndex" min-width="170"><template #header><span>密钥</span><el-tooltip content="0019显示密钥容器名，0029显示密钥索引" placement="top"><el-icon class="header-help"><QuestionFilled /></el-icon></el-tooltip></template></el-table-column>
        <el-table-column prop="status" label="结果" min-width="150" />
        <el-table-column prop="clientIp" label="操作IP" min-width="180" />
      </el-table>
    </div>
  </section>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
const filters = reactive({ type: '', algorithm: '', status: '', keyword: '' })
const rows = ref([
  { time: '2026-09-22 15:12:08', type: '签名', algorithm: 'SM2', keyIndex: 'key-001', status: '成功', clientIp: '192.168.1.20' },
  { time: '2026-09-22 15:11:52', type: '验签', algorithm: 'SM2', keyIndex: 'key-001', status: '成功', clientIp: '192.168.1.20' },
  { time: '2026-09-22 15:10:31', type: '签名', algorithm: 'SM3', keyIndex: 'key-002', status: '成功', clientIp: '192.168.1.31' },
  { time: '2026-09-22 15:08:16', type: '验签', algorithm: 'RSA', keyIndex: 'key-006', status: '失败', clientIp: '10.10.8.6' },
  { time: '2026-09-22 15:06:44', type: '签名', algorithm: 'SM2', keyIndex: 'key-001', status: '成功', clientIp: '192.168.1.20' },
  { time: '2026-09-22 15:04:03', type: '验签', algorithm: 'SM2', keyIndex: 'key-003', status: '成功', clientIp: '192.168.1.42' },
  { time: '2026-09-22 14:58:37', type: '签名', algorithm: 'RSA', keyIndex: 'key-006', status: '成功', clientIp: '10.10.8.21' },
  { time: '2026-09-22 14:55:19', type: '验签', algorithm: 'SM3', keyIndex: 'key-002', status: '成功', clientIp: '192.168.1.31' },
  { time: '2026-09-22 14:51:02', type: '签名', algorithm: 'SM2', keyIndex: 'key-004', status: '失败', clientIp: '192.168.1.56' },
  { time: '2026-09-22 14:46:28', type: '验签', algorithm: 'SM2', keyIndex: 'key-001', status: '成功', clientIp: '192.168.1.20' },
])
const search = () => {}
const reset = () => { Object.assign(filters, { type: '', algorithm: '', status: '', keyword: '' }) }
const exportLogs = () => ElMessage.info('暂无可导出的运算日志')
</script>
<style scoped>
.log-page { min-height: 100%; }.page-title { font-size: 28px; line-height: 40px; color: #1f2937; margin: 6px 0 18px; }.filter-card, .table-card { background: #fff; box-shadow: 0 2px 9px rgba(31,35,41,.08); padding: 18px 24px; }.filter-card { display:flex; align-items:center; gap:22px; flex-wrap:wrap; }.filter-item { display:flex; align-items:center; gap:12px; color:#1f2937; white-space:nowrap; }.filter-item :deep(.el-select) { width:252px; }.filter-item.keyword :deep(.el-input) { width:250px; }.filter-card > .el-button { min-width:88px; height:36px; }.table-card { margin-top:16px; padding-top:28px; }.log-table { margin-top:16px; width:100%; }.log-table :deep(th.el-table__cell) { background:#f5f6fa; color:#86909c; font-weight:400; }.log-table :deep(.el-table__empty-text) { color:#9aa1aa; }.header-help { margin-left: 4px; color: #86909c; cursor: help; font-size: 14px; vertical-align: middle; }
@media (max-width: 1100px) { .filter-item :deep(.el-select), .filter-item.keyword :deep(.el-input) { width:200px; } }
</style>