import { ref } from 'vue'

/**
 * 证书管理「证书管理」Tab 列表同源数据（原型；联调时改为接口/Store）。
 * 与 src/views/cert/CertManage.vue 列表字段一致。
 */
const INITIAL_CERT_MANAGE_ROWS = [
  {
    id: 'cert-demo-1',
    appId: 'APP-001',
    appCertName: 'SM2_SIGN',
    keyNumber: '1778491963875301',
    algorithm: 'SM2',
    algorithmDisplay: 'SM3WithSM2',
    issuer: 'C=CN,ST=guangdong,L=shenzhen,O=myibc.net,OU=IT Dept,CN=Demo CA',
    subjectDn: '/C=CN/ST=guangdong/O=myibc.net/OU=Sign/CN=sign.demo',
    subject: 'CN=sign.demo, OU=Sign, O=myibc.net, ST=guangdong, C=CN',
    serialNumber: '01399a',
    certType: '签名证书',
    category: '签名证书',
    version: 'V3',
    status: '生效中',
    notBefore: '2021-01-01 08:00:00',
    notAfter: '2040-01-01 08:00:00'
  },
  {
    id: 'cert-demo-2',
    appId: 'APP-2026-002',
    appCertName: '应用加密证书-B',
    keyNumber: '1763124100123456',
    algorithm: 'SM2',
    algorithmDisplay: 'SM3WithSM2',
    issuer: 'C=CN,ST=Guangdong,L=Shenzhen,O=演示CA,CN=Test CA',
    subjectDn: '/C=CN/ST=GuangDong/L=Shenzhen/O=演示单位/CN=app-enc-b',
    subject: 'CN=app-enc-b, O=演示单位, L=Shenzhen, ST=GuangDong, C=CN',
    serialNumber: '2E8D1C4A9900',
    certType: '加密证书',
    category: '加密证书',
    version: 'V3',
    status: '即将过期',
    notBefore: '2024-01-10 08:00:00',
    notAfter: '2026-06-10 23:59:59'
  }
]

const allCerts = ref(INITIAL_CERT_MANAGE_ROWS.map((row) => ({ ...row })))

/** 供证书选择弹窗等复用：补齐 certName / keyCode 别名 */
export function mapCertsForPicker (rows) {
  return (rows || []).map((row) => ({
    ...row,
    certName: row.appCertName ?? row.certName,
    keyCode: row.keyNumber ?? row.keyCode
  }))
}

export function useCertManagePool () {
  return { allCerts }
}
