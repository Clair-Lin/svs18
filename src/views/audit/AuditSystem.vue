<template>
  <section class="welcome-page">
    <div class="welcome-copy">
      <h1>欢迎使用签名验签服务器</h1>
      <div class="info-card">
        <h2>产品授权</h2>
        <div class="info-grid"><span>客户名称&nbsp;&nbsp;--</span><span>许可证类别&nbsp;&nbsp;--</span><span>签发日期&nbsp;&nbsp;--</span><span>失效日期&nbsp;&nbsp;--</span></div>
      </div>
      <div class="info-card module-card">
        <h2>模块版本</h2>
        <div class="info-grid"><span>核心固件版本：3.1.1.1</span><span>系统版本：amd64 4.19.0-91.82.179.3.el7.centos.x86_64</span></div>
      </div>
    </div>
    <div class="welcome-art"><img src="/audit-welcome.svg" alt="签名验签服务器" /><div>WELCOME</div></div>
  </section>
</template>

<style scoped>
.welcome-page { min-height: calc(100vh - 112px); background: #fff; display: flex; align-items: center; padding: 64px 52px 70px; gap: 58px; overflow: hidden; }
.welcome-copy { flex: 1; min-width: 0; max-width: 700px; padding-left: 0; }
h1 { margin: 0 0 52px; color: #202b3a; font-size: 31px; line-height: 1.25; letter-spacing: 8px; font-weight: 700; white-space: nowrap; }
.info-card { width: 100%; min-height: 164px; background: #f5f6f8; padding: 22px 38px 25px; margin-bottom: 36px; }
.info-card h2 { margin: 0 0 22px; color: #9aa1aa; font-size: 20px; font-weight: 600; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; column-gap: 42px; row-gap: 14px; color: #111820; font-size: 16px; line-height: 1.4; }
.module-card .info-grid { align-items: start; }.module-card .info-grid span:last-child { word-break: break-word; }
.welcome-art { flex: 1; min-width: 450px; max-width: 680px; text-align: center; color: #686868; font-family: Arial, sans-serif; font-size: 74px; font-weight: 700; letter-spacing: 2px; }
.welcome-art img { width: 100%; max-width: 660px; display: block; margin: 0 auto 8px; }
@media (max-width: 1000px) { .welcome-page { padding: 40px 28px; gap: 24px; }.welcome-art { min-width: 360px; font-size: 54px; } h1 { font-size: 24px; letter-spacing: 4px; }.info-card { padding-left: 24px; padding-right: 24px; } }
@media (max-width: 720px) { .welcome-page { display: block; padding: 28px 18px; }.welcome-copy { max-width: none; }.welcome-art { min-width: 0; margin-top: 32px; }.welcome-art img { max-width: 500px; } h1 { white-space: normal; margin-bottom: 28px; }.info-grid { grid-template-columns: 1fr; } }
</style>