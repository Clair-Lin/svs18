<template>
  <div class="snmp-config">
    <div class="page-card">
      <div class="field-row">
        <span class="field-label">SNMP服务状态：</span>
        <el-switch v-model="snmpServiceOn" inline-prompt active-text="开" inactive-text="关" />
      </div>

      <div class="section-block">
        <div class="section-head">
          <span class="section-bar" />
          <span class="section-title">SNMP版本_V3</span>
        </div>

        <div class="table-wrap">
          <el-table :data="v3Users" border stripe class="v3-table">
            <el-table-column prop="username" label="用户名" min-width="120">
              <template #default="{ row }">
                <el-input v-model="row.username" placeholder="用户名" clearable />
              </template>
            </el-table-column>
            <el-table-column prop="securityLevel" label="安全级别" min-width="140">
              <template #default="{ row }">
                <el-select v-model="row.securityLevel" placeholder="请选择" style="width: 100%">
                  <el-option label="认证且加密" value="authPriv" />
                  <el-option label="仅认证" value="authNoPriv" />
                  <el-option label="不认证不加密" value="noAuthNoPriv" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="authProtocol" label="认证协议" min-width="120">
              <template #default="{ row }">
                <el-select v-model="row.authProtocol" placeholder="请选择" style="width: 100%">
                  <el-option label="MD5" value="MD5" />
                  <el-option label="SHA" value="SHA" />
                  <el-option label="SHA-256" value="SHA256" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="authPassword" label="认证密码" min-width="140">
              <template #default="{ row }">
                <el-input v-model="row.authPassword" type="password" show-password placeholder="认证密码" />
              </template>
            </el-table-column>
            <el-table-column prop="privProtocol" label="加密协议" min-width="110">
              <template #default="{ row }">
                <el-select v-model="row.privProtocol" placeholder="请选择" style="width: 100%">
                  <el-option label="DES" value="DES" />
                  <el-option label="AES" value="AES" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="privPassword" label="加密密钥" min-width="140">
              <template #default="{ row }">
                <el-input v-model="row.privPassword" type="password" show-password placeholder="加密密钥" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row, $index }">
                <el-button type="primary" link @click="onEditRow(row, $index)">编辑</el-button>
                <el-button type="danger" link @click="onDeleteRow($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-button type="primary" link class="add-user-btn" @click="onAddV3User">
          <el-icon><Plus /></el-icon>
          添加用户
        </el-button>
      </div>

      <div class="section-block">
        <div class="section-head">
          <span class="section-bar" />
          <span class="section-title">SNMP版本_V2</span>
        </div>
        <div class="field-row">
          <span class="field-label">启用SNMP_V2：</span>
          <el-switch v-model="snmpV2On" inline-prompt active-text="开" inactive-text="关" />
        </div>
      </div>

      <div class="footer-actions">
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

let v3IdSeq = 2

const snmpServiceOn = ref(true)
const snmpV2On = ref(false)

const v3Users = ref([
  {
    id: 1,
    username: 'olymsnmp',
    securityLevel: 'authPriv',
    authProtocol: 'SHA256',
    authPassword: '********',
    privProtocol: 'AES',
    privPassword: '********'
  }
])

function onAddV3User() {
  v3Users.value.push({
    id: v3IdSeq++,
    username: '',
    securityLevel: 'authPriv',
    authProtocol: 'SHA256',
    authPassword: '',
    privProtocol: 'AES',
    privPassword: ''
  })
}

function onEditRow() {
  ElMessage.info('请在表格中直接修改字段，完成后点击「确定」保存（原型演示）')
}

function onDeleteRow(index) {
  ElMessageBox.confirm('确定删除该 SNMPv3 用户？', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      v3Users.value.splice(index, 1)
      ElMessage.success('已删除（原型演示）')
    })
    .catch(() => {})
}

function onSubmit() {
  ElMessage.success('SNMP 配置已保存（原型演示）')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.field-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.field-label {
  margin-right: 8px;
  color: $text-primary;
}

.section-block {
  margin-bottom: 28px;
}

.section-head {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.section-bar {
  width: 4px;
  height: 16px;
  background: $primary-color;
  border-radius: 2px;
  margin-right: 8px;
  flex-shrink: 0;
}

.section-title {
  font-size: $font-size-base;
  font-weight: 600;
  color: $text-primary;
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
}

.v3-table {
  min-width: 960px;
}

.add-user-btn {
  margin-top: 8px;
  padding-left: 0;
}

.footer-actions {
  margin-top: 8px;
}
</style>
