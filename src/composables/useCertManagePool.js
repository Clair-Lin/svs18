import { ref } from 'vue'

/**
 * 证书管理「证书管理」Tab 列表同源数据（原型；联调时改为接口/Store）。
 * 与 src/views/cert/CertManage.vue 列表字段一致。
 */
const INITIAL_CERT_MANAGE_ROWS = [
  {
    id: 'cert-demo-1',
    appId: 'APP-001',
    createdAt: '2026-10-15 17:50:25',
    appCertName: 'SM2_SIGN',
    keyNumber: '1778491963875301',
    keyIndex: 689,
    algorithm: 'SM2',
    algorithmDisplay: 'SM3WithSM2',
    issuer: 'C=CN,ST=guangdong,L=shenzhen,O=myibc.net,OU=IT Dept,CN=Demo CA',
    subjectDn: '/C=CN/ST=guangdong/O=myibc.net/OU=Sign/CN=sign.demo',
    subject: 'CN=sign.demo, OU=Sign, O=myibc.net, ST=guangdong, C=CN',
    serialNumber: '01399a',
    certType: '双证书',
    category: '双证书',
    version: 'V3',
    status: '生效中',
    notBefore: '2021-01-01 08:00:00',
    notAfter: '2040-01-01 08:00:00',
    certificatePem: '-----BEGIN CERTIFICATE-----\\nU1ZTIFNJR04gREVNTyBDRVJUSUZJQ0FURQ==\\n-----END CERTIFICATE-----',
    encryptionCert: {
      id: 'cert-demo-1-enc',
      appCertName: 'SM2_ENCRYPT',
      keyIndex: 301,
      algorithm: 'SM2',
      issuer: 'C=CN,ST=guangdong,L=shenzhen,O=myibc.net,OU=IT Dept,CN=Demo CA',
      subjectDn: '/C=CN/ST=guangdong/O=myibc.net/OU=Sign/CN=sign.demo',
      subject: 'CN=sign.demo, OU=Sign, O=myibc.net, ST=guangdong, C=CN',
      serialNumber: '0139ab',
      status: '生效中',
      notBefore: '2021-01-01 08:00:00',
      notAfter: '2040-01-01 08:00:00',
      certificatePem: '-----BEGIN CERTIFICATE-----\\nU1ZTIEVOQ1JZUFRJT04gREVNTyBDRVJUSUZJQ0FURQ==\\n-----END CERTIFICATE-----'
    }
  },
  {
    id: 'cert-demo-2',
    appId: 'APP-2026-002',
    createdAt: '2026-10-24 13:42:18',
    appCertName: 'SM2_SIGN_PENDING',
    keyNumber: '1763124100123456',
    keyIndex: 101,
    algorithm: 'SM2',
    algorithmDisplay: 'SM3WithSM2',
    issuer: 'C=CN,ST=Guangdong,L=Shenzhen,O=演示CA,CN=Test CA',
    subjectDn: '/C=CN/ST=GuangDong/L=Shenzhen/O=演示单位/CN=app-sign-b',
    subject: 'CN=app-sign-b, O=演示单位, L=Shenzhen, ST=GuangDong, C=CN',
    serialNumber: '2E8D1C4A9900',
    certType: '签名证书',
    category: '签名证书',
    version: 'V3',
    status: '即将过期',
    notBefore: '2024-01-10 08:00:00',
    notAfter: '2026-12-10 23:59:59',
  },
  {
    id: 'cert-demo-unbound', appId: 'APP-2026-009', createdAt: '2026-10-21 11:25:00', appCertName: 'SM2_SIGN_UNBOUND',
    keyNumber: '1778491963875301', keyIndex: 689, algorithm: 'SM2', algorithmDisplay: 'SM3WithSM2',
    issuer: 'CN=Demo CA,O=Example,C=CN', subjectDn: '/C=CN/O=Example/CN=unbound-sign', subject: 'CN=unbound-sign, O=Example, C=CN',
    serialNumber: 'SM2-S-0009', certType: '签名证书', category: '签名证书', version: 'V3', status: '待关联',
    notBefore: '2026-01-01 00:00:00', notAfter: '2028-01-01 00:00:00',
    certificatePem: '-----BEGIN CERTIFICATE-----\\nU01fU0lHTl9VTkJPVU5E\n-----END CERTIFICATE-----'
  },  {
    id: 'cert-demo-rsa', appId: 'APP-2026-003', createdAt: '2026-10-20 10:20:30', appCertName: 'RSA_SIGN_ACTIVE',
    keyNumber: '1792653729974901', keyIndex: 690, algorithm: 'RSA', algorithmDisplay: 'SHA256WithRSA',
    issuer: 'CN=Demo RSA CA,O=Example,C=CN', subjectDn: '/C=CN/O=Example/CN=rsa-active', subject: 'CN=rsa-active, O=Example, C=CN',
    serialNumber: 'RSA-2026-0003', certType: '签名证书', category: '签名证书', version: 'V3', status: '生效中',
    notBefore: '2026-01-01 00:00:00', notAfter: '2028-01-01 00:00:00',
    certificatePem: '-----BEGIN CERTIFICATE-----\\nUlNBIFNJR04gREVNTyBDRVJUSUZJQ0FURQ==\\n-----END CERTIFICATE-----'
  },
  {
    id: 'cert-demo-pqc-ml-dsa', appId: 'APP-2026-004', createdAt: '2026-10-19 09:15:00', appCertName: 'PQC_ML_DSA_65_SIGN',
    keyNumber: '1763200300666004', keyIndex: 106, algorithm: 'ML_DSA_65', algorithmDisplay: 'ML_DSA_65',
    issuer: 'CN=Demo PQC CA,O=Example,C=CN', subjectDn: '/C=CN/O=Example/CN=pqc-ml-dsa-65', subject: 'CN=pqc-ml-dsa-65, O=Example, C=CN',
    serialNumber: 'PQC-ML65-0004', certType: '签名证书', category: '签名证书', version: 'V3', status: '生效中',
    notBefore: '2026-02-01 00:00:00', notAfter: '2031-02-01 00:00:00',
    certificatePem: '-----BEGIN CERTIFICATE-----\\nUFEgTUxfRFNBXzY1IERFTU8=\\n-----END CERTIFICATE-----'
  },
  {
    id: 'cert-demo-pqc-slh', appId: 'APP-2026-005', createdAt: '2026-10-18 08:00:00', appCertName: 'PQC_SLH_DSA_192F_EXPIRED',
    keyNumber: '1792689986659501', keyIndex: 692, algorithm: 'SLH_DSA_SHA2_192f', algorithmDisplay: 'SLH_DSA_SHA2_192f',
    issuer: 'CN=Demo PQC CA,O=Example,C=CN', subjectDn: '/C=CN/O=Example/CN=pqc-slh-192f', subject: 'CN=pqc-slh-192f, O=Example, C=CN',
    serialNumber: 'PQC-SLH-0005', certType: '签名证书', category: '签名证书', version: 'V3', status: '已过期',
    notBefore: '2023-01-01 00:00:00', notAfter: '2025-01-01 00:00:00',
    certificatePem: '-----BEGIN CERTIFICATE-----\\nUFEgU0xIX0RTQV8xOTJmIERFTU8=\\n-----END CERTIFICATE-----'
  },
  {
    id: 'cert-demo-dual-sign-expired', appId: 'APP-2026-006', createdAt: '2026-10-17 12:30:00', appCertName: 'SM2_DUAL_SIGN_EXPIRED',
    keyNumber: '1763124100123456', keyIndex: 101, algorithm: 'SM2', algorithmDisplay: 'SM3WithSM2',
    issuer: 'CN=Demo CA,O=Example,C=CN', subjectDn: '/C=CN/O=Example/CN=dual-sign-expired', subject: 'CN=dual-sign-expired, O=Example, C=CN',
    serialNumber: 'DUAL-S-0006', certType: '双证书', category: '双证书', version: 'V3', status: '已过期',
    notBefore: '2023-01-01 00:00:00', notAfter: '2025-01-01 00:00:00',
    certificatePem: '-----BEGIN CERTIFICATE-----\\nRFVBT CBTSUdOIEVYUElSRUQ=\\n-----END CERTIFICATE-----',
    encryptionCert: { id: 'cert-demo-dual-sign-expired-enc', appCertName: 'SM2_DUAL_ENCRYPT_ACTIVE', keyIndex: 311, algorithm: 'SM2', algorithmDisplay: 'SM3WithSM2', issuer: 'CN=Demo CA,O=Example,C=CN', subjectDn: '/C=CN/O=Example/CN=dual-sign-expired', subject: 'CN=dual-sign-expired, O=Example, C=CN', serialNumber: 'DUAL-E-0006', status: '生效中', notBefore: '2024-01-01 00:00:00', notAfter: '2028-01-01 00:00:00', certificatePem: '-----BEGIN CERTIFICATE-----\\nRFVBT CBFTkNSWVBUIEFDVElWRQ==\\n-----END CERTIFICATE-----' }
  },
  {
    id: 'cert-demo-dual-encrypt-expired', appId: 'APP-2026-007', createdAt: '2026-10-16 11:15:00', appCertName: 'SM2_DUAL_SIGN_ACTIVE',
    keyNumber: '1778491963875301', keyIndex: 689, algorithm: 'SM2', algorithmDisplay: 'SM3WithSM2',
    issuer: 'CN=Demo CA,O=Example,C=CN', subjectDn: '/C=CN/O=Example/CN=dual-encrypt-expired', subject: 'CN=dual-encrypt-expired, O=Example, C=CN',
    serialNumber: 'DUAL-S-0007', certType: '双证书', category: '双证书', version: 'V3', status: '生效中',
    notBefore: '2024-01-01 00:00:00', notAfter: '2028-01-01 00:00:00',
    certificatePem: '-----BEGIN CERTIFICATE-----\\nRFVBT CBTSUdOIEFDVElWRQ==\\n-----END CERTIFICATE-----',
    encryptionCert: { id: 'cert-demo-dual-encrypt-expired-enc', appCertName: 'SM2_DUAL_ENCRYPT_EXPIRED', keyIndex: 312, algorithm: 'SM2', algorithmDisplay: 'SM3WithSM2', issuer: 'CN=Demo CA,O=Example,C=CN', subjectDn: '/C=CN/O=Example/CN=dual-encrypt-expired', subject: 'CN=dual-encrypt-expired, O=Example, C=CN', serialNumber: 'DUAL-E-0007', status: '已过期', notBefore: '2022-01-01 00:00:00', notAfter: '2025-01-01 00:00:00', certificatePem: '-----BEGIN CERTIFICATE-----\\nRFVBT CBFTkNSWVBUIEVYUElSRUQ=\\n-----END CERTIFICATE-----' }
  },
  {
    id: 'cert-demo-dual-abnormal', appId: 'APP-2026-008', createdAt: '2026-10-15 16:00:00', appCertName: 'SM2_DUAL_ABNORMAL',
    keyNumber: '1778491963875301', keyIndex: 689, algorithm: 'SM2', algorithmDisplay: 'SM3WithSM2',
    issuer: 'CN=Demo CA,O=Example,C=CN', subjectDn: '/C=CN/O=Example/CN=dual-abnormal', subject: 'CN=dual-abnormal, O=Example, C=CN',
    serialNumber: 'DUAL-S-0008', certType: '双证书', category: '双证书', version: 'V3', status: '异常',
    notBefore: '2025-01-01 00:00:00', notAfter: '2028-01-01 00:00:00', validationError: 'CA 双证配组校验失败',
    certificatePem: '-----BEGIN CERTIFICATE-----\\nRFVBT CBTSUdOIEFCTk9STUF M Q==\\n-----END CERTIFICATE-----',
    encryptionCert: { id: 'cert-demo-dual-abnormal-enc', appCertName: 'SM2_DUAL_ABNORMAL_ENCRYPT', keyIndex: 313, algorithm: 'SM2', algorithmDisplay: 'SM3WithSM2', issuer: 'CN=Demo CA,O=Example,C=CN', subjectDn: '/C=CN/O=Example/CN=dual-abnormal', subject: 'CN=dual-abnormal, O=Example, C=CN', serialNumber: 'DUAL-E-0008', status: '异常', notBefore: '2025-01-01 00:00:00', notAfter: '2028-01-01 00:00:00', certificatePem: '-----BEGIN CERTIFICATE-----\\nRFVBT CBFTkNSWVBUIEFCTk9STUF M Q==\\n-----END CERTIFICATE-----' }
  },

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
