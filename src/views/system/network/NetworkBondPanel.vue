<template>
  <div class="network-bond-panel">
    <div class="network-panel-toolbar">
      <el-button type="primary" @click="handleAdd">添加</el-button>
    </div>

    <el-table :data="list" border class="network-table" empty-text="暂无数据">
      <el-table-column prop="bondName" label="bond 名称" min-width="120" />
      <el-table-column prop="bondMode" label="bond模式" min-width="100" />
      <el-table-column prop="boundPorts" label="绑定网口" min-width="140" show-overflow-tooltip />
      <el-table-column prop="ipAddress" label="IP地址" min-width="140" />
      <el-table-column prop="subnetMask" label="子网掩码" min-width="120" />
      <el-table-column prop="gateway" label="网关" min-width="120" />
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
  ElMessage.info('添加聚合接口（原型演示）')
}

function handleEdit () {
  ElMessage.info('编辑聚合接口（原型演示）')
}

function handleDelete () {
  ElMessage.info('删除聚合接口（原型演示）')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import './networkPanel.scss';
</style>
