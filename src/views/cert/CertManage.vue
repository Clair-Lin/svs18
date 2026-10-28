<template>
  <div class="cert-manage">
    <h1 class="cert-page-title">{{ pageTab === 'apply' ? '证书申请管理' : '证书管理' }}</h1>
    <div class="page-tabs-shell">
      <el-tabs v-model="pageTab" class="cert-page-tabs">
        <el-tab-pane name="cert" lazy>
          <template #label>
            <span class="cert-tab-label">证书管理<el-tag class="cert-tab-new" type="danger" effect="dark" size="small">新</el-tag></span>
          </template>
          <div class="search-area">
                        <el-form :inline="true" :model="searchForm" class="search-form cert-search-form">
              <el-form-item label="密钥编号">
                <el-input v-model="searchForm.keyNumber" placeholder="请输入密钥编号" clearable />
              </el-form-item>
              <el-form-item label="证书名称">
                <el-input v-model="searchForm.appCertName" placeholder="请输入证书名称" clearable />
              </el-form-item>
              <el-form-item label="应用名称">
                <el-input v-model="searchForm.appName" placeholder="请选择应用" clearable />
              </el-form-item>
              <el-form-item label="数据来源">
                <el-select v-model="searchForm.dataSource" placeholder="请选择数据来源" clearable>
                  <el-option label="本地创建" value="本地创建" />
                  <el-option label="导入" value="导入" />
                </el-select>
              </el-form-item>
              <template v-if="searchExpanded">
                <el-form-item label="证书类型">
                  <el-select v-model="searchForm.certType" placeholder="请选择证书类型" clearable>
                    <el-option label="签名证书" value="签名证书" />
                    <el-option label="双证书" value="双证书" />
                  </el-select>
                </el-form-item>
                <el-form-item label="加密证书关联">
                  <el-select v-model="searchForm.hasEncryption" placeholder="请选择关联状态" clearable>
                    <el-option label="已关联" value="yes" />
                    <el-option label="未关联" value="no" />
                  </el-select>
                </el-form-item>
                <el-form-item label="证书状态">
                  <el-select v-model="searchForm.status" placeholder="请选择证书状态" clearable>
                    <el-option label="生效中" value="生效中" />
                    <el-option label="已过期" value="已过期" />
                    <el-option label="已吊销" value="已吊销" />
                    <el-option label="未生效" value="未生效" />
                    <el-option label="未知" value="未知" />
                  </el-select>
                </el-form-item>
              </template>
            </el-form>
            <div class="cert-search-actions">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button link type="primary" @click="searchExpanded = !searchExpanded">
                {{ searchExpanded ? '收起' : '展开' }}<el-icon><ArrowDown /></el-icon>
              </el-button>
            </div>
          </div>

          <div class="action-bar">
            <el-button type="primary" @click="openImportExternalSignDialog">导入证书</el-button>
            <el-button @click="openImportEncryptDialog">导入加密证书</el-button>
          </div>

          <el-table :data="visibleCertRows" class="cert-manage-table" :row-class-name="certRowClassName">
            <el-table-column label="证书名称/密钥编号" min-width="200" show-overflow-tooltip>
              <template #default="{ row }">
                <div class="name-key-cell">
                  <div class="cert-name-line">
                    <el-button
                      v-if="row.encryptionCert"
                      class="cert-expand-control"
                      link
                      :aria-label="isCertExpanded(row) ? '收起双证' : '展开双证'"
                      @click.stop="toggleCertExpansion(row)"
                    >
                      <el-icon><ArrowDown v-if="isCertExpanded(row)" /><ArrowRight v-else /></el-icon>
                    </el-button>
                    <span class="primary-line">{{ row.appCertName }}</span>
                  </div>
                  <span class="sub-line">{{ row.keyNumber || row.keyId || (row.keyIndex ? `索引 ${row.keyIndex}` : '—') }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="数据来源" width="110">
              <template #default="{ row }">{{ row.dataSource || "本地创建" }}</template>
            </el-table-column>
            <el-table-column label="应用名称" min-width="130" show-overflow-tooltip>
              <template #default="{ row }">{{ row.appName || row.appId || "—" }}</template>
            </el-table-column>
            <el-table-column label="算法类型" width="118" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.algorithmDisplay || row.algorithm }}
              </template>
            </el-table-column>
            <el-table-column label="颁发者" min-width="200" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.issuer || '—' }}
              </template>
            </el-table-column>
            <el-table-column label="证书主题" min-width="220" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.subjectDn || '—' }}
              </template>
            </el-table-column>
            <el-table-column prop="serialNumber" label="证书序列号" width="120" show-overflow-tooltip />
            <el-table-column label="证书类型" width="130" show-overflow-tooltip>
              <template #default="{ row }">
                <div class="cert-type-cell">
                  <span>{{ row.certType || row.category || '—' }}</span>
                  <el-tag v-if="row.certRole === '签名'" size="small" type="primary" effect="plain">签名</el-tag>
                  <el-tag v-else-if="row.certRole === '加密'" size="small" type="warning" effect="plain">加密</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="证书状态" width="168" align="center" show-overflow-tooltip>
              <template #default="{ row }">
                <span class="cert-status-live" :class="getStatusClass(getCertDisplayStatus(row))">
                  <span class="cert-status-dot" aria-hidden="true" />
                  {{ getCertDisplayStatus(row) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createdAt" width="168" align="center" />
            <el-table-column prop="notBefore" label="生效时间" width="168" align="center" />
            <el-table-column prop="notAfter" label="到期时间" width="168" align="center" />
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="{ row }">
                <template v-if="!row.isPairChild">
                  <el-button type="primary" size="small" link @click="handleCertUpdate(row)">更新</el-button>
                  <el-button type="primary" size="small" link @click="handleCertExport(row)">导出</el-button>
                  <el-button type="primary" size="small" link @click="handleCertDelete(row)">删除</el-button>
                </template>
                <template v-else>
                  <el-button type="primary" size="small" link @click="openUpdateEncryptDialog(row)">更新</el-button>
                  <el-button type="primary" size="small" link @click="handleEncryptCertDelete(row)">删除</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination">
            <el-pagination
              v-model:current-page="certPage"
              v-model:page-size="certPageSize"
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="filteredCertList.length"
              :page-sizes="[10, 20, 50, 100]"
            />
          </div>
        </el-tab-pane>

        <el-tab-pane name="apply" lazy>
          <template #label>
            <span class="cert-tab-label">证书申请管理<el-tag class="cert-tab-new" type="danger" effect="dark" size="small">新</el-tag></span>
          </template>
          <div class="search-area apply-search-area">
            <el-form :inline="true" :model="applySearchForm" class="search-form cert-search-form">
              <el-form-item label="应用名称">
                <el-input v-model="applySearchForm.appName" placeholder="请选择应用" clearable />
              </el-form-item>
              <el-form-item label="数据来源">
                <el-select v-model="applySearchForm.dataSource" placeholder="请选择数据来源" clearable>
                  <el-option label="本地创建" value="本地创建" />
                  <el-option label="导入" value="导入" />
                </el-select>
              </el-form-item>
              <el-form-item class="search-actions">
                <el-button type="primary" @click="handleApplySearch">查询</el-button>
                <el-button @click="resetApplySearch">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="action-bar">
            <el-button type="primary" @click="openApplyCertDialog">申请应用证书</el-button>
            <el-button @click="refreshApplyList">刷新</el-button>
          </div>
          <el-table :data="pagedApplyList" border>
            <el-table-column prop="certName" label="证书名称" min-width="190" show-overflow-tooltip />
            <el-table-column label="数据来源" width="120">
              <template #default="{ row }">{{ row.dataSource || '本地创建' }}</template>
            </el-table-column>
            <el-table-column label="应用名称" width="150">
              <template #default="{ row }">{{ row.appName || '--' }}</template>
            </el-table-column>
            <el-table-column prop="subjectDn" label="证书主题(DN)" min-width="300" show-overflow-tooltip />
            <el-table-column prop="algorithm" label="算法" width="90" />
            <el-table-column prop="keyIndex" label="密钥索引" width="100" />
            <el-table-column label="状态" width="110">
              <template #default="{ row }">
                <span class="apply-status" :class="row.applyStatus === '已签发' ? 'issued' : 'pending'">
                  <span class="apply-status-dot" />{{ row.applyStatus }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="applyTime" label="申请时间" width="168" />
            <el-table-column label="操作" fixed="right" width="230">
              <template #default="{ row }">
                <el-button type="primary" size="small" link @click="openImportApplyCert(row)">导入证书</el-button>
                <el-button type="primary" size="small" link @click="downloadApplyCsr(row)">下载CSR</el-button>
                <el-button type="primary" size="small" link @click="removeApplyRow(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              v-model:current-page="applyPage"
              v-model:page-size="applyPageSize"
              background
              layout="total, prev, pager, next, sizes"
              :total="filteredApplyList.length"
              :page-sizes="[10, 20, 50, 100]"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog class="cert-manage-dialog" v-model="externalSignVisible" title="导入证书" width="620px" destroy-on-close>
      <el-form ref="externalSignFormRef" :model="externalSignForm" :rules="externalSignRules" label-width="136px">
        <el-form-item label="证书名称" prop="certName">
          <el-input v-model="externalSignForm.certName" placeholder="请输入证书名称，2-60个字符" maxlength="60" clearable />
        </el-form-item>
        <el-form-item label="证书文件" prop="fileName">
          <el-upload action="#" :auto-upload="false" :limit="1" :on-change="onExternalCertFileChange" :on-remove="onExternalCertFileRemove" accept=".cer,.pem,.der,.p12,.pfx,.data">
            <el-button type="primary">点击上传</el-button>
          </el-upload>
          <div class="upload-format-tip">支持 .cer, .pem, .der, .p12, .pfx, .data</div>
        </el-form-item>
        <el-form-item label="证书保护密码" prop="certProtectPwd">
          <el-input v-model="externalSignForm.certProtectPwd" type="password" show-password placeholder="请输入证书保护密码" autocomplete="new-password" />
        </el-form-item>
        <el-form-item label="密钥访问口令" prop="keyAccessPwd">
          <el-input v-model="externalSignForm.keyAccessPwd" type="password" show-password placeholder="请输入密钥访问口令" autocomplete="new-password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="externalSignVisible = false">取消</el-button>
        <el-button type="primary" @click="submitImportExternalSign">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog class="cert-manage-dialog" v-model="importEncryptVisible" :title="importEncryptMode === 'update' ? '更新加密证书' : '导入加密证书'" width="600px" destroy-on-close>
      <el-form
        ref="importFormRef"
        class="import-encrypt-form"
        :model="importEncryptForm"
        :rules="importEncryptRules"
        label-width="140px"
      >
        <el-form-item label="签名证书" prop="signerId">
          <el-button v-if="importEncryptMode === 'create'" type="primary" plain @click="openSignerPicker">选择签名证书</el-button>
          <span v-if="selectedSigner" class="selected-signer-name">{{ selectedSigner.appCertName }}</span>
          <span v-else class="text-secondary">未选择</span>
        </el-form-item>
        <div v-if="selectedSigner" class="selected-signer-summary">
          <span>主题：{{ selectedSigner.subjectDn || '—' }}</span>
          <span>密钥索引：{{ selectedSigner.keyIndex || '—' }}</span>
        </div>
        <el-form-item label="加密证书" prop="certFileName">
          <el-upload
            class="encrypt-cert-upload"
            action="#"
            :auto-upload="false"
            :limit="1"
            :on-change="onEncryptCertFileChange"
            :on-remove="onEncryptCertFileRemove"
            accept=".pem,.cer,.crt,.der,.p7b"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="加密私钥" prop="privateKeyFileName">
          <el-upload
            class="encrypt-cert-upload"
            action="#"
            :auto-upload="false"
            :limit="1"
            :on-change="onEncryptPrivateKeyFileChange"
            :on-remove="onEncryptPrivateKeyFileRemove"
            accept=".pem,.key,.data,.zip"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
</el-form>
      <template #footer>
        <el-button @click="importEncryptVisible = false">取消</el-button>
        <el-button type="primary" @click="submitImportEncrypt">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog class="cert-manage-dialog" v-model="signerPickerVisible" title="选择签名证书" width="980px" destroy-on-close>
      <div class="signer-picker">
        <el-form :inline="true" :model="signerPickerQuery" class="signer-picker-query">
          <el-form-item label="证书名称">
            <el-input v-model="signerPickerQuery.name" placeholder="请输入证书名称" clearable />
          </el-form-item>          <el-form-item label="证书状态">
            <el-select v-model="signerPickerQuery.status" placeholder="请选择状态" clearable>
              <el-option label="生效中" value="生效中" />
              <el-option label="已过期" value="已过期" />
              <el-option label="已吊销" value="已吊销" />
              <el-option label="未生效" value="未生效" />
              <el-option label="未知" value="未知" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="signerPickerPage = 1">查询</el-button>
            <el-button @click="resetSignerPickerQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="pagedSignerPickerRows"
          height="430"
          highlight-current-row
          :row-class-name="signerPickerRowClassName"
          @row-click="selectSignerPickerRow"
        >
          <el-table-column width="54" align="center">
            <template #default="{ row }">
              <el-radio v-model="signerPickerSelectedId" :label="row.id" @click.stop>
                <span class="sr-only">选择</span>
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="appCertName" label="证书名称" min-width="180" show-overflow-tooltip />
          <el-table-column label="证书主题" min-width="220" show-overflow-tooltip>
            <template #default="{ row }">{{ row.subjectDn || '—' }}</template>
          </el-table-column>
          <el-table-column label="算法" width="110">
            <template #default="{ row }">{{ row.algorithmDisplay || row.algorithm || '—' }}</template>
          </el-table-column>
          <el-table-column prop="serialNumber" label="序列号" width="150" show-overflow-tooltip />
          <el-table-column prop="keyIndex" label="密钥索引" width="100" />
          <el-table-column label="状态" width="110">
            <template #default="{ row }">
              <span class="cert-status-live" :class="getStatusClass(row.status)">
                <span class="cert-status-dot" />{{ row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="有效期" width="220">
            <template #default="{ row }">{{ row.notBefore || '—' }} 至 {{ row.notAfter || '—' }}</template>
          </el-table-column>
        </el-table>
        <div class="signer-picker-footer">
          <span>已选 {{ signerPickerSelectedId ? 1 : 0 }} 条数据</span>
          <el-pagination
            v-model:current-page="signerPickerPage"
            v-model:page-size="signerPickerPageSize"
            background
            layout="total, prev, pager, next, sizes"
            :total="filteredSignerPickerRows.length"
            :page-sizes="[10, 20, 50]"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="signerPickerVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSignerPicker">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog class="cert-manage-dialog"
      v-model="applyCertVisible"
      title="申请应用证书"
      width="680px"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form
        ref="applyCertFormRef"
        :model="applyCertForm"
        :rules="applyCertRules"
        label-width="128px"
        label-position="right"
        class="apply-cert-form"
      >
        <el-form-item label="证书名称" prop="certName">
          <el-input v-model="applyCertForm.certName" placeholder="请输入证书名称" clearable maxlength="128" />
        </el-form-item>
        <el-form-item label="算法" prop="algorithm">
          <el-select v-model="applyCertForm.algorithm" placeholder="请选择算法" @change="onApplyAlgorithmChange">
            <el-option label="SM2" value="sm2" />
            <el-option label="RSA" value="rsa" />
            <el-option-group label="PQC 算法">
              <el-option v-for="option in PQC_KEY_OPTIONS" :key="option.value" :label="option.label" :value="option.value" />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="密钥索引" prop="keyIndex">
          <el-select v-model="applyCertForm.keyIndex" placeholder="请选择签名密钥索引">
            <el-option
              v-for="key in signingKeyOptions"
              :key="key.index"
              :label="`${key.index}（${key.algorithm.toUpperCase()}）`"
              :value="key.index"
              :disabled="normalizeCertAlgorithm(key.algorithm) !== normalizeCertAlgorithm(applyCertForm.algorithm)"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="使用自定义主题">
          <el-radio-group v-model="applyCertForm.useCustomSubject" @change="onUseCustomSubjectChange">
            <el-radio value="yes">是</el-radio>
            <el-radio value="no">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="applyCertForm.useCustomSubject === 'yes'">
          <el-form-item label="证书主题(DN)" prop="subjectDnCustom">
            <el-input
              v-model="applyCertForm.subjectDnCustom"
              type="textarea"
              :rows="3"
              placeholder="请输入证书主题(DN)"
              maxlength="512"
              show-word-limit
            />
            <p class="apply-dn-custom-hint">示例：/C=CN/ST=GuangDong/O=Olym Tech Ltd/CN=13511111111_s1123</p>
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item label="通用名(CN)" prop="dnCN" class="apply-dn-cn-item">
            <div class="apply-dn-cn-wrap">
              <el-input
                v-model="applyCertForm.dnCN"
                placeholder="请输入通用名(CN), 2-50个字符"
                clearable
                maxlength="50"
              />
              <p class="apply-dn-cn-tip">
                通用名可以为邮箱、手机号、域名、姓名，或由中文、英文、数字、_等组成
              </p>
            </div>
          </el-form-item>
          <el-form-item label="国家(C)" prop="dnC">
            <el-select v-model="applyCertForm.dnC" placeholder="选择所属国家" filterable>
              <el-option v-for="c in countryOptions" :key="c.code" :label="c.label" :value="c.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="省份/州(ST)" prop="dnST">
            <el-input v-model="applyCertForm.dnST" placeholder="如：广东" clearable maxlength="128" />
          </el-form-item>
          <el-form-item label="城市(L)" prop="dnL" class="apply-dn-field">
            <el-input v-model="applyCertForm.dnL" placeholder="如：深圳" clearable maxlength="128" />
          </el-form-item>
          <el-form-item label="公司(O)" prop="dnO">
            <el-input v-model="applyCertForm.dnO" placeholder="如：a company" clearable maxlength="128" />
          </el-form-item>
          <el-form-item label="部门(OU)" prop="dnOU">
            <el-input v-model="applyCertForm.dnOU" placeholder="如：研发部" clearable maxlength="128" />
          </el-form-item>
          <el-form-item label="邮箱地址" prop="dnEmail">
            <el-input v-model="applyCertForm.dnEmail" placeholder="请输入邮箱地址" clearable maxlength="128" />
          </el-form-item>
          <el-form-item label="证书主题预览" class="apply-dn-subject-preview-item">
            <div class="apply-dn-subject-preview" :class="{ 'is-placeholder': !applyCurrentSubjectDn }">
              {{ applyCurrentSubjectDn || '（填写通用名与国家后将显示当前证书主题）' }}
            </div>
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button @click="applyCertVisible = false">取消</el-button>
        <el-button type="primary" :loading="applyCertSubmitting" @click="submitApplyCert">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog class="cert-manage-dialog" v-model="importApplyCertVisible" title="导入证书" width="520px" destroy-on-close>
      <el-form ref="importApplyFormRef" :model="importApplyForm" :rules="importApplyRules" label-width="120px">
        <el-form-item label="申请记录">
          <span class="text-secondary">{{ importApplyTarget?.subjectDn || '—' }}</span>
        </el-form-item>
        <el-form-item label="证书文件" prop="fileName">
          <el-upload
            class="encrypt-cert-upload"
            action="#"
            :auto-upload="false"
            :limit="1"
            :on-change="onImportApplyFileChange"
            :on-remove="onImportApplyFileRemove"
            accept=".cer,.crt,.pem,.p7b"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="importApplyCertVisible = false">取消</el-button>
        <el-button type="primary" @click="submitImportApplyCert">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog class="cert-manage-dialog" v-model="exportCertVisible" title="导出应用证书" width="620px" destroy-on-close>
      <el-form label-width="104px" class="export-cert-form">
        <el-form-item label="证书名称">
          <el-input :model-value="exportCert?.appCertName || ''" disabled />
        </el-form-item>
        <el-form-item label="导出类型" required>
          <el-select v-model="exportCertType" placeholder="请选择导出类型" class="w-full">
            <el-option label="证书" value="pem" />
            <el-option label="证书+私钥" value="p12" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exportCertVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCertExport">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog class="cert-manage-dialog" v-model="updateCertVisible" title="更新应用证书" width="680px" destroy-on-close>
      <el-form label-width="112px" class="update-cert-form">
        <el-form-item label="证书名称">
          <span>{{ updateCert?.appCertName || '—' }}</span>
        </el-form-item>
        <el-form-item label="算法类型">
          <span>{{ updateCert?.algorithmDisplay || updateCert?.algorithm || '—' }}</span>
        </el-form-item>
        <el-form-item label="证书主题">
          <el-input
            v-model="updateCertSubject"
            type="textarea"
            :rows="3"
            placeholder="请输入证书主题"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="updateCertVisible = false">取消</el-button>
        <el-popover v-model:visible="updateConfirmVisible" placement="top-end" :width="430" trigger="click" popper-class="cert-manage-popover">
          <p class="update-cert-warning">
            本次仅更新签名证书，不会更新关联的加密证书。如需更新加密证书，请单独更新加密证书并重新导入。应用证书更新后，原签名证书将被删除，无法再使用原证书进行数字签名。确定要更新吗？
          </p>
          <div class="update-cert-warning-actions">
            <el-button type="primary" @click="openUpdateAuth">确认更新</el-button>
          </div>
          <template #reference>
            <el-button type="primary">确定</el-button>
          </template>
        </el-popover>
      </template>
    </el-dialog>
    <el-dialog class="cert-manage-dialog"
      v-model="updateAuthVisible"
      title="二次认证"
      width="600px"
      align-center
      :close-on-click-modal="false"
    >
      <div class="update-auth-body">
        <div class="update-auth-label">管理员密码</div>
        <el-input
          v-model="updateAdminPassword"
          type="password"
          show-password
          clearable
          autocomplete="off"
          placeholder="输入管理员密码进行认证"
          @keyup.enter="confirmUpdateAuth"
        />
      </div>
      <template #footer>
        <el-button @click="updateAuthVisible = false">取消</el-button>
        <el-button type="primary" :loading="updateAuthSubmitting" @click="confirmUpdateAuth">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect, nextTick } from 'vue'
import { setPageBreadcrumbItems } from '@/composables/pageBreadcrumb'
import { useCertManagePool } from '@/composables/useCertManagePool'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, CircleClose, CircleCheck, ArrowDown, ArrowRight } from '@element-plus/icons-vue'
import { PQC_KEY_OPTIONS } from '@/constants/pqc.js'

const pad2 = (n) => String(n).padStart(2, '0')
const formatNow = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

/** 将拆分字段组装为 DN（仅含已填项；CN、C 必填由表单保证）；可选邮箱 E= */
const buildSubjectDnFromForm = (f) => {
  const esc = (v) => String(v || '').replace(/([/+,;"d>\\])/g, '\\$1')
  const segs = []
  if (f.dnC) segs.push(`C=${esc(f.dnC)}`)
  if (String(f.dnST || '').trim()) segs.push(`ST=${esc(f.dnST.trim())}`)
  if (String(f.dnL || '').trim()) segs.push(`L=${esc(f.dnL.trim())}`)
  if (String(f.dnO || '').trim()) segs.push(`O=${esc(f.dnO.trim())}`)
  if (String(f.dnOU || '').trim()) segs.push(`OU=${esc(f.dnOU.trim())}`)
  if (String(f.dnEmail || '').trim()) segs.push(`E=${esc(f.dnEmail.trim())}`)
  segs.push(`CN=${esc(f.dnCN)}`)
  return `/${segs.join('/')}`
}

const countryOptions = [
  { code: 'CN', label: 'China (中国)' },
  { code: 'US', label: 'United States (美国)' },
  { code: 'GB', label: 'United Kingdom (英国)' },
  { code: 'JP', label: 'Japan (日本)' },
  { code: 'DE', label: 'Germany (德国)' }
]

const pageTab = ref('cert')
const activeTabBreadcrumb = computed(() =>
  pageTab.value === 'apply' ? '证书申请管理' : '证书管理'
)

watchEffect(() => {
  setPageBreadcrumbItems([
    { label: '签名验签管理' },
    { label: '应用证书管理' },
    { label: activeTabBreadcrumb.value }
  ])
})

const certPage = ref(1)
const certPageSize = ref(10)
const updateCertVisible = ref(false)
const updateConfirmVisible = ref(false)
const updateAuthVisible = ref(false)
const updateAuthSubmitting = ref(false)
const updateAdminPassword = ref('')
const updateCert = ref(null)
const updateCertSubject = ref('')
const exportCertVisible = ref(false)
const exportCert = ref(null)
const exportCertType = ref('')
const importEncryptVisible = ref(false)
const importEncryptMode = ref('create')
const externalSignVisible = ref(false)
const externalSignFormRef = ref(null)
const importFormRef = ref(null)

const applyPage = ref(1)
const applyPageSize = ref(10)
const applyCertVisible = ref(false)
const applyCertFormRef = ref(null)
const applyCertSubmitting = ref(false)

const applyCertForm = reactive({
  certName: '',
  algorithm: 'sm2',
  useCustomSubject: 'no',
  keyIndex: 689,
  subjectDnCustom: '',
  dnCN: '',
  dnO: '',
  dnOU: '',
  dnL: '',
  dnST: '',
  dnC: 'CN',
  dnEmail: ''
})


const signingKeyOptions = [
  { index: 689, algorithm: 'sm2' },
  { index: 690, algorithm: 'rsa' },
  { index: 101, algorithm: 'sm2' },
  { index: 102, algorithm: 'rsa' },
  { index: 106, algorithm: 'ML_DSA_65' },
  { index: 692, algorithm: 'SLH_DSA_SHA2_192f' },
  ...PQC_KEY_OPTIONS
    .filter(({ value }) => !['ML_DSA_65', 'SLH_DSA_SHA2_192f'].includes(value))
    .map(({ value }, index) => ({ index: 700 + index, algorithm: value }))
]

const normalizeCertAlgorithm = (algorithm) => String(algorithm || '').toLowerCase()

const isPqcCertAlgorithm = (algorithm) =>
  PQC_KEY_OPTIONS.some((option) => option.value === algorithm)

const certAlgorithmDisplay = (algorithm) => {
  if (algorithm === 'sm2') return 'SM3WithSM2'
  return String(algorithm || '').toUpperCase()
}
/** 非自定义主题时：由拆分字段生成预览 DN */
const applyCurrentSubjectDn = computed(() => {
  const f = applyCertForm
  if (f.useCustomSubject === 'yes') return ''
  if (!String(f.dnCN || '').trim() || !f.dnC) return ''
  return buildSubjectDnFromForm(f)
})

const applyCertRules = computed(() => {
  const base = {
    certName: [{ required: true, message: '请输入证书名称', trigger: 'blur' }],
    algorithm: [{ required: true, message: '请选择算法', trigger: 'change' }],
    keyIndex: [{ required: true, message: '请选择密钥索引', trigger: 'change' }]
  }

  if (applyCertForm.useCustomSubject === 'yes') {
    return {
      ...base,
      subjectDnCustom: [
        { required: true, message: '请输入证书主题(DN)', trigger: 'blur' },
        { min: 4, message: '证书主题(DN)至少 4 个字符', trigger: 'blur' }
      ]
    }
  }

  return {
    ...base,
    dnCN: [
      { required: true, message: '请输入通用名(CN)', trigger: 'blur' },
      { min: 2, max: 50, message: '通用名为 2～50 个字符', trigger: 'blur' }
    ],
    dnC: [{ required: true, message: '请选择国家(C)', trigger: 'change' }],
    dnEmail: [
      {
        validator: (_rule, value, callback) => {
          if (!value || !String(value).trim()) return callback()
          const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())
          if (!ok) callback(new Error('请输入正确邮箱格式'))
          else callback()
        },
        trigger: 'blur'
      }
    ]
  }
})

const applySearchForm = reactive({ appName: '', dataSource: '' })

const applyList = ref([
  {
    id: 'a1',
    certName: 'demo_s1100',
    subjectDn: '/C=CN/ST=GuangDong/O=Olym Tech Ltd/CN=13511111111_s1100',
    algorithm: 'rsa',
    keyIndex: 102,
    applyStatus: '未签发',
    applyTime: '2023-11-26 19:33:55'
  },
  {
    id: 'a2',
    certName: 'demo_s1123',
    subjectDn: '/C=CN/ST=GuangDong/O=Olym Tech Ltd/CN=13511111111_s1123',
    algorithm: 'sm2',
    keyIndex: 101,
    applyStatus: '未签发',
    applyTime: '2023-11-26 19:34:12'
  }
])

const filteredApplyList = computed(() => applyList.value.filter((row) => {
  if (applySearchForm.appName && !String(row.appName || '').includes(applySearchForm.appName.trim())) return false
  if (applySearchForm.dataSource && String(row.dataSource || '本地创建') !== applySearchForm.dataSource) return false
  return true
}))

const pagedApplyList = computed(() => {
  const list = filteredApplyList.value
  const start = (applyPage.value - 1) * applyPageSize.value
  return list.slice(start, start + applyPageSize.value)
})

watch(
  () => applyList.value.length,
  () => {
    const pages = Math.max(1, Math.ceil(applyList.value.length / applyPageSize.value) || 1)
    if (applyPage.value > pages) applyPage.value = pages
  }
)

const importApplyCertVisible = ref(false)
const importApplyFormRef = ref(null)
const importApplyTarget = ref(null)
const importApplyForm = reactive({ fileName: '', fileRaw: null })
const importApplyRules = {
  fileName: [{ required: true, message: '请上传证书文件', trigger: 'change' }]
}

const searchExpanded = ref(false)
const signerPickerVisible = ref(false)
const signerPickerPage = ref(1)
const signerPickerPageSize = ref(10)
const signerPickerSelectedId = ref('')
const signerPickerQuery = reactive({ name: '', status: '' })

const filteredSignerPickerRows = computed(() => eligibleSigners.value.filter((row) => {
  if (signerPickerQuery.name && !String(row.appCertName || '').includes(signerPickerQuery.name.trim())) return false
  if (signerPickerQuery.status && row.status !== signerPickerQuery.status) return false
  return true
}))

const pagedSignerPickerRows = computed(() => {
  const start = (signerPickerPage.value - 1) * signerPickerPageSize.value
  return filteredSignerPickerRows.value.slice(start, start + signerPickerPageSize.value)
})

const signerPickerRowClassName = ({ row }) =>
  row.id === signerPickerSelectedId.value ? 'is-selected-signer' : ''

const openSignerPicker = () => {
  signerPickerSelectedId.value = importEncryptForm.signerId || ''
  signerPickerPage.value = 1
  signerPickerVisible.value = true
}

const selectSignerPickerRow = (row) => {
  signerPickerSelectedId.value = row.id
}

const confirmSignerPicker = () => {
  if (!signerPickerSelectedId.value) return
  importEncryptForm.signerId = signerPickerSelectedId.value
  signerPickerVisible.value = false
}

const resetSignerPickerQuery = () => {
  signerPickerQuery.name = ''
  signerPickerQuery.status = ''
  signerPickerPage.value = 1
}


const searchForm = reactive({
  keyNumber: '',
  appCertName: '',
  appName: '',
  dataSource: '',
  certType: '',
  status: '',
  hasEncryption: ''
})

const externalSignForm = reactive({
  certName: '',
  fileName: '',
  fileRaw: null,
  certProtectPwd: '',
  keyAccessPwd: ''
})

const externalSignRules = computed(() => ({
  certName: [{ required: true, message: '请输入证书名称', trigger: 'blur' }],
  fileName: [{ required: true, message: '请上传证书文件', trigger: 'change' }],
  certProtectPwd: [{ required: true, message: '请输入证书保护密码', trigger: 'blur' }],
  keyAccessPwd: [{ required: true, message: '请输入密钥访问口令', trigger: 'blur' }]
}))

const importEncryptForm = reactive({
  signerId: '',
  certFileName: '',
  certFileRaw: null,
  privateKeyFileName: '',
  privateKeyFileRaw: null,
})

const importEncryptRules = {
  signerId: [{ required: true, message: '请选择对应的签名证书', trigger: 'change' }],
  certFileName: [{ required: true, message: '请上传加密证书文件', trigger: 'change' }],
  privateKeyFileName: [{ required: true, message: '请上传加密私钥', trigger: 'change' }]
}

const { allCerts } = useCertManagePool()
const eligibleSigners = computed(() =>
  allCerts.value.filter((row) => {
    const certType = row.certType || row.category
    const status = String(row.status || '')
    const expiry = Date.parse(row.notAfter || '')
    return certType === '签名证书' &&
      String(row.algorithm || '').toLowerCase() === 'sm2' &&
      !row.encryptionCert &&
      status === '生效中' &&
      (!Number.isFinite(expiry) || expiry >= Date.now())
  })
)

const selectedSigner = computed(() => {
  const signer = allCerts.value.find((row) => row.id === importEncryptForm.signerId)
  if (importEncryptMode.value === 'update') return signer?.encryptionCert ? signer : null
  return eligibleSigners.value.find((row) => row.id === importEncryptForm.signerId) || null
})

const getSignerOptionLabel = (row) =>
  `${row.appCertName} · ${row.serialNumber || '无序列号'} · 索引 ${row.keyIndex || '—'}`

const filteredCertList = computed(() =>
  allCerts.value.filter((row) => {
    if ((row.certType || row.category) === '加密证书') return false
    if (searchForm.keyNumber && !String(row.keyNumber || row.keyId || row.keyIndex || '').includes(searchForm.keyNumber.trim())) return false
    if (searchForm.appName && !String(row.appName || row.appId || '').includes(searchForm.appName.trim())) return false
    if (searchForm.dataSource && String(row.dataSource || '本地创建') !== searchForm.dataSource) return false
    if (searchForm.certType && String(row.certType || row.category || '') !== searchForm.certType) return false
    if (searchForm.hasEncryption && String(!!row.encryptionCert) !== String(searchForm.hasEncryption === 'yes')) return false
    if (searchForm.status && String(row.status || '') !== searchForm.status) return false
    if (searchForm.appCertName) {
      const q = searchForm.appCertName.trim()
      const name = String(row.appCertName || '')
      const kn = String(row.keyNumber || row.keyId || row.keyIndex || '')
      if (!name.includes(q) && !kn.includes(q)) return false
    }
    return true
  })
)

const expandedCertIds = ref(new Set(['cert-demo-1']))

const pagedCertList = computed(() => {
  const list = filteredCertList.value
  const start = (certPage.value - 1) * certPageSize.value
  return list.slice(start, start + certPageSize.value).map((row) => ({
    ...row,
    certType: row.encryptionCert ? '双证书' : '签名证书',
    category: row.encryptionCert ? '双证书' : '签名证书',
    certRole: row.encryptionCert ? '签名' : ''
  }))
})

const isCertExpanded = (row) => expandedCertIds.value.has(row.id)

const toggleCertExpansion = (row) => {
  if (!row.encryptionCert) return
  const next = new Set(expandedCertIds.value)
  if (next.has(row.id)) next.delete(row.id)
  else next.add(row.id)
  expandedCertIds.value = next
}

const certRowClassName = ({ row }) => row.isPairChild ? 'cert-pair-child-row' : ''

const visibleCertRows = computed(() => pagedCertList.value.flatMap((row) => {

  if (!row.encryptionCert || !isCertExpanded(row)) return [row]
  const encryptionCert = row.encryptionCert
  return [
    row,
    {
      ...encryptionCert,
      id: encryptionCert.id || `${row.id}-encryption`,
      parentSignerId: row.id,
      appId: row.appId,
      appName: row.appName,
      dataSource: row.dataSource,
      algorithmDisplay: encryptionCert.algorithmDisplay || row.algorithmDisplay || row.algorithm,
      createdAt: encryptionCert.createdAt || row.createdAt || '—',
      certType: '双证书',
      category: '双证书',
      certRole: '加密',
      isPairChild: true
    }
  ]
}))

watch(filteredCertList, (list) => {
  const pages = Math.max(1, Math.ceil(list.length / certPageSize.value) || 1)
  if (certPage.value > pages) certPage.value = pages
})

const getCertDisplayStatus = (row) => row.status || '未知'

const getStatusClass = (status) => {
  switch (status) {
    case '生效中':
      return 'success'
    case '未生效':
      return 'warning'
    case '已过期':
    case '已吊销':
      return 'danger'
    default:
      return ''
  }
}
const handleSearch = () => {
  certPage.value = 1
  ElMessage.success('已按条件筛选（原型演示）')
}

const handleReset = () => {
  Object.assign(searchForm, { keyNumber: '', appCertName: '', appName: '', dataSource: '', certType: '', status: '', hasEncryption: '' })
  certPage.value = 1
}

const openImportExternalSignDialog = () => {
  Object.assign(externalSignForm, {
    certName: '',
    fileName: '',
    fileRaw: null,
    certProtectPwd: '',
    keyAccessPwd: ''
  })
  externalSignFormRef.value?.clearValidate()
  externalSignVisible.value = true
}

const onExternalCertFileChange = (file) => {
  externalSignForm.fileName = file?.name || ''
  externalSignForm.fileRaw = file?.raw || null
  externalSignFormRef.value?.validateField('fileName')
}

const onExternalCertFileRemove = () => {
  externalSignForm.fileName = ''
  externalSignForm.fileRaw = null
}

const submitImportExternalSign = () => {
  externalSignFormRef.value?.validate((valid) => {
    if (!valid) return
    const keyIndex = Math.max(0, ...allCerts.value.map((row) => Number(row.keyIndex || 0))) + 1
    allCerts.value.unshift({
      id: `cert-external-${Date.now()}`,
      createdAt: formatNow(),
      appCertName: externalSignForm.certName,
      keyNumber: '',
      keyIndex,
      algorithm: 'SM2',
      algorithmDisplay: 'SM3WithSM2',
      issuer: '—',
      subjectDn: '—',
      subject: '—',
      serialNumber: '—',
      certType: '签名证书',
      category: '签名证书',
      version: '—',
      status: '生效中',
      notBefore: '—',
      notAfter: '—',
      dataSource: '导入',
      importSource: '外部导入',
      certFileName: externalSignForm.fileName
    })
    certPage.value = 1
    externalSignVisible.value = false
    ElMessage.success('证书已导入（原型演示）')
  })
}

const resetImportEncryptForm = (signerId = '') => {
  Object.assign(importEncryptForm, {
    signerId,
    certFileName: '',
    certFileRaw: null,
    privateKeyFileName: '',
    privateKeyFileRaw: null
  })
  importFormRef.value?.clearValidate()
}

const openImportEncryptDialog = () => {
  importEncryptMode.value = 'create'
  resetImportEncryptForm()
  importEncryptVisible.value = true
}

const openUpdateEncryptDialog = (row) => {
  const signer = allCerts.value.find((item) => item.id === row.parentSignerId && item.encryptionCert)
  if (!signer) {
    ElMessage.warning('未找到对应签名证书或加密证书已删除')
    return
  }
  importEncryptMode.value = 'update'
  resetImportEncryptForm(signer.id)
  importEncryptVisible.value = true
}
const onEncryptCertFileChange = (file) => {
  importEncryptForm.certFileName = file?.name || ''
  importEncryptForm.certFileRaw = file?.raw || null
  importFormRef.value?.validateField('certFileName')
}

const onEncryptCertFileRemove = () => {
  importEncryptForm.certFileName = ''
  importEncryptForm.certFileRaw = null
}

const onEncryptPrivateKeyFileChange = (file) => {
  importEncryptForm.privateKeyFileName = file?.name || ''
  importEncryptForm.privateKeyFileRaw = file?.raw || null
  importFormRef.value?.validateField('privateKeyFileName')
}

const onEncryptPrivateKeyFileRemove = () => {
  importEncryptForm.privateKeyFileName = ''
  importEncryptForm.privateKeyFileRaw = null
}

const getEncryptionImportFailure = () => {
  const fileNames = `${importEncryptForm.certFileName} ${importEncryptForm.privateKeyFileName}`.toLowerCase()
  if (fileNames.includes('mismatch')) return '加密证书公钥与加密私钥不匹配。'
  if (fileNames.includes('chain')) return '证书链校验失败。'
  if (fileNames.includes('expired')) return '两张证书不存在有效期重叠。'
  if (fileNames.includes('ca')) return '两张证书不符合 CA 双证配组规则。'
  if (fileNames.includes('fail') || fileNames.includes('error')) return '加密私钥导入密钥列表失败。'
  return ''
}

const submitImportEncrypt = () => {
  importFormRef.value?.validate((valid) => {
    if (!valid) return
    const signer = allCerts.value.find((row) => row.id === importEncryptForm.signerId)
    if (!signer) {
      ElMessage.warning('请选择有效的签名证书')
      return
    }

    const hasEncryption = Boolean(signer.encryptionCert)
    if (importEncryptMode.value === 'create' && hasEncryption) {
      ElMessage.warning('该签名证书已关联加密证书，不允许重复导入')
      return
    }
    if (importEncryptMode.value === 'update' && !hasEncryption) {
      ElMessage.warning('该签名证书尚未关联加密证书，请使用导入操作')
      return
    }

    const failureMessage = getEncryptionImportFailure()
    if (failureMessage) {
      ElMessage.error(failureMessage)
      return
    }

    const previousCert = signer.encryptionCert
    const keyIndex = previousCert?.keyIndex || Math.max(301, ...allCerts.value.map((row) => Number(row.encryptionCert?.keyIndex || 0))) + 1
    signer.encryptionCert = {
      ...previousCert,
      id: previousCert?.id || `cert-encrypt-${Date.now()}`,
      appCertName: importEncryptForm.certFileName.replace(/\.[^.]+$/, '') || '加密证书',
      keyIndex,
      createdAt: previousCert?.createdAt || formatNow(),
      algorithm: signer.algorithm,
      issuer: previousCert?.issuer || '—',
      subjectDn: signer.subjectDn,
      subject: signer.subjectDn,
      serialNumber: previousCert?.serialNumber || '—',
      status: previousCert?.status || '生效中',
      notBefore: previousCert?.notBefore || '—',
      notAfter: previousCert?.notAfter || '—'
    }
    signer.encryptionKeyIndex = keyIndex
    signer.certType = '双证书'
    signer.category = '双证书'
    expandedCertIds.value = new Set([...expandedCertIds.value, signer.id])
    certPage.value = 1
    importEncryptVisible.value = false
    const wasUpdate = importEncryptMode.value === 'update'
    importEncryptMode.value = 'create'
    ElMessage.success(wasUpdate ? '加密证书已更新（原型演示）' : '加密证书已关联（原型演示）')
  })
}

const handleEncryptCertDelete = (row) => {
  ElMessageBox.confirm(
    '删除加密证书后，该证书将被移除；签名证书会保留。确定要删除吗？',
    '删除加密证书',
    { type: 'warning', confirmButtonText: '确定删除', cancelButtonText: '取消' }
  ).then(() => {
    const signer = allCerts.value.find((item) => item.id === row.parentSignerId)
    if (!signer?.encryptionCert) return
    delete signer.encryptionCert
    delete signer.encryptionKeyIndex
    signer.certType = '签名证书'
    signer.category = '签名证书'
    const next = new Set(expandedCertIds.value)
    next.delete(signer.id)
    expandedCertIds.value = next
    ElMessage.success('加密证书已删除（原型演示）')
  }).catch(() => {})
}
const handleCertUpdate = (row) => {
  updateCert.value = row
  updateCertSubject.value = row.subjectDn || ''
  updateConfirmVisible.value = false
  updateCertVisible.value = true
}

const openUpdateAuth = () => {
  updateAdminPassword.value = ''
  updateAuthVisible.value = true
}

const confirmUpdateAuth = () => {
  if (!updateAdminPassword.value.trim()) {
    ElMessage.warning('请输入管理员密码进行认证')
    return
  }
  if (!updateCert.value) return
  updateAuthSubmitting.value = true
  setTimeout(() => {
    updateCert.value.subjectDn = updateCertSubject.value.trim()
    updateCert.value.subject = updateCertSubject.value.trim()
    updateAuthSubmitting.value = false
    updateAuthVisible.value = false
    updateConfirmVisible.value = false
    updateCertVisible.value = false
    updateAdminPassword.value = ''
    ElMessage.success('应用证书已更新（原型演示）')
  }, 500)
}

const handleCertExport = (row) => {
  exportCert.value = row
  exportCertType.value = ''
  exportCertVisible.value = true
}

const confirmCertExport = () => {
  if (!exportCert.value || !exportCertType.value) {
    ElMessage.warning('请选择导出类型')
    return
  }

  const row = exportCert.value
  const certificates = [row, ...(row.encryptionCert ? [row.encryptionCert] : [])]
  const baseName = String(row.appCertName || 'certificate').replace(/[^a-zA-Z0-9_.-]/g, '_')
  let content
  let fileName
  let contentType

  if (exportCertType.value === 'pem') {
    content = certificates.map((cert) => String(cert.certificatePem || '').replace(/\\n/g, '\n')).filter(Boolean).join('\n')
    fileName = `${baseName}${row.encryptionCert ? '-dual' : ''}.pem`
    contentType = 'application/x-pem-file'
  } else {
    const p12MockPackage = {
      format: 'SVS_P12_EXPORT_MOCK_V1',
      certificateName: row.appCertName,
      exportedAt: formatNow(),
      certificates: certificates.map((cert) => ({
        name: cert.appCertName,
        certificatePem: cert.certificatePem || '',
        privateKeyPem: '-----BEGIN PRIVATE KEY-----\\nU1ZTIFBSSVZBVEUgS0VZIERFTU8=\\n-----END PRIVATE KEY-----'
      }))
    }
    content = JSON.stringify(p12MockPackage, null, 2)
    fileName = `${baseName}${row.encryptionCert ? '-dual' : ''}.p12.json`
    contentType = 'application/json'
  }

  const downloadUrl = URL.createObjectURL(new Blob([content], { type: contentType }))
  const anchor = document.createElement('a')
  anchor.href = downloadUrl
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0)
  exportCertVisible.value = false
  ElMessage.success(row.encryptionCert ? '双证导出文件已生成' : '证书导出文件已生成')
}

const handleCertDelete = (row) => {
  ElMessageBox.confirm(
    row.encryptionCert
      ? '删除签名证书后，其关联的加密证书也会一同删除。确定继续吗？'
      : '确定删除该签名证书吗？',
    '提示',
    { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }
  ).then(() => {
    allCerts.value = allCerts.value.filter((item) => item.id !== row.id)
    expandedCertIds.value = new Set([...expandedCertIds.value].filter((id) => id !== row.id))
    ElMessage.success('签名证书已删除（原型演示）')
  }).catch(() => {})
}
const resetApplyCertForm = () => {
  Object.assign(applyCertForm, {
    certName: '',
    algorithm: 'sm2',
    useCustomSubject: 'no',
    subjectDnCustom: '',
    keyIndex: 689,
    dnCN: '',
    dnO: '',
    dnOU: '',
    dnL: '',
    dnST: '',
    dnC: 'CN',
    dnEmail: ''
  })
}

function onUseCustomSubjectChange () {
  nextTick(() => {
    applyCertFormRef.value?.clearValidate([
      'subjectDnCustom',
      'dnCN',
      'dnC',
      'dnST',
      'dnL',
      'dnO',
      'dnOU',
      'dnEmail'
    ])
  })
}

const handleApplySearch = () => { applyPage.value = 1 }

const resetApplySearch = () => {
  applySearchForm.appName = ''
  applySearchForm.dataSource = ''
  applyPage.value = 1
}

const refreshApplyList = () => {
  applyPage.value = 1
  ElMessage.success('申请记录已刷新')
}

const openApplyCertDialog = () => {
  resetApplyCertForm()
  applyCertVisible.value = true
}

const onApplyAlgorithmChange = (algorithm) => {
  const selectedKey = signingKeyOptions.find((key) => normalizeCertAlgorithm(key.algorithm) === normalizeCertAlgorithm(algorithm))
  if (selectedKey && !signingKeyOptions.some((key) => key.index === applyCertForm.keyIndex && normalizeCertAlgorithm(key.algorithm) === normalizeCertAlgorithm(algorithm))) {
    applyCertForm.keyIndex = selectedKey.index
  }
}

const submitApplyCert = () => {
  applyCertFormRef.value?.validate((valid) => {
    if (!valid) return
    applyCertSubmitting.value = true
    const subjectDn =
      applyCertForm.useCustomSubject === 'yes'
        ? String(applyCertForm.subjectDnCustom || '').trim()
        : buildSubjectDnFromForm(applyCertForm)
    setTimeout(() => {
      applyList.value.unshift({
        id: `a_${Date.now()}`,
        certName: applyCertForm.certName,
        subjectDn,
        algorithm: applyCertForm.algorithm,
        algorithmDisplay: certAlgorithmDisplay(applyCertForm.algorithm),
        useCustomSubject: applyCertForm.useCustomSubject,
        email: applyCertForm.useCustomSubject === 'no' ? String(applyCertForm.dnEmail || '').trim() || undefined : undefined,
        keyIndex: applyCertForm.keyIndex,
        applyStatus: '未签发',
        applyTime: formatNow()
      })
      applyCertSubmitting.value = false
      applyCertVisible.value = false
      applyPage.value = 1
      ElMessage.success('申请已提交（原型演示）')
    }, 280)
  })
}

const openImportApplyCert = (row) => {
  importApplyTarget.value = row
  importApplyForm.fileName = ''
  importApplyForm.fileRaw = null
  importApplyCertVisible.value = true
}

const onImportApplyFileChange = (file) => {
  importApplyForm.fileName = file?.name || ''
  importApplyForm.fileRaw = file?.raw || null
  importApplyFormRef.value?.validateField('fileName')
}

const onImportApplyFileRemove = () => {
  importApplyForm.fileName = ''
  importApplyForm.fileRaw = null
}

const submitImportApplyCert = () => {
  importApplyFormRef.value?.validate((valid) => {
    if (!valid || !importApplyTarget.value) return
    const request = importApplyTarget.value
    allCerts.value.unshift({
      id: `cert-import-${Date.now()}`,
      appId: request.appId || '',
      createdAt: formatNow(),
      appName: request.appName || '',
      appCertName: request.certName,
      keyIndex: request.keyIndex,
      algorithm: request.algorithm,
      algorithmDisplay: String(request.algorithm || '').toUpperCase(),
      issuer: '—',
      subjectDn: request.subjectDn,
      subject: request.subjectDn,
      serialNumber: '—',
      certType: '签名证书',
      category: '签名证书',
      version: '—',
      status: '生效中',
      notBefore: '—',
      notAfter: '—',
      dataSource: '导入',
      sourceApplyId: request.id,
    })
    applyList.value = applyList.value.filter((row) => row.id !== request.id)
    applyPage.value = 1
    certPage.value = 1
    pageTab.value = 'cert'
    importApplyCertVisible.value = false
    importApplyTarget.value = null
    ElMessage.success('签名证书已导入，已转入证书管理（原型演示）')
  })
}

const downloadApplyCsr = (row) => {
  ElMessage.info(`已模拟下载 CSR：${row.certName || row.id}（原型演示）`)
}

const removeApplyRow = (row) => {
  ElMessageBox.confirm('确定删除该证书申请记录吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(() => {
      applyList.value = applyList.value.filter((r) => r.id !== row.id)
      ElMessage.success('已删除')
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.cert-page-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 16px;
  }
}

.search-area {
  background: #fafafa;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .el-form-item {
    margin-bottom: 0;
  }
}

.cert-search-form {
  align-items: flex-start;

  :deep(.el-form-item) {
    margin-right: 8px;
  }

  :deep(.el-input),
  :deep(.el-select) {
    width: 220px;
  }

  .search-actions {
    flex-basis: 100%;
    margin-top: 4px;
  }

  .search-actions :deep(.el-button + .el-button) {
    margin-left: 10px;
  }
}

.action-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
.cert-detail-content {
  max-height: 68vh;
  overflow-y: auto;
  padding-right: 4px;
}

.cert-detail-content :deep(.el-divider) {
  margin: 18px 0 12px;
}

.cert-detail-checks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 8px;
}

}

.cert-type-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.cert-name-line {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.cert-expand-control {
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  padding: 0;
  margin: 0;
  color: $text-secondary;
}

.cert-manage-table :deep(.cert-pair-child-row .el-table__cell:first-child .cell) {
  padding-left: 32px;
}

.cert-manage-table :deep(.el-table__cell) {
  border-right: 0 !important;
}

.name-dn-cell,
.name-key-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .primary-line {
    font-weight: 500;
    color: $text-primary;
  }

  .sub-line {
    font-size: 12px;
    color: $text-secondary;
    line-height: 1.4;
    word-break: break-all;
  }
}

.cert-status-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: $text-secondary;

  &.success {
    color: #52c41a;
  }

  &.warning {
    color: #faad14;
  }

  &.danger {
    color: #ff4d4f;
  }
}

.cert-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  background: currentColor;
}

.status-tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;

  &.success {
    background: #f6ffed;
    color: #52c41a;
  }
  &.warning {
    background: #fffbe6;
    color: #faad14;
  }
  &.danger {
    background: #fff2f0;
    color: #ff4d4f;
  }
}


.selected-signer-name {
  display: inline-block;
  max-width: 260px;
  margin-left: 10px;
  color: $text-primary;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.signer-picker-query {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 12px;
  margin-bottom: 16px;
}

.signer-picker-query :deep(.el-form-item) {
  margin-bottom: 0;
}

.signer-picker-query :deep(.el-input),
.signer-picker-query :deep(.el-select) {
  width: 210px;
}

.signer-picker :deep(.el-table__row) {
  cursor: pointer;
}

.signer-picker :deep(.is-selected-signer) td {
  background: #f0f7ff !important;
}

.signer-picker-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 16px;
  color: $text-secondary;
}

.signer-picker-footer :deep(.el-pagination) {
  margin-left: auto;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.selected-signer-summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: -8px 0 16px 140px;
  color: $text-secondary;
  font-size: 12px;
  overflow-wrap: anywhere;
}

.encrypt-cert-upload {
.upload-format-tip {
  margin-top: 6px;
  color: $text-secondary;
  font-size: 12px;
}

  width: 90%;
  max-width: 100%;
}

.text-secondary {
  font-size: 13px;
  color: $text-secondary;
  word-break: break-all;
}

.apply-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.apply-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;

  &.pending {
    color: #ff4d4f;
  }
  &.issued {
    color: #52c41a;
  }
}

.apply-cert-form {
  :deep(> .el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-textarea) {
    width: 90%;
    max-width: 100%;
  }
}

.import-encrypt-form {
  :deep(.el-input) {
    width: 90%;
    max-width: 100%;
  }
}

.apply-dn-cn-wrap {
  width: 90%;
  max-width: 100%;
}

.apply-dn-cn-tip {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: $text-secondary;
}

.apply-dn-custom-hint {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: $text-secondary;
}

.apply-dn-cn-item {
  :deep(.el-form-item__content) {
    align-items: flex-start;
  }
}

.apply-dn-subject-preview-item {
  :deep(.el-form-item__content) {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
  }
}

.apply-dn-subject-preview {
  flex: 1;
  min-width: 0;
  font-size: var(--el-font-size-base);
  line-height: 22px;
  word-break: break-all;
  font-family: inherit;
  color: var(--el-text-color-primary);

  &.is-placeholder {
    color: var(--el-text-color-secondary);
  }
}
.cert-manage {
  padding: 0 2px 24px;

  .cert-page-title {
    margin: 0 0 24px;
    font-size: 28px;
    line-height: 1.2;
    font-weight: 500;
    color: #1f2937;
  }

  .cert-page-tabs :deep(.el-tabs__header) {
    margin-bottom: 16px;
  }

  .cert-page-tabs :deep(.el-tabs__item) {
    display: inline-flex;
    align-items: center;
    height: 44px;
    padding: 0 22px !important;
    font-size: 16px !important;
    color: #4b5563;
  }

  .cert-tab-label {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .cert-tab-new {
    height: 18px;
    padding: 0 5px;
    line-height: 16px;
  }

  .cert-page-tabs :deep(.el-tabs__item.is-active) {
    color: #3478f6 !important;
  }

  :deep(.el-button) {
    --el-button-border-radius: 0;
    --el-button-text-color: #387ee8;
    --el-button-border-color: #387ee8;
    --el-button-hover-text-color: #387ee8;
    --el-button-hover-border-color: #387ee8;
    border-radius: 0 !important;
  }

  :deep(.el-button.is-link.el-button--primary) {
    --el-button-text-color: #387ee8;
    --el-button-bg-color: transparent;
    --el-button-border-color: transparent;
    --el-button-hover-text-color: #2769cf;
    --el-button-hover-bg-color: transparent;
    --el-button-hover-border-color: transparent;
    --el-button-active-text-color: #2769cf;
    --el-button-active-bg-color: transparent;
    --el-button-active-border-color: transparent;
  }
  :deep(.el-button--primary) {
    --el-button-text-color: #fff;
    --el-button-bg-color: #387ee8;
    --el-button-border-color: #387ee8;
    --el-button-hover-text-color: #fff;
    --el-button-hover-bg-color: #5592ef;
    --el-button-hover-border-color: #5592ef;
    --el-button-active-bg-color: #2769cf;
    --el-button-active-border-color: #2769cf;
  }

  :global(.cert-manage-dialog) {
    --el-color-primary: #387ee8;
    --el-border-radius-base: 0;
  }

  :global(.cert-manage-dialog .el-button) {
    --el-button-border-radius: 0;
    --el-button-text-color: #387ee8;
    --el-button-border-color: #387ee8;
    --el-button-hover-text-color: #387ee8;
    --el-button-hover-border-color: #387ee8;
    border-radius: 0 !important;
  }

  :global(.cert-manage-dialog .el-button.is-link.el-button--primary) {
    --el-button-text-color: #387ee8;
    --el-button-bg-color: transparent;
    --el-button-border-color: transparent;
    --el-button-hover-text-color: #2769cf;
    --el-button-hover-bg-color: transparent;
    --el-button-hover-border-color: transparent;
  }
  :global(.cert-manage-dialog .el-button--primary) {
    --el-button-text-color: #fff;
    --el-button-bg-color: #387ee8;
    --el-button-border-color: #387ee8;
    --el-button-hover-text-color: #fff;
    --el-button-hover-bg-color: #5592ef;
    --el-button-hover-border-color: #5592ef;
  }

  :global(.cert-manage-popover .el-button) {
    --el-button-border-radius: 0;
    --el-button-text-color: #fff;
    --el-button-bg-color: #387ee8;
    --el-button-border-color: #387ee8;
    border-radius: 0 !important;
  }
  .cert-search-form {
    row-gap: 6px;
  }

  .cert-search-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 6px;
  }

  .search-area, .action-bar, .cert-page-tabs :deep(.el-table) {
    background: #fff;
    border: 1px solid #edf0f5;
    box-shadow: 0 2px 8px rgba(31, 41, 55, .06);
  }

  .search-area {
    padding: 16px 24px 12px;
    border-radius: 2px;
    margin-bottom: 16px;
  }

  .action-bar {
    padding: 20px 28px;
    margin-bottom: 0;
    border-bottom: 0;
    border-radius: 2px 2px 0 0;
  }

  .cert-page-tabs :deep(.el-table) {
    border-radius: 0 0 2px 2px;
    border-top: 0;
  }

  .cert-page-tabs :deep(.el-table th.el-table__cell) {
    height: 56px;
    background: #f5f6f8 !important;
    color: #5b6472;
    font-weight: 500;
  }

  .cert-page-tabs :deep(.el-table td.el-table__cell) {
    height: 74px;
    color: #303846;
  }

  .pagination {
    padding: 16px 4px 0;
    margin-top: 0;
  }
}

  .export-cert-form :deep(.el-select) {
    width: 100%;
  }
  .update-cert-form :deep(.el-form-item) {
    margin-bottom: 24px;
  }

  .update-cert-warning {
    margin: 0;
    line-height: 1.6;
    color: var(--el-text-color-regular);
  }

  .update-cert-warning-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 14px;
  }
  .update-auth-body {
    padding: 4px 0 20px;
  }

  .update-auth-label {
    margin-bottom: 18px;
    color: var(--el-text-color-regular);
  }
</style>
