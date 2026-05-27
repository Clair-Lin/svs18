<template>
  <div class="network-vlan-panel">
    <div class="network-panel-toolbar">
      <el-button type="primary" @click="handleAdd">添加</el-button>
    </div>

    <el-table :data="list" border class="network-table" empty-text="暂无数据">
      <el-table-column prop="vlanId" label="VLAN ID" width="100" align="center" />
      <el-table-column prop="ipAddress" label="IP地址" min-width="140" />
      <el-table-column prop="subnetMask" label="子网掩码" min-width="120" />
      <el-table-column prop="gateway" label="网关" min-width="120" />
      <el-table-column prop="linkedPort" label="关联网口" min-width="120" />
      <el-table-column label="禁/启用" width="100" align="center">
        <template #default="{ row }">
          <el-switch v-model="row.enabled" @change="handleToggle(row)" />
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
  ElMessage.info('添加 VLAN（原型演示）')
}

function handleEdit () {
  ElMessage.info('编辑 VLAN（原型演示）')
}

function handleDelete () {
  ElMessage.info('删除 VLAN（原型演示）')
}

function handleToggle () {
  ElMessage.success('VLAN 状态已更新（原型演示）')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import './networkPanel.scss';
</style>
