<template>
  <div class="network-sub-panel">
    <div class="network-panel-toolbar">
      <el-button type="primary" @click="handleAdd">添加</el-button>
    </div>

    <el-table :data="list" border class="network-table" empty-text="暂无数据">
      <el-table-column prop="subName" label="子接口" min-width="120" />
      <el-table-column prop="parentInterface" label="归属主接口" min-width="120" />
      <el-table-column prop="ipAddress" label="IP地址" min-width="140" />
      <el-table-column prop="subnetMask" label="子网掩码" min-width="120" />
      <el-table-column label="网口状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.portUp ? 'success' : 'info'" size="small">
            {{ row.portUp ? '已连接' : '未连接' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="88" align="center">
        <template #default="{ row }">
          <el-tag :type="row.enabled ? 'success' : 'info'" size="small">
            {{ row.enabled ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right" align="center">
        <template #default="{ row }">
          <div class="network-row-actions">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="primary" link @click="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const list = ref([])

function handleAdd () {
  ElMessage.info('添加子接口（原型演示）')
}

function handleEdit () {
  ElMessage.info('编辑子接口（原型演示）')
}

function handleDelete () {
  ElMessage.info('删除子接口（原型演示）')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import './networkPanel.scss';
</style>
