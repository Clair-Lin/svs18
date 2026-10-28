<template>
  <section class="log-page">
    <div class="page-title">管理员操作日志</div>
    <div class="filter-card admin-filter">
      <div class="filter-item"><span>操作人</span><el-input v-model="filters.operator" placeholder="请输入操作人" clearable /></div>
      <div class="filter-item"><span>业务类型</span><el-input v-model="filters.business" placeholder="请输入业务类型" clearable /></div>
      <div class="filter-item"><span>日志内容</span><el-input v-model="filters.content" placeholder="请输入日志内容" clearable /></div>
      <div class="filter-item time-item"><span>操作时间</span><el-date-picker v-model="filters.time" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" /></div>
      <el-button type="primary" @click="search">查询</el-button><el-button @click="reset">重置</el-button><el-button link type="primary">展开⌄</el-button>
    </div>
    <div class="table-card">
      <div class="toolbar"><el-button type="primary" :disabled="!selected.length">批量审计</el-button><el-button plain @click="exportLogs">导出</el-button></div>
      <el-table :data="rows" class="log-table" @selection-change="selected = $event">
        <el-table-column type="selection" width="62" /><el-table-column prop="business" label="业务类型" min-width="160" /><el-table-column prop="content" label="日志内容" min-width="300" /><el-table-column prop="tag" label="日志标签" min-width="120" /><el-table-column prop="result" label="执行结果" min-width="120" /><el-table-column prop="duration" label="执行时长(ms)" min-width="135" /><el-table-column prop="operator" label="操作人" min-width="130" /><el-table-column prop="audit" label="审计状态" min-width="120"><template #default="{ row }"><span class="audit-status"><i />{{ row.audit }}</span></template></el-table-column><el-table-column prop="time" label="操作时间" min-width="180" /><el-table-column label="操作" width="100" fixed="right"><template #default><el-button link type="primary">详情</el-button><el-button link type="primary">审计</el-button></template></el-table-column>
      </el-table>
      <div class="pagination"><span>共 {{ rows.length ? 9174 : 0 }} 条</span><el-pagination v-model:current-page="page" background layout="prev, pager, next, sizes" :page-size="10" :total="rows.length ? 9174 : 0" /></div>
    </div>
  </section>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
const filters = reactive({ operator: '', business: '', content: '', time: [] })
const selected = ref([]); const page = ref(1)
const rows = ref([
  { business: '密码机日志列表查询', content: '查询密码机日志列表', tag: 'query', result: '成功', duration: 0, operator: 'audit_admin', audit: '未审计', time: '2026-09-22 15:11:25' },
  { business: '获取平台信息', content: '获取平台信息', tag: 'query', result: '成功', duration: 0, operator: 'audit_admin', audit: '未审计', time: '2026-09-22 15:11:22' },
  { business: '查询字典数据列表', content: '分页查询字典数据列表', tag: 'query', result: '成功', duration: 6, operator: 'audit_admin', audit: '未审计', time: '2026-09-22 15:11:22' },
  { business: '管理员获取权限', content: '管理员获取权限，管理员账号：audit_admin', tag: 'query', result: '成功', duration: 4, operator: 'audit_admin', audit: '未审计', time: '2026-09-22 15:11:22' },
  { business: '获取系统设置列表', content: '获取系统设置列表', tag: 'query', result: '成功', duration: 3, operator: 'audit_admin', audit: '未审计', time: '2026-09-22 15:11:22' },
  { business: '登录账号', content: '管理员 audit_admin 登录了系统', tag: 'login', result: '成功', duration: 4, operator: 'audit_admin', audit: '未审计', time: '2026-09-22 15:11:21' },
  { business: '登录账号', content: '管理员 sys_admin 登录了系统', tag: 'login', result: '成功', duration: 4, operator: 'sys_admin', audit: '未审计', time: '2026-09-22 14:18:24' },
  { business: '应用证书列表', content: '查询应用证书列表', tag: 'query', result: '成功', duration: 3, operator: 'sys_admin', audit: '未审计', time: '2026-09-22 14:18:24' },
  { business: '应用证书列表', content: '查询应用证书列表', tag: 'query', result: '成功', duration: 6, operator: 'sys_admin', audit: '未审计', time: '2026-09-22 14:18:24' }
])
const search = () => {}
const reset = () => { Object.assign(filters, { operator: '', business: '', content: '', time: [] }) }
const exportLogs = () => ElMessage.success('日志导出任务已提交')
</script>
<style scoped>
.log-page { min-height:100%; }.page-title { font-size:28px; line-height:40px; color:#1f2937; margin:6px 0 18px; }.filter-card,.table-card { background:#fff; box-shadow:0 2px 9px rgba(31,35,41,.08); padding:18px 24px; }.filter-card { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }.filter-item { display:flex; align-items:center; gap:10px; color:#1f2937; white-space:nowrap; }.filter-item :deep(.el-input) { width:220px; }.time-item :deep(.el-date-editor) { width:355px; }.filter-card > .el-button { min-width:76px; height:34px; }.table-card { margin-top:16px; padding-top:16px; }.toolbar { display:flex; gap:5px; margin-bottom:16px; }.toolbar .el-button { min-width:92px; }.log-table :deep(th.el-table__cell) { background:#f5f6fa; color:#86909c; font-weight:400; }.log-table :deep(td.el-table__cell) { color:#111820; }.audit-status { display:inline-flex; align-items:center; gap:7px; }.audit-status i { display:inline-block; width:11px; height:11px; background:#3b82f6; border-radius:50%; }.pagination { display:flex; justify-content:flex-end; align-items:center; gap:12px; padding-top:18px; color:#86909c; }
@media (max-width: 1200px) { .filter-item :deep(.el-input) { width:170px; }.time-item :deep(.el-date-editor) { width:300px; } }
</style>