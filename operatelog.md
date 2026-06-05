# 操作日志

## 2026-06-05（GitHub · 推送 SVS_1.9.0）

- 提交 `315d8b5` 并推送至 `origin/SVS_1.9.0`：系统配置关闭风险提示、0019 不可导出禁止备份、界面功能说明文档更新。
- **`docs/GitHub推送说明.md`**：§3 / §6 追加本次推送摘要。

## 2026-06-05（密钥管理 · 通用密码容器不可导出禁止备份）

- **`src/constants/gmt0019.js`**：新增 `isContainerKeyExportable`（`uiExportFlag === 1` 时可导出/备份）。
- **`src/views/key/KeyManage0019Panel.vue`**：生成容器时 **是否可导出** 为 **否** 的记录，列表 **备份** 按钮禁用并悬浮提示；点击时拦截并提示不可备份。
- **`src/views/key/KeyManageSecurityModals.vue`**：`openUkeyBackup` 对 0019 不可导出容器二次拦截。
- **`docs/界面功能说明.md`**、**`docs/密钥管理-用户操作流程.md`**：补充不可导出容器禁止备份说明。

## 2026-06-05（系统配置 · 接口鉴权 / 证书校验关闭风险提示）

- **`src/views/system/general/SystemApiAuthConfig.vue`**：**系统级接口鉴权** 开关关闭前弹出 **风险提示** 确认框（`before-change`），说明未授权访问风险；取消则保持启用。
- **`src/views/system/general/SystemCertValidationConfig.vue`**：**证书合法性校验** 开关关闭前同样弹出 **风险提示** 确认框，说明 CA 有效期、证书链、吊销列表等校验将被关闭的风险。
- **`docs/界面功能说明.md`**：7.1 / 7.2 补充关闭开关时的风险提示交互说明。

## 2026-06-05（文档 · 界面功能说明 · 仅侧栏「新」菜单）

- **`docs/界面功能说明.md`**：范围收窄为**仅侧栏菜单项**标「新」的 7 个模块（密钥管理、接口管理、路由配置、SNMP、Syslog、检测中心、系统配置）；移除页内 Tab/按钮「新」角标说明及 GitHub 推送等非必要引用；章节与侧栏一一对应。

## 2026-06-05（文档 · 界面功能说明 · 标「新」菜单操作流程）

- **`docs/界面功能说明.md`**：按侧栏标 **「新」** 角标菜单重写使用者操作流程；覆盖密钥管理、网络配置、SNMP/Syslog、检测中心、系统配置；移除非「新」模块章节。

## 2026-06-03（设备自检 · 自检项目与判定文案）

- **`src/utils/inspectCenter.js`**：按规范调整设备自检项目共 **13 项**——国密 **SM2/SM3/SM4**；国际 **RSA/3DES/AES**；**存储密钥和数据完整性自检**、**内置密码卡状态自检**；系统资源 **NTP、网络、硬盘、内存、CPU**。移除随机数质量自检、SM1 算法自检。
- 分类分组：国密算法、国际算法、数据与密钥、硬件、系统资源。

## 2026-06-03（设备自检 · 检测详情文案简化）

- **`src/utils/inspectCenter.js`**：检测详情/异常说明恢复为简短原型描述（如「SM2 算法自检通过」「网络: ens192 (running)」），不再展开规范中的检查要求与判定标准全文。

## 2026-06-03（设备自检 · 历史记录迁移）

- **`src/utils/inspectCenter.js`**：新增 `migrateDeviceInspectHistoryIfNeeded`（schema v2）；进入设备自检页时自动将 localStorage 中已有记录更新为 **13 项**检测项与当前简短详情，保留同名项原正常/异常状态，移除随机数/SM1，补齐 RSA/3DES/AES/NTP；并重算通过数、失败数与分类汇总。

## 2026-06-03（设备自检 · NTP 详情显示时间偏差）

- **`src/utils/inspectCenter.js`**：NTP 检测详情展示 **设备时间与NTP服务器时间偏差**（正常 1–5 秒，异常 6–30 秒）；schema 升至 **v3**，历史记录进入页面时自动刷新 NTP 详情文案。

## 2026-06-03（设备自检 · 移除密钥完整性项与精简内存详情）

- **`src/utils/inspectCenter.js`**：移除 **存储密钥和数据完整性自检**；设备自检共 **12 项**；内存详情仅显示 **已用 / 总共**（如 `内存: 已用 2777 MB / 总共 3728 MB`）；schema **v4** 自动迁移历史记录。

## 2026-06-03（设备自检 · 增加 SHA 算法自检）

- **`src/utils/inspectCenter.js`**：国际算法分类新增 **SHA算法自检**；设备自检共 **13 项**；schema **v5** 自动为历史记录补齐该项。

## 2026-05-29（文档 · GitHub 推送说明 · 补充更新约定）

- **`docs/GitHub推送说明.md`**：新增 **§2.4 推送后同步更新本文档**；摘要与相关文档索引同步；顶栏版本号改为 **1.9.0**（`Header.vue`）；0029 列表「密钥算法」列宽 150px。

## 2026-05-29（文档 · GitHub 推送说明）

- **`docs/GitHub推送说明.md`**（新）：GitHub 远程/分支、标准推送流程、SVS_1.9.0 近期推送摘要及相关文档索引。

## 2026-05-29（密钥管理 · 移除列表密钥类型列）

- **`KeyManage0029Panel.vue`**：0029 密钥列表移除 **密钥类型** 列；生成密钥与详情弹窗仍保留密钥类型相关展示。
- **`docs/密钥管理-用户操作流程.md`**：同步列表列与对照表说明。

## 2026-05-29（密钥管理 · SM9 密钥用途）

- **`KeyManage0029Panel.vue`**：SM9 三类密钥（主密钥 / 标识密钥 / 分片主密钥）密钥用途统一为 **签名验签**；移除筛选项「SM9短签名」；演示数据同步更新。

## 2026-05-29（密钥管理 · IBC 分组标题修复）

- **`KeyManage0029Panel.vue`**：撤销无效的 `#title` 插槽（会导致 `label` 为空时标题消失）；**IBC体系密钥** 改为独立 `el-option-group` 并始终绑定 `label`；通过 `key-type-ibc-group` + `popper-class` 在标题旁渲染 **V1.9.1** 角标。

## 2026-05-29（密钥管理 · IBC 分组 V1.9.1 角标）

- **`KeyManage0029Panel.vue`**：生成密钥「密钥类型」下拉 **IBC体系密钥** 分组标题改用 `el-option-group` 的 `#title` 插槽，在标题旁渲染红色 **V1.9.1** `el-tag`（替代此前无效的 CSS 伪元素方案）。

## 2026-05-29（界面 · V1.9.1 版本角标 · 修正）

- **`KeyManage0029Panel.vue`**：修复 IBC 分组标题丢失——恢复 `el-option-group` 的 `label` 绑定；**IBC体系密钥** 分组标题旁显示 **V1.9.1**（`popper-class` 样式）；选中 SM9 类型时表单项「密钥类型」标签由「新」切换为 **V1.9.1**。
- **`HaManage.vue`**：撤销页内 Tab 上的 V1.9.1 角标（恢复纯文本「高可用配置」）。
- **`Sidebar.vue`**：侧栏 **高可用配置** 菜单角标由「新」改为 **V1.9.1**。
- **`docs/密钥管理-用户操作流程.md`**：同步 SM9 分组与高可用侧栏菜单标注说明。

## 2026-05-29（界面 · V1.9.1 版本角标）

- **`KeyManage.vue`**：**通用密码容器** Tab 角标由「新」改为 **V1.9.1**。
- **`HaManage.vue`**：页内 Tab 曾误加 V1.9.1（已在「修正」条目中撤销）。
- **`docs/密钥管理-用户操作流程.md`**：同步 SM9 分组与通用密码容器 Tab 的 V1.9.1 标注说明。

## 2026-05-29（密钥管理 · 用户操作流程文档）

- **`docs/密钥管理-用户操作流程.md`**：对齐 1.8.0 新界面更新文档——侧栏/Tab/「生成密钥」与「密钥类型」的 **新** 角标说明；0029 筛选（SM9、PQC）、列表「密钥类型」列、分组密钥类型生成流程（PKI/对称/IBC/PQC）及详情字段；0019「是否可导出」、UKEY 导入容器、精简行内操作；共用安全流程与对照表、原型限制及修订记录。

## 2026-05-28（设备自检详情 · 导出检测报告）

- **`DeviceInspectDetail.vue`**：标题栏增加 **导出检测报告** 按钮。
- **`inspectCenter.js`**：新增 `buildDeviceInspectReportText`、`downloadDeviceInspectReport`，按当次记录生成并下载 `.txt` 报告（含基本信息与分类检测明细）。

## 2026-05-28（检测中心 · 修复无法进入）

- **`ServiceDetectPanel.vue`**：移除对不存在的 `InspectDetailContent.vue`、`mapServiceResultsToDetailItems` 的引用，恢复使用 `InspectResultsPanel`，修复检测中心菜单点击后白屏/无响应。

## 2026-05-28（检测中心 · 清理废弃面板）

- **删除** `InspectSchedulePanel.vue`、`InspectHistoryPanel.vue`：功能已并入 `DeviceInspectPanel.vue`，无代码引用，删除不影响现有界面。
- **`README.md`**：检测中心说明与路由表同步为当前两页签结构。

## 2026-05-28（设备自检 · 系统资源检测项）

- **`inspectCenter.js`**：移除笼统「设备自检」项；新增 **网络、硬盘、内存、CPU** 四项（`system-resource` 分类），检测详情按设计稿展示具体指标；各算法/硬件项补充对应详情文案。

## 2026-05-28（设备自检 · 列表两端到边修复）

- **`InspectCenter.vue`**：设备自检页签时 `page-card--list-flush` 取消卡片左右内边距，Tab 头保留内边距；解除 `el-tab-pane` 裁剪。
- **`DeviceInspectPanel.vue`**：筛选/按钮区单独内边距；表格 `width:100%` + `table-layout:fixed` 四列等分铺满；移除无效负边距方案。

## 2026-05-28（设备自检 · 列表/详情/自动检测整合）

- **`DeviceInspectPanel.vue`**：整合原「设备自检」「定时策略」「执行记录」为单页——筛选（检测类型/结果/时间）、**立即检测**、**自动检测**、记录表格与分页；检测完成后写入记录并跳转详情。
- **`DeviceInspectDetail.vue`**（新）：设备自检详情页——基本信息（自检时间、检测类型、检测结果）+ 检测内容表格（序号/检测项/状态/检测详情/异常说明）；返回至设备自检列表。
- **`InspectCenter.vue`**：移除「定时策略」「执行记录」页签，仅保留「业务检测」「设备自检」；`?tab=schedule|history` 重定向至设备自检。
- **`inspectCenter.js`**：自动检测策略改为间隔频率（数值 + 分钟/小时/天）；新增 `detectTypeLabel`、`overallResultLabel`、`filterDeviceHistory`、`seedDeviceInspectHistoryIfEmpty` 等；演示记录种子数据。
- **`router/index.js`**：新增 `/system/inspect/device-detail` 详情路由。

## 2026-05-27（设备自检 · 自检项目提示）

- **`DeviceInspectPanel.vue`**：移除内置密码卡只读状态条；改为 **info** 提示框单行展示全部自检项目（顿号分隔）。

## 2026-05-27（检测中心 · 简化检测范围与详情弹窗）

- **`ServiceDetectPanel.vue`**：移除检测范围选择，仅保留服务接口检测（证书 + 开始检测）。
- **`DeviceInspectPanel.vue`**：移除自检范围/自定义勾选项，固定执行全部 8 项自检。
- **`InspectSchedulePanel.vue`**：移除定时策略中的自检范围配置（固定全部项）。
- **`InspectHistoryPanel.vue`**：执行记录详情由侧栏抽屉改为 **居中 `el-dialog`**；范围列固定展示「服务接口」/「全部自检项」。

## 2026-05-27（检测中心 · 业务检测 / 设备自检 / 定时 / 记录）

- **`src/views/system/InspectCenter.vue`**（新）：检测中心 Tab 壳页——**业务检测**、**设备自检**、**定时策略**、**执行记录**；面包屑「系统管理 / 检测中心 / {页签}」；支持 `?tab=device|schedule|history`。
- **`src/views/system/inspect/ServiceDetectPanel.vue`**（新）：原一键检测服务接口部分；范围 **全部接口检测** / **服务接口检测**；**移除加密卡检测**；证书选择与结果展示；执行写入执行记录。
- **`src/views/system/inspect/DeviceInspectPanel.vue`**（新）：8 项设备自检（随机数、SM1–SM4、密钥完整性、内置密码卡、设备自检）；全部/自定义范围；结果按分类折叠；顶部只读展示上次密码卡自检结论。
- **`src/views/system/inspect/InspectSchedulePanel.vue`**（新）：定时设备自检策略（启用、每天/每周、时刻、范围）；失败告警开关占位；下次/上次执行展示。
- **`src/views/system/inspect/InspectHistoryPanel.vue`**（新）：执行记录列表、筛选、分页、详情抽屉。
- **`src/components/inspect/InspectResultsPanel.vue`**（新）：检测结果汇总卡与分类明细复用组件。
- **`src/utils/inspectCenter.js`**（新）：自检项定义、定时策略与历史 localStorage、演示结果生成。
- **`src/styles/inspect-results.scss`**、**`inspect-panel-config.scss`**（新）：检测/自检 UI 样式。
- **`src/router/index.js`**：`/system/inspect` 检测中心；`/system/detect` 重定向至 `?tab=service`。
- **`src/components/layout/Sidebar.vue`**：菜单「一键检测」改为 **检测中心**。

## 2026-05-27（集群 / 高可用 · 业务逻辑纠正）

- **`src/utils/systemCluster.js`**：授权码改为 32 位十六进制随机串，集群级 `authCode` 创建时生成；新增 `buildClusterDeviceRows`、节点角色判断辅助函数。
- **`src/views/system/ClusterConfig.vue`**：创建集群后展示/复制授权码；子节点加入校验 32 位授权码与中心一致；已建集群时可 **添加子节点**；子节点操作 **数据同步**（全量，状态：数据同步中→已同步）、**删除**（踢出集群）；中心节点 **授权码** 查看；修正加入逻辑（须已存在集群）。
- **`src/utils/systemHa.js`**：负载均衡策略默认 `wrr`，补充 rr/wrr/lc/wlc/lblc/lblcr/dh/sh 选项；移除持久化 `clusterDevices`。
- **`src/views/system/HaConfig.vue`**：集群设备信息列改为集群 IP、服务端口，数据源自集群管理节点列表；无数据时引导至集群配置 Tab。

## 2026-05-27（网络配置 · 独立父菜单与路由配置）

- **`src/components/layout/Sidebar.vue`**：**网络配置** 提升为与 **系统管理** 同级父菜单（位于系统管理上方），子菜单 **接口管理**、**路由配置**；从系统管理中移除原网络配置项。
- **`src/router/index.js`**：新增 `/network/interface`（接口管理）、`/network/route`（路由配置）；`/system/network` 重定向至接口管理。
- **`src/views/system/NetworkConfig.vue`**：面包屑改为「网络配置 / 接口管理 / {页签}」；路由路径改为 `/network/interface`。
- **`src/views/network/RouteConfig.vue`**（新）：路由配置列表——添加/批量删除、表格（IP类型、路由类型、目的路由、子网掩码、网关、网络接口、状态、操作）；系统路由不可选/不可编辑；分页；添加/编辑弹窗。
- **`src/utils/networkRoute.js`**（新）：路由数据读写及默认系统路由演示数据。

## 2026-05-27（高可用配置 · Tab 合并热备/集群）

- **`src/views/system/HaManage.vue`**（新）：高可用配置页签容器，含 **高可用配置**、**热备管理**、**集群配置** 三个 Tab；面包屑「系统管理 / 高可用配置 / {页签}」；支持 `?tab=hot-standby`、`?tab=cluster`。
- **`src/views/system/HaConfig.vue`**、**`HotStandbyManage.vue`**、**`ClusterConfig.vue`**：移除独立 `page-card` 外层，作为 Tab 子面板嵌入。
- **`src/router/index.js`**：`/system/ha` 指向 `HaManage`；原 `/system/hot-standby`、`/system/cluster` 重定向至对应 Tab。
- **`src/components/layout/Sidebar.vue`**：侧边栏仅保留 **高可用配置** 一项菜单。

## 2026-05-27（高可用配置 · 双机热备布局）

- **`src/views/system/HaConfig.vue`**：双机热备区按参考图调整——左侧分区标题（节点信息/绑定内外网网口/模式）+ 右侧灰色内容区；内外网绑定首行双列（网口 + 虚拟IP），次行虚拟路由ID及说明；外网虚拟IP 必填标识；集群设备信息改为同款左侧标题布局。

## 2026-05-27（系统管理 · 高可用 / 热备 / 集群）

- **`src/views/system/HaConfig.vue`**（新）：高可用配置——开关开启后可选类型（双机热备、集群内置/外置负载均衡）；双机热备含本机角色、节点信息、内外网绑定分组、抢占/非抢占模式及 VRID 联动；内置集群含网络/虚拟 IP/端口/协议/策略及集群设备表；应用/重置，`sessionStorage` 持久化。
- **`src/views/system/HotStandbyManage.vue`**（新）：热备管理——刷新按钮；表格列角色/节点ID/节点IP/加入时间/状态（初始化、数据同步中、活动、异常）及状态色点。
- **`src/views/system/ClusterConfig.vue`**（新）：集群配置——未建集群时「创建集群」「加入集群」；创建/加入弹窗表单；建集群后展示节点表、解散集群、授权码查看。
- **`src/utils/systemHa.js`**、**`systemHotStandby.js`**、**`systemCluster.js`**（新）：配置与节点数据读写。
- **`src/router/index.js`**：注册 `/system/ha`、`/system/hot-standby`、`/system/cluster`。
- **`src/components/layout/Sidebar.vue`**：系统管理下增加上述三项菜单。

## 2026-05-27（系统配置 · 证书校验开关与接口鉴权一致）

- **`src/views/system/general/SystemCertValidationConfig.vue`**：**启用证书合法性校验** 由 `el-checkbox` 改为 `el-switch`（`inline-prompt`，启用/关闭文案）；布局改用 `control-row`；保存方式改为点击 **保存配置** 按钮提交（与接口鉴权页签一致）；移除重置按钮及勾选即时保存逻辑；提示文案去掉「无需再点击下方提交按钮」说明。

## 2026-05-27（系统配置 · 鉴权方式问号位置）

- **`src/views/system/general/SystemApiAuthConfig.vue`**：鉴权方式项使用 `input-with-help` 布局，固定输入框宽度，问号图标紧跟输入框右侧显示。

## 2026-05-27（系统配置 · 接口鉴权提示改为悬浮展示）

- **`src/views/system/general/SystemApiAuthConfig.vue`**：系统级接口鉴权、鉴权方式、默认请求有效期三项说明由行内文字改为 `?` 图标悬浮提示（与证书校验配置一致）。

## 2026-05-27（系统配置 · 证书校验配置默认值与提示符光标）

- **`src/utils/systemCertValidation.js`**：**启用证书合法性校验** 默认改为开启（`enabled: true`）。
- **`src/views/system/general/SystemCertValidationConfig.vue`**：表单初始值同步为开启；提示符 `?` 悬停光标改为 `default`，不再显示问号样式鼠标。

## 2026-05-27（系统配置 · 证书校验配置按钮区样式）

- **`src/views/system/general/SystemCertValidationConfig.vue`**：提交/重置按钮区域上方增加分隔横线（`border-top`），与接口鉴权页签一致。

## 2026-05-27（系统管理 · 管理员管理 / 系统配置页签）

- **`src/views/system/AdminManage.vue`**：按图1调整——筛选栏查询/重置右对齐；**新增管理员**；表格增加多选列、**所属组织**列；演示数据为 `audit` / `app_admin` / `svssysadmin` 及对应角色与时间；`svssysadmin` 仅保留编辑、重置密码操作。
- **`src/views/system/SystemConfig.vue`**（新）：**系统配置** 页签容器，含 **接口鉴权**、**证书校验配置** 两个 Tab；面包屑「系统管理 / 系统配置 / {页签}」；支持 `?tab=cert-validation`。
- **`src/views/system/general/SystemCertValidationConfig.vue`**（新）：证书校验配置——**启用证书合法性校验** 复选框、问号悬浮提示（图3文案）、**提交/重置**；勾选变更即时保存（`sessionStorage`）。
- **`src/utils/systemCertValidation.js`**（新）：证书校验配置读写。
- **`src/views/system/general/SystemApiAuthConfig.vue`**：作为系统配置 Tab 子面板；说明标题改为 **系统配置**。
- **`src/components/layout/Sidebar.vue`**：**通用配置** 菜单改为 **系统配置**（`/system/config`）。
- **`src/router/index.js`**：注册 `/system/config`；`/system/general/api-auth` 重定向至系统配置接口鉴权页签。
- **`src/views/ApplicationDetail.vue`**：引导链接文案改为 **系统配置 → 接口鉴权**。

## 2026-05-25（界面布局 · 顶栏全宽 + 侧栏内容分栏）

- **`src/App.vue`**：布局改为 **上部顶栏全宽** + **下部左侧菜单 + 右侧内容**（原先为侧栏通栏、顶栏仅在右侧）。
- **`src/styles/global.scss`**：`layout-container` 改为纵向 flex；新增 `layout-body` 横向分栏；移除 `main-container`。
- **`src/components/layout/Sidebar.vue`**：高度由 `100vh` 改为 `100%`，适配下部区域高度。

## 2026-05-25（界面样式 · 顶部栏与侧边菜单）

- **`src/styles/variables.scss`**：主色改为 `#2d5af1`；侧边栏改为浅灰 `#f5f7fa`、选中态 `#e8eeff`；顶栏背景改为蓝色；补充侧边栏文字/边框色变量；侧边栏宽度调整为 220px。
- **`src/components/layout/Header.vue`**：顶栏改为蓝色背景；左侧 Logo +「签名验签服务器」+ 版本号 1.8.0；右侧「全屏」文字按钮与 `sys_admin` 用户下拉；移除原面包屑与折叠按钮。
- **`src/components/layout/Sidebar.vue`**：侧边栏改为浅色主题；移除顶部 Logo 区；菜单项深灰文字/图标、选中浅蓝底；底部增加「收起菜单」按钮；系统管理子项顺序与参考图对齐（白名单置于 NTP 前）。
- **`src/App.vue`**：面包屑移至主内容区顶部；侧边栏折叠事件改由 Sidebar 底部按钮触发。
- **`src/styles/global.scss`**：补充折叠菜单宽度样式。

## 2026-05-25（系统管理 · 权限/管理员/系统信息界面）

- **`src/views/system/Permission.vue`**：按图1改为筛选（角色名称、所属模块、状态）+ **新增角色** + 列表（角色名称、所属模块、角色描述、状态、禁用/详情）+ 分页；演示三条默认角色。
- **`src/views/system/AdminManage.vue`**：按图2改为筛选（账号、姓名、状态）+ **新增管理员** + 列表（账号、姓名、状态、角色、创建时间、操作）+ 分页；`log_admin` / `sys_admin` 演示数据及差异化操作项。
- **`src/views/system/SystemInfo.vue`**：按图3简化为 **设备名称**、**软件版本信息** 两行展示。

## 2026-05-25（系统管理 · NTP 时间源管理界面）

- **`src/views/system/NTPConfig.vue`**：按示意图改为表单页——**当前系统时间**（每秒刷新）、**时区**、**时间设置**（使用 PC 时间 / 与 NTP 服务器同步）、**本地时间** 或 **NTP 服务器**、**提交 / 重置**；配置写入 `sessionStorage`（原型）。

## 2026-05-25（系统管理 · 网络配置四页签）

- **`src/views/system/NetworkConfig.vue`**：网络配置改为 **网口配置 / 子网口 / 聚合接口 / VLAN** 四个 Tab；面包屑为「系统管理 / 网络配置 / {当前页签}」，支持 `?tab=sub|bond|vlan`。
- **`src/views/system/network/NetworkPortPanel.vue`**（新）：原网口配置内容迁入（不含用途列，界面逻辑不变）。
- **`src/views/system/network/NetworkSubInterfacePanel.vue`**（新）：子网口列表——子接口、归属主接口、IP、掩码、网口状态、状态、操作；**添加** 按钮；暂无数据。
- **`src/views/system/network/NetworkBondPanel.vue`**（新）：聚合接口——bond 名称/模式、绑定网口、IP、掩码、网关、状态、操作。
- **`src/views/system/network/NetworkVlanPanel.vue`**（新）：VLAN——VLAN ID、IP、掩码、网关、关联网口、禁/启用、操作。
- **`src/views/system/network/networkPanel.scss`**（新）：各 Tab 表格统一样式（表头灰、数据行白）。

## 2026-05-25（密钥管理 · 通用密码容器去掉销毁）

- **`src/views/key/KeyManage0019Panel.vue`**：0019 **通用密码容器** 列表操作移除 **销毁**；保留详情、备份、查看认证凭据。

## 2026-05-25（密钥管理 · PQC 用途文案）

- **`src/views/key/KeyManage0029Panel.vue`**：PQC 算法密钥用途由「签名」改为 **签名验签**；查询区去掉重复的「签名」筛选项。

## 2026-05-25（密钥管理 · 生成密钥弹窗宽度修正）

- **`src/views/key/KeyManage0029Panel.vue`**：移除生成/详情弹窗按 SM9、PQC 动态切换宽度（`640px`/`600px`）的逻辑，改为固定 **560px** / **520px**，避免选择 SM9 时弹窗突然变大。

## 2026-05-25（密钥管理 · PQC 算法与 SM9 用途样式）

- **`src/views/key/KeyManage0029Panel.vue`**：
  - SM9 **密钥用途** 改为与其它类型一致的 **单选 checkbox**（`SM9短签名`）。
  - 新增 **PQC体系密钥** 分组：**ML-DSA**（44/65/87）、**SLH-DSA-SHA2**（128s～256f）、**AIGIS-SIG**（SIG1～3）、**LMS-SM3**（H5_W*）；用途固定 **签名**，长度按算法下拉。
  - 查询区密码算法、密钥用途增加 PQC / 签名 筛选项；演示数据增加 ML-DSA 样例。

## 2026-05-25（密钥管理 · SM9 字段精简）

- **`src/views/key/KeyManage0029Panel.vue`**：
  - SM9 密钥用途固定为 **SM9短签名**（表单只读展示，不可勾选其它用途）。
  - 移除 **连接类型**、**密钥名称** 表单项与详情展示。
  - SM9 **详情** 均展示 **参数域名**、**参数版本**；标识/分片主密钥关联主密钥改为按参数域名选择。
  - 查询条件增加 **SM9短签名** 筛选项。

## 2026-05-25（密钥管理 · 密钥体系分组修正）

- **`src/views/key/KeyManage0029Panel.vue`**：
  - **PKI体系密钥**：仅 SM2密钥、RSA。
  - **对称密钥体系**：SM4、3DES、AES（3DES 为对称块密码，与 SM4/AES 同类）。
  - **IBC体系密钥**：SM9 三类；移除不存在的 **SM2分片主密钥**。

## 2026-05-25（密钥管理 · 密钥类型分组下拉）

- **`src/views/key/KeyManage0029Panel.vue`**：
  - 生成密钥首项改为 **密钥类型** 分组下拉：**PKI体系密钥**、**IBC体系密钥**（SM9 三类），与示意图一致。
  - 移除「先选 SM9 再选子类型」二级下拉；选中 IBC 类型后直接展示对应表单项。
  - 列表 **密钥类型** 列展示完整类型名；分组标题样式加粗主题色。

## 2026-05-25（密钥管理 · SM9 三类密钥表单）

- **`src/views/key/KeyManage0029Panel.vue`**：
  - 算法选 **SM9** 后增加 **密钥类型**：**SM9主密钥** / **SM9标识密钥** / **SM9分片主密钥**，按类型切换表单项（对齐原型图 1～3）。
  - **公共项**：连接类型、密钥名称、密钥用途（各类型选项不同）、密钥访问口令。
  - **SM9主密钥**：密钥长度 256、参数域名（带说明）、参数版本。
  - **SM9标识密钥**：私钥标识、主密钥名称（下拉已有主密钥）。
  - **SM9分片主密钥**：主密钥名称；用途含生成加密/签名密钥及加密解密、签名验签。
  - 列表增加 **密钥类型** 列；详情按类型展示对应字段；演示数据各类型一条。

## 2026-05-25（密钥管理 · SM9 交互修正）

- **`src/views/key/KeyManage0029Panel.vue`**：
  - **「新」标签**：移至生成密钥弹窗 **密钥算法** 表单项标签（表示算法能力扩展含 SM9），不再挂在 SM9 选项或「生成密钥」按钮上。
  - **校验逻辑**：`validate-on-rule-change` 关闭；切换算法后 `clearValidate`；仅提交时按当前算法校验对应字段；用途/密钥长度等改为 `blur` 触发，避免一选算法即全表报错。

## 2026-05-25（密钥管理 · SM9 密钥管理）

- **`src/views/key/KeyManage0029Panel.vue`**（签名验签密钥 Tab）：
  - **查询**：密码算法筛选项增加 **SM9**。
  - **列表**：沿用密钥索引、密钥 ID、密钥算法、密钥用途、密钥长度、添加时间与操作列；演示数据新增 SM9 样例。
  - **生成密钥**：算法可选 **SM9**；选 SM9 后展示 **参数域名**、**参数版本**、**底层密钥资源引用**、**密钥用途**、**密钥访问口令**；不展示密钥索引、密钥 ID、密钥长度及独立 SM9 配置标识；参数域名校验系统内唯一；生成后由系统分配索引、ID、长度。
  - **详情**：SM9 密钥展示参数域名、参数版本、底层密钥资源引用及系统维护字段；口令不在详情回显。
  - **操作**：保留详情、备份、销毁、**查看密钥访问口令**（二次认证后展示，与现有安全弹窗一致）。

## 2026-05-20（系统管理 · 连接池配置界面按示意图）

- **`src/views/system/PoolConfig.vue`**：按示意图改为单行配置——**密码运算连接池：** 数字输入（默认 **5**）+ **修改** 按钮；去掉原多字段表单；配置写入 `sessionStorage`（原型）。

## 2026-05-20（系统管理 · 服务管理界面）

- **`src/views/system/ServiceManage.vue`**（新）：**服务管理** 列表——列 **IP / 端口 / 服务状态 / 操作**；状态 **已开启**（绿点）/ **已关闭**；操作 **关闭** / **开启**（带确认）；表头灰色、数据行白色。
- **`src/router/index.js`**：新增 **`/system/service`**，面包屑「系统管理 / 服务管理」。
- **`src/components/layout/Sidebar.vue`**：系统管理下增加 **服务管理** 菜单（位于网络配置之后）。

## 2026-05-20（系统管理 · 网络配置界面按示意图）

- **`src/views/system/NetworkConfig.vue`**：**刷新** 移至左侧；表格仅 **表头** 灰色（`#f5f7fa`），数据行纯白；**编辑** 弹窗标题 **网络配置**，含 **名称**（只读）、**IP地址类型**（IPV4/IPV6）、**IP地址** / **子网掩码** / **网关地址**（按类型切换编辑）；**eth0** 显示主网口提示文案。

## 2026-05-20（应用管理 · 移除应用级接口鉴权）

- **`src/views/Application.vue`**：应用操作去掉 **应用接口鉴权**；保留详情、编辑、凭证、证书与根证配置；新建应用仍自动生成凭证数据供「凭证」使用。
- **`src/views/ApplicationDetail.vue`**：移除整段 **接口鉴权** 配置区，仅保留基本信息，并引导至系统通用配置查看鉴权策略。
- **`src/views/system/general/SystemApiAuthConfig.vue`**：说明文案改为鉴权仅在系统级配置，凭证在应用管理查看。

## 2026-05-20（证书管理 · 移除关联密钥列）

- **`src/views/cert/CertManage.vue`**：证书管理、证书申请管理列表及证书详情去掉 **关联密钥**；**申请应用证书** 去掉 **密钥索引** 表单项。
- **`src/composables/useCertManagePool.js`**：演示数据移除 `keyBindIndex`。

## 2026-05-20（证书管理 · 移除绑定对象类型与 0019）

- **`src/views/cert/CertManage.vue`**：去掉 **绑定对象类型** 列与申请表单项；删除 0019 容器相关逻辑与演示数据。
- **`src/composables/useCertManagePool.js`**：演示数据移除 `keySpec` / `keyBindContainer`。

## 2026-05-20（系统管理 · 系统通用配置 · 接口鉴权）

- **`src/components/layout/Sidebar.vue`**：**系统管理** 下新增二级菜单 **系统通用配置**，其下 **接口鉴权**（`/system/general/api-auth`）。
- **`src/views/system/general/SystemApiAuthConfig.vue`**（新）：系统级接口鉴权通用策略（总开关、HMAC-SM3、默认请求有效期）；说明各应用密钥在 **应用管理** 配置。
- **`src/utils/systemApiAuth.js`**（新）：系统通用鉴权配置持久化。
- **`src/router/index.js`**：注册 **`/system/general/api-auth`** 路由与面包屑。
- **`src/utils/appApiAuth.js`**：新建应用默认请求有效期读取系统通用配置。
- **`src/views/Application.vue`**：应用操作项文案改为 **应用接口鉴权**，与系统菜单区分。

## 2026-05-20（接口鉴权 · 应用 ID 复用为调用标识）

- **`src/utils/appApiAuth.js`**：移除 **`accessKey` / `genAccessKey`**；HMAC 鉴权以 **应用 ID** 为调用方标识，仅存 **应用密钥** 等配置；持久化时剥离废弃字段。
- **`src/views/ApplicationDetail.vue`**：去掉 **应用标识** 表单项；鉴权说明改为请求头携带 **应用 ID**、服务端按 ID 查密钥验签。
- **`src/components/app/AppCredentialDialog.vue`**：凭证弹窗 **应用ID** 即调用标识，补充说明文案。

## 2026-05-20（应用管理 · 凭证二次认证与展示弹窗）

- **`src/components/app/AppCredentialDialog.vue`**（新）：**凭证** 先 **二次认证**（管理密码），通过后弹出 **密码** 标题弹窗，展示 **应用名称 / 应用ID / 应用凭证**（明文），底部 **复制**；查看操作写入审计日志。
- **`src/views/Application.vue`**：**凭证** 改为打开上述弹窗，不再跳转应用详情。

## 2026-05-20（应用管理 · 应用操作增加凭证与编辑应用）

- **`src/views/Application.vue`**：**应用操作** 下拉增加 **编辑应用**（弹窗可改名称、状态，应用 ID 只读）、**凭证**；保留详情、接口鉴权、证书配置、根证书配置。

## 2026-05-20（应用详情 · 接口鉴权按需求规格调整）

- **`src/utils/appApiAuth.js`**（新）：统一 **应用标识**（`ak_`+应用ID）、**应用密钥** 生成；`initApiAuthForApp` 在创建应用时写入；`normalizeApiAuth` 补全缺失密钥并过滤允许范围；**重置密钥** 写入 `sessionStorage` 审计日志。
- **`src/views/ApplicationDetail.vue`**：**应用标识** 改为只读文本 + **复制**；**应用密钥** 初始脱敏展示，去掉 **生成**，仅 **重置**（确认文案按规格）/ **复制**；**允许调用范围** 仅 **签名、验签**；**停用** 时显示黄色提示（不校验 HMAC-SM3，仍校验应用状态与授权范围）。
- **`src/views/Application.vue`**：新增应用时调用 **`initApiAuthForApp`**；演示应用 `6a056db7e0221707c8c9307a` 启动时补全鉴权数据。

## 2026-05-20（一键检测 · 证书选择与证书管理同源）

- **`src/composables/useCertManagePool.js`**（新）：抽取证书管理列表原型数据为共享池；提供 **`mapCertsForPicker`** 供选择弹窗字段对齐。
- **`src/views/cert/CertManage.vue`**：列表数据改为 **`useCertManagePool()`**。
- **`src/views/Detect.vue`**：证书选择弹窗数据来自证书管理同源列表；管理页删除证书后自动清空检测页已选项。

## 2026-05-20（一键检测 · 证书字段文案）

- **`src/views/Detect.vue`**：配置项 **加密证书** 改为 **证书**；占位与提示改为「请选择证书」「请先选择证书」；证书库变量与选择逻辑重命名为 `certPool` / `selectedCertId` 等；可选列表含签名/加密类型证书（`certType` 仍按证书管理分类展示）。

## 2026-05-20（一键检测 · 界面按示意图调整）

- **`src/views/Detect.vue`**：配置区前置提示改为「检测前请上传 CA 根证和证书管理里面的证书」；**签名证书 + 检测CA根证** 改为证书只读输入框（占位「请选择证书」、右侧 **…** 打开 **`SelectCertificateDialog`**）；主按钮文案 **开始检测** / **检测中...**；结果区标题 **检测结果**；空闲提示 **请点击【开始检测】执行全部检测。** 等；进度与导出提示统一为「检测」用语；移除 CA/CRL 前置检测流程。

## 2026-05-19（应用详情 · 接口鉴权交互优化）

- **`src/views/ApplicationDetail.vue`**：合并「是否启用接口鉴权」与「状态」为单一 **接口鉴权状态**（启用/停用），避免双开关语义冲突；**应用密钥**说明补充为与应用标识配对的 HMAC-SM3 对称密钥及验签用途；加载旧配置时兼容 `enabled` 字段。

## 2026-05-19（应用管理 · 应用详情接口鉴权）

- **`src/views/ApplicationDetail.vue`**（新）：**应用详情**页——上区返回与当前应用信息；**基本信息**（名称、ID、状态、创建时间）；**接口鉴权**区域含说明提示（强调**接入安全配置**非业务证书、**应用级**非业务级）、鉴权方式固定 **HMAC-SM3**、应用标识（复制）、应用密钥（生成/重置/复制）、请求有效期默认 **5** 分钟、允许调用范围（签名/验签/加解密）、接口鉴权状态启用/停用；**保存配置** 写入 `sessionStorage`（原型）。
- **`src/router/index.js`**：新增 **`/application/detail`**（置于 **`/application`** 之前），面包屑「应用管理 / 应用详情」；**不新增**侧栏一级菜单。
- **`src/views/Application.vue`**：**详情** 跳转应用详情页；原 **凭证** 改为 **接口鉴权**，带 **`section=api-auth`** 定位至鉴权区域；移除详情 `MessageBox` 弹窗。

## 2026-05-19（密钥管理 · 用户操作流程文档）

- **`docs/密钥管理-用户操作流程.md`**（新）：整理密钥管理界面用户操作流程——入口与 Tab（0029/0019）、0029 查询/生成/恢复/行内操作、0019 生成容器/导入/行内操作、共用 UKEY 备份与二次认证、模块关联与原型限制；含 Mermaid 流程图。

## 2026-05-14（证书管理：0019/0029 界面统称「绑定对象类型」）

- **`src/views/cert/CertManage.vue`**：**证书管理** 列表列名 **「密钥体系」→「绑定对象类型」**，展示为 **`bindObjectTypeLabel`（0019/0029 中文说明）+ 密钥容器/密钥索引`**；**证书申请管理** 列名 **「密钥类型」→「绑定对象类型」**；**申请应用证书** 表单项与占位、校验 **「请选择绑定对象类型」**；**证书详情** 描述项同步；新增 **`bindObjectTypeLabel`**，**`formatCertKeyBinding` / `formatApplyKeyBinding`** 均带上类型前缀。**数据字段仍为 `keySpec`（`0019`/`0029`）**。

## 2026-05-14（应用管理 · 证书关联页分区布局，与根证页一致）

- **`src/views/ApplicationCertLink.vue`**：**上区**（返回、提示、标题「应用证书关联」、当前应用信息）**无 `page-card`**，透明底与内容区灰底一致；**下区**将 **「关联已有应用证书」按钮 + 表格** 包在 **`page-card`** 白底模块内；上下区 **16px** 间距。

## 2026-05-14（应用管理 · 根证书配置页分区布局）

- **`src/views/ApplicationRootCertConfig.vue`**：**上区**（页面标题、返回链接、当前应用 ID）**不再使用 `page-card`**，背景透明，与主内容区灰底一致；**下区**将 **「根证书配置」主按钮 + 数据表格** 单独包在 **`page-card`** 内，形成独立 **白底卡片模块**；上下区间距约 **16px**。

## 2026-05-14（应用管理 · 根证书配置页与弹窗）

- **`src/router/index.js`**：新增 **`/application/root-cert-config`**（位于 **`/application`** 之前），面包屑「应用管理 / 根证书配置」。
- **`src/views/ApplicationRootCertConfig.vue`**（新）：**根证书配置** 页——标题与 **「← 根证书配置——（应用名）」** 返回应用管理、当前应用 ID；主按钮 **「根证书配置」** 打开弹窗；主表列 **应用证书名称/密钥标识**、**根证书**、**证书验证策略**、**删除**；空表 **暂无数据**。
- **弹窗（图1）**：标题 **根证书配置**；必填 **根证书**（下拉占位「请选择根证书」）、**证书验证策略**（三项：**验证证书有效性** / **且验证CRL** / **且验证OCSP**）；下拉宽度 **90%**；确定后写入一条原型配置。
- **`src/views/Application.vue`**：**根证书配置** 菜单项改为跳转 **`/application/root-cert-config?appId=&name=`**。

## 2026-05-14（用户证书管理 · 导入弹窗按示意图）

- **`src/views/cert/UserCert.vue`**：**导入证书** 弹窗改为标题 **「导入用户证书」**；表单项 **证书名称**（必填、占位「请输入证书名称」）、**证书文件**（**点击上传**，`accept` 为 **`.cer/.pem/.der`**）；上传下方灰色说明 **「证书文件格式支持.cer、.pem、.der」**；头/底分隔线与内边距；证书名称与上传区宽度约 **68%**（`max-width:360px`）；确定写入列表时使用 **用户填写的证书名称**；弹窗样式置于 **`.user-cert` 外** 以适配 **teleport**。

## 2026-05-14（用户证书管理界面按示意图）

- **`src/views/cert/UserCert.vue`**：按示意图实现 **用户证书管理** — **筛选区**（证书名称、证书序列号、查询/重置，输入约 **90%** 宽）；**导入证书**、**批量删除**；**表格**（多选、证书名称/序列号/主题/颁发者/状态标签/类型/签名算法/签发与过期时间、操作删除）；**暂无数据**；**分页**；**导入证书** 弹窗上传后插入一条原型数据。

## 2026-05-14（应用管理 · 应用证书关联页与关联弹窗）

- **`src/router/index.js`**：新增 **`/application/cert-link`**（置于 **`/application`** 之前避免被吞），面包屑「应用管理 / 应用证书关联」。
- **`src/views/ApplicationCertLink.vue`**（新）：**应用证书关联** 页——返回应用管理、标题与当前应用信息、**「关联已有应用证书」** 主按钮；主表列 **应用证书名称/标识编码**、**算法类型**、**操作（删除）**；无数据 **暂无数据**；确认关联后写入两条（签名/加密）原型数据。
- **`src/components/cert/AssociateExistingAppCertDialog.vue`**（新）：弹窗标题 **关联已有应用证书**；多选表格（名称/ID、算法、颁发者、序列号、申请日期、到期时间、证书类型）+ 分页；**必选各一张签名与加密证书** 后确定；超过两张自动取消多余勾选。
- **`src/views/Application.vue`**：**证书配置** 改为跳转 **`/application/cert-link?appId=&name=`**。
- **`src/components/layout/Sidebar.vue`**：**`/application/cert-link`** 下仍高亮 **应用管理**。

## 2026-05-14（证书管理：表单控件宽度 90%）

- **`src/views/cert/CertManage.vue`**：**申请应用证书** 弹窗内 **输入框 / 下拉 / 多行文本** 统一为内容区 **90%** 宽（`max-width:100%`）；**通用名** 外层 **`apply-dn-cn-wrap`** 同步 **90%**；**导入加密证书** 弹窗增加 **`import-encrypt-form`**，密码类 **el-input** 与 **`encrypt-cert-upload`** 均为 **90%**（导入证书弹窗共用上传样式）。

## 2026-05-14（证书申请：自定义主题是/否分支 UI）

- **`src/views/cert/CertManage.vue`**：**申请应用证书** 增加 **使用自定义主题**（是/否）。**是**：仅 **证书主题(DN)** 多行输入（必填）+ 示例说明，与图1一致；**否**：**通用名/国家/ST/L/O/OU/邮箱** + **证书主题预览**（与图2一致）。**密钥类型、密钥容器/密钥索引、算法** 逻辑不变；拆分组装 DN 支持可选 **E=邮箱**；提交时按分支取 **整行 DN** 或 **`buildSubjectDnFromForm`**；列表记录附带 **`useCustomSubject` / `email`**。

## 2026-05-14（证书申请：密钥容器/密钥索引必填）

- **`src/views/cert/CertManage.vue`**：**申请应用证书** 弹窗中 **密钥容器**（0019）、**密钥索引**（0029）改为 **`required` 动态规则**（随密钥类型切换），占位提示标明必填；两项表单项改为 **`v-show`** 以保持校验与 **必填星号** 正确；校验触发 **`change` + `blur`**。

## 2026-05-14（应用管理界面按示意图）

- **`src/views/Application.vue`**：按示意图重做 **应用管理** — **筛选区**（应用名称/ID、状态下拉含全部/启用/停用、创建时间范围、查询/重置）、**新增应用** 按钮、**表格**（应用名称/ID 双行、启用带绿色对勾图标、创建时间、**应用操作** 下拉：凭证 / 详情 / 证书配置 / 根证书配置）；**证书配置**、**根证书配置** 跳转 **`/cert/manage`**、**`/cert/ca`** 并提示已统一到证书与 CA 管理；底部分页 **共 N 条**；**新增应用** 弹窗录入名称后写入列表（原型 ID）。
- **`src/components/layout/Sidebar.vue`**：修正 **`activeMenu`**，使 **`/application`** 等路径不再被误判为 **`/key/manage`**，应用管理菜单可正确高亮。

## 2026-05-14（0019 查看认证凭据；证书列表对齐示意图）

- **`src/views/key/KeyManage0019Panel.vue`**：操作列增加 **「查看认证凭据」**，调用 **`KeyManageSecurityModals`** 已暴露的 **`openViewAuthCredentialsFlow`**（二次认证后展示 PIN 原型，与 0029「查看密钥访问口令」一致）。
- **`src/views/cert/CertManage.vue`**：**证书管理** 主表按示意图调整列：**证书名称/密钥编号**（双行）、**算法类型**（支持 `algorithmDisplay`，示例为 SM3WithSM2）、**颁发者**、**证书主题**（独立 DN 列）、**关联密钥**（仅 **`密钥容器：xx`** / **`密钥索引：xx`**，不再带 0019/0029 前缀）、**证书序列号**、**证书类型**、**证书状态**（圆点 + 文案，含 **生效中**）、**生效/到期时间**（含时分秒）、**操作**（**更新** 打开详情、**导出**、**删除**）；去掉原斑马主表；筛选区「应用证书名称」改为 **证书名称** 且可同时按 **密钥编号** 匹配；**`allCerts`** 示例数据贴近截图并带 **`id`** 供删除；**证书申请管理** 中 **密钥绑定** 列与主表关联密钥文案一致。

## 2026-05-14（密钥与证书：0019 去关联证书；证书管理关联字段；申请弹窗密钥类型）

- **`src/views/key/KeyManage0019Panel.vue`**：**通用密码服务接口（0019）密钥** 页去掉 **关联证书** 列表列、操作列中的 **关联/更换证书**、详情中的 **关联证书** 与 **证书信息** 子表、**关联证书** 弹窗及 **`SelectCertificateDialog`**；演示数据去掉 **`certBindings` / `applicationCertList`** 等与证书绑定相关的字段与逻辑。
- **`src/views/cert/CertManage.vue`**：**证书管理** 列表增加 **「关联密钥」** 列（展示 **0019·容器** 或 **0029·索引**），**详情** 同步展示；**`allCerts`** 增加两条原型示例数据；**证书申请管理** 列表增加 **密钥类型**、**密钥绑定** 列；**申请应用证书** 弹窗增加 **密钥类型**（0019/0029），**0019** 时选 **容器**（与 0019 密钥页演示容器名一致），**0029** 时选 **密钥索引**，校验与提交写入 **`keySpec` / `containerName` / `keyIndex`**；默认示例申请记录已区分 0019/0029。

## 2026-05-13（选择证书弹窗 · 分页缩小与表格表头着色）

- **`src/components/cert/SelectCertificateDialog.vue`**：**分页** 使用 **`size="small"`**，并收紧 **总数文案、每页条数选择器、页码按钮** 的字号与高度（约 12px / 26px）；**表格** 去掉 **`stripe`**，表头统一 **#f5f7fa** 底色与加粗字重，数据行 **纯白**、悬停与斑马无额外底色。

## 2026-05-13（选择证书弹窗 · 收紧四周留白）

- **`src/components/cert/SelectCertificateDialog.vue`**：进一步缩小 **标题栏 / 正文 / 页脚** 内边距（如标题 **4×10**、正文 **8×10**、页脚 **6×10**）；**`--el-dialog-padding-primary: 8px`**；**`show-close`** 时右侧留白改为 **32px**；关闭按钮 **right: 4px、28×28**；根节点 **`padding: 0`**。补回顶部 **info 提示条**（含证书管理链接）及对应 scoped 样式，避免与工具栏脱节。

## 2026-05-13（选择证书弹窗 · 统一图示样式）

- **`src/components/cert/SelectCertificateDialog.vue`**（新）：标题「选择证书」；顶部 **info 提示条**（浅蓝底 + 图标），文案含跳转 **`/cert/manage`** 的「证书管理」紫色下划线链接；**密钥编码 / 证书名称** 筛选 + **查询 / 重置**（条件在点击查询后生效）；**已选 N 个证书**；表格列：**单选**、证书名称/密钥编码（双行）、算法类型、颁发者、证书主题、证书序列号、证书类型；底部分页 **共 N 条、每页条数、翻页**；页脚 **取消 / 确定**；标题栏浅灰底与底部分隔线与示意图一致。
- **`src/views/key/KeyManage0019Panel.vue`**：原「关联已有应用证书」内联表格弹窗改为使用 **`SelectCertificateDialog`**；演示数据补充 **keyCode、issuer、subject、certType、算法展示 SM3WithSM2** 等与表头一致字段。

## 2026-05-13（界面：移除版本更新标记）

- **`src/components/layout/Sidebar.vue`**：侧栏「密钥管理」去掉红色 **`V1.9.0`** 版本标签，仅保留菜单文案。
- **`src/views/cert/CACert.vue`**：CA 根证筛选区各筛选项标签去掉 **`V1.8.0`** 红色标签。
- **`src/views/cert/CertManage.vue`**：「证书申请管理」页签去掉标题中的 **`V 1.8.0`** 文案；「申请应用证书」按钮去掉 **`新`** 标签。
- **`src/views/key/KeyManage.vue`**：「通用密码服务接口密钥」页签去掉 **`新`** 标签；同步删除未再使用的 **`.key-tab-label__tag`** 样式。
- **`src/views/key/KeyManage0029Panel.vue`**：「生成密钥」按钮去掉 **`新`** 标签。

## 2026-05-11（系统管理 · Syslog配置）

- **`src/components/layout/Sidebar.vue`**：在「系统管理」下增加子菜单 **Syslog配置**，路由 `#/system/syslog`（位于 SNMP 与白名单之间）。
- **`src/router/index.js`**：注册 **`/system/syslog`**，面包屑「系统管理 / Syslog配置」。
- **`src/views/system/SyslogConfig.vue`**（新）：**Syslog配置** 标题；**+ 添加Syslog服务器** 打开表格内编辑行（IP、端口占位与图2一致）；**保存** 校验 IPv4/粗 IPv6 与端口 1–65535 后写入列表并提示成功（图3）；已保存行仅 **删除**；无数据时表格 **暂无数据**（图1）；有数据时底栏 **分页**（共 N 条、每页条数，与图3一致）。

## 2026-05-11（系统管理 · SNMP管理 / snmp配置页）

- **`src/components/layout/Sidebar.vue`**：在「系统管理」下增加子菜单 **SNMP管理**，路由 `#/system/snmp`（位于 NTP 与白名单之间）。
- **`src/router/index.js`**：注册路由 **`/system/snmp`**，`meta.title` 为「SNMP管理」，面包屑为「系统管理 / snmp配置」。
- **`src/views/system/SnmpConfig.vue`**（新）：snmp 配置原型页——**SNMP服务状态** 开关；**SNMP版本_V3** 分区（左侧色条标题 + 用户表：用户名、安全级别、认证协议/密码、加密协议/密钥、操作编辑删除；**+ 添加用户**）；**SNMP版本_V2** 分区与 **启用SNMP_V2** 开关；底部 **确定**（原型提示保存）。

## 2026-05-11（Git：新建开发迭代分支）

- 自 **`SVS_1.8.0`** 检出并创建分支 **`SVS_1.9.0`**，作为下一版原型开发迭代线；工作区未提交改动仍保留在当前检出分支上。
- **`README.md`**：「当前开发分支」由 `SVS_1.8.0` 更新为 `SVS_1.9.0`。
- 首次推送到远程时需在本机执行：`git push -u origin SVS_1.9.0`（需具备 `origin` 写权限且网络可达）。

## 2026-05-07（证书管理 · 申请弹窗主题标签字体与证书主题行对齐）

- **`src/views/cert/CertManage.vue`**：去掉主题区表单项 **`apply-dn-field` 对标签的加粗/颜色覆盖**，使 **通用名(CN)～部门(OU)、证书主题** 与 **证书名称 / 算法 / 密钥索引** 使用 Element Plus 默认标签字重与颜色。**证书主题** 行内容区增加 **`flex:1; min-width:0`**，内层预览 **`flex:1; min-width:0`**，避免长 DN 把标签挤换行；垂直 **居中对齐**；预览文案改为 **`font-size` / `line-height` / `font-family` 与表单项正文一致**（不再单独等宽体），占位色用 **`--el-text-color-secondary`**。

## 2026-05-07（证书管理 · 申请弹窗部门下展示证书主题）

- **`src/views/cert/CertManage.vue`**：在 **部门(OU)** 下方增加 **证书主题** 表单项，实时显示与提交一致的 **当前 DN**（`applyCurrentSubjectDn` + `buildSubjectDnFromForm`）；通用名或国家未填全时显示灰色占位说明；内容区等宽字体便于阅读 DN。

## 2026-05-07（证书管理 · 申请弹窗主题字段按示意图单列）

- **`src/views/cert/CertManage.vue`**：证书主题相关项改为与示意图一致的 **单列自上而下** 顺序：**通用名(CN)**（占位「请输入通用名(CN)，2-50个字符」、`maxlength=50`、下方灰色说明文案）、**国家(C)**（下拉展示如 `China (中国)`）、**省份/州(ST)**、**城市(L)**、**公司(O)**、**部门(OU)**；占位分别为「如：广东」「如：深圳」「如：a company」「如：研发部」。**仅 CN、国家(C) 必填**；去掉证书主题预览行与「示例」行；**DN 组装**仅拼接已填的 ST/L/O/OU。弹窗宽 **560px**，`label-width` **128px**。

## 2026-05-07（证书管理 · 申请弹窗证书主题与示例对齐）

- **`src/views/cert/CertManage.vue`**：**证书主题** 预览行改为 **`el-form-item`**，与 **证书名称 / 算法 / 密钥索引** 共用 **`label-width="112px"`** 标签列与内容列；去掉主题区内层描边面板及额外缩进。**示例** 改为表单项 **`label="示例"`**，示例 DN 在内容区，与 **城市L、国家C** 等字段的输入列左缘对齐。

## 2026-05-07（证书管理 · 申请弹窗证书主题区版式）

- **`src/views/cert/CertManage.vue`**：证书主题区块按示例排版：**首行「证书主题：」+ 右侧实时当前 DN**（未填时灰色说明）；其下为 **通用名CN** 整行，**组织O | 部门OU**、**城市L | 省份ST** 双列，**国家C** 整行；**底部「示例：」+ 示例 DN** 与上方虚线分隔；去掉原独立「当前主题」重复行及区块顶栏必填星。

## 2026-05-07（证书管理 · 申请弹窗证书主题：左标签与占位提示）

- **`src/views/cert/CertManage.vue`**：证书主题（DN）区内各字段改为 **表单项左侧标签**（通用名CN、组织O、部门OU、城市L、省份ST、国家C），与 **输入框内占位提示**（域名示例、机构/部门/市省示例、选择国家等）；布局为 **CN 整行** + **O|OU**、**L|ST** 双列 + **C** 整行（算法仍保留在主题区上方，避免与「密钥算法」重复）；弹窗宽 **600px**，`label-width` **112px**，区块标题保留必填星与描边面板。

## 2026-05-07（证书管理 · 申请弹窗对齐图2 风格）

- **`src/views/cert/CertManage.vue`**：申请应用证书弹窗恢复与示意图一致的 **520px 宽、label-width 140px、单列自上而下**（证书名称 → 算法 → 密钥索引 → 证书主题）；**证书主题(DN)** 为单一表单项标签 + 必填星，内嵌多行输入拆分 CN/O/OU/L/ST/C，主题内容区 **描边 + 圆角 + 内边距** 贴近原多行输入框区域观感；底部 **灰色示例** 文案与图2 一致，并在有内容时追加一行 **当前主题** 等宽字体提示；去掉分割线、双列算法/索引及大块预览区，与「导入加密证书」等弹窗风格统一。

## 2026-05-07（证书管理 · 申请应用证书弹窗布局优化）

- **`src/views/cert/CertManage.vue`**：申请弹窗改为统一单列表单项节奏；**算法** 与 **密钥索引** 并排一行；用 **`el-divider`** 区分「证书主题」区块；主题字段采用简短 **CN / O / OU / L / ST / C** 标签与精简占位；底部增加 **主题预览**（随填写实时生成 DN 片段，空时提示文案）；弹窗宽度 560px、表单项间距与分割线样式统一，避免原双列主题区与上方字段视觉脱节。

## 2026-05-07（证书管理 · 证书申请管理页签与拆分 DN 申请弹窗）

- **`src/views/cert/CertManage.vue`**：「证书申请管理」页签实现与示意图一致的主列表（证书主题 DN、算法、状态含未签发/已签发图标、申请时间、操作：导入证书 / 下载 CSR / 删除）及 **申请应用证书** 按钮；默认两条示例未签发数据与分页。
- **`src/views/cert/CertManage.vue`**：**申请应用证书** 弹窗保留证书名称、算法、密钥索引；**证书主题** 由单行 DN 改为拆分录入：**通用名 CN、组织 O、部门 OU（选填）、城市 L、省份 ST、国家 C（下拉）**，确定时组装为 `/C=…/ST=…/L=…/O=…[/OU=…]/CN=…` 写入列表（原型演示）。新增 **导入证书** 子弹窗（上传后可将该条状态置为已签发）；删除带确认；下载 CSR 为提示演示。

## 2026-05-07（密钥管理 · 0019 生成容器：算法与长度分栏）

- **`src/views/key/KeyManage0019Panel.vue`**：「生成容器」弹窗将原合并的 **密码算法** 拆为 **密钥算法**（SM2 / RSA）与 **密钥长度**（按算法联动：SM2→256、RSA→2048）；校验与重置表单字段同步调整。
- **`src/views/key/KeyManage0019Panel.vue`**：列表 **算法** 列改为 **密钥算法**、**密钥长度** 两列；示例数据与详情弹窗改为分别展示 **密钥算法**、**密钥长度**；证书绑定预览中的算法匹配改为依据 `keyAlgorithm`。

## 2026-05-07（密钥管理 · 0019 通用密码服务接口：证书操作与详情）

- **`src/views/key/KeyManage0019Panel.vue`**：列表主操作在容器 **已绑定任一证书** 时显示 **「更换证书」**，否则为 **「关联证书」**。
- **`src/views/key/KeyManage0019Panel.vue`**：密钥详情中证书表按用途区分：**已绑定** 显示 **「查看」** 与 **「更换证书」**；**未绑定** 仍为 **「关联证书」**。
- **`src/views/key/KeyManage0019Panel.vue`**：绑定证书弹窗标题及第一步文案随 **当前所选用途（签名/加密）是否已有证书** 在「绑定证书 / 更换证书」及对应标签、按钮文案间切换。
- **`src/views/key/KeyManage0019Panel.vue`**：密钥详情 **不再展示公钥内容**；移除仅用于公钥块的样式 `.detail-p2-value--pre`。

## 2026-04-30（密钥管理 · 0019 导入容器与绑定证书三步流程）

- **`src/views/key/KeyManage0019Panel.vue`**：按新要求将“上传证书”改为“关联应用证书”流程；列表与详情中的入口按钮统一为 **关联证书**。
- **`src/views/key/KeyManage0019Panel.vue`**：新增「**关联已有应用证书**」弹窗（表格列：应用证书名称/ID、算法、颁发者、证书序列号、申请日期、到期时间），支持单选后确认回填到绑定流程。
- **`src/views/key/KeyManage0019Panel.vue`**：绑定弹窗第一步改为“关联证书”按钮，不再出现本地上传控件；第二步预览与匹配校验改为基于已关联应用证书信息。
- **`package.json` / `package-lock.json`**：移除 `jsrsasign`（当前改为关联证书，不再做本地文件解析）。
- **`src/views/key/KeyManage0019Panel.vue`**：工具栏按钮由「恢复密钥」改为 **导入容器**，提示文案同步为容器导入语义。
- **`src/views/key/KeyManage0019Panel.vue`**：列表操作新增 **绑定证书/更换证书**（按绑定状态动态文案）；绑定证书列改为显示已绑定证书 CN（未绑定显示「未绑定」）。
- **`src/views/key/KeyManage0019Panel.vue`**：新增“绑定证书”弹窗三步交互（选证书文件 → 解析预览 → 确认绑定），支持 `.cer/.pem/.der` 选择、用途单选（签名/加密，按容器密钥对能力置灰）、解析后展示主体/颁发者/序列号/有效期/公钥算法/用途，并给出算法一致性与用途匹配校验提示（不阻断确认）。
- **`src/views/key/KeyManage0019Panel.vue`**：确认绑定成功后更新该容器绑定证书信息，失败时在弹窗内显示错误信息并保持弹窗不关闭（原型通过文件名包含 `fail` 触发失败演示）。
- **`src/views/key/KeyManage0019Panel.vue`**：密钥详情弹窗增加 **证书信息** 区域，展示签名/加密两套证书的 CN、颁发者、有效期及操作（查看、更换/绑定），与列表快捷入口互补。

## 2026-04-30（密钥管理 · 0019 容器管理界面按图调整）

- **`src/views/key/KeyManage0019Panel.vue`**：保持页签标题不变，仅调整「通用密码服务接口密钥」内容为容器管理形态；列表列改为 **容器名 / 算法 / 用途 / 绑定证书 / 添加时间 / 操作**，操作保留 **详情 / 备份 / 销毁**。
- **`src/views/key/KeyManage0019Panel.vue`**：生成弹窗改为 **生成容器**，字段对齐示意逻辑：**容器名（唯一）/ 密码算法 / 密钥用途 / PIN**；提示文案改为容器生成成功。
- **`src/views/key/KeyManage0019Panel.vue`**：详情弹窗改为展示 **容器名 / 密码算法 / 密钥用途 / 公钥内容 / 绑定证书 / 添加时间**，并补充示例数据中的绑定证书状态与公钥内容展示。

## 2026-04-21（密钥管理 · 备份 UKEY / 销毁与查看口令二次认证）

- **`src/views/key/KeyManageSecurityModals.vue`**（新）：备份流程弹窗「请选择UKEY」— 先展示「控件检测中...」，检测完成后选择 UKEY 再确定；销毁先 `ElMessageBox`「温馨提示 / 确定要销毁此密钥吗？」再打开「二次认证」管理密码；查看密钥访问口令直接走「二次认证」，通过后展示口令（均为原型演示）。
- **`src/views/key/keyManageSecurityKey.js`**（新）：导出 `KEY_MANAGE_SECURITY_KEY` 供父级 `provide`、子面板 `inject`。
- **`src/views/key/KeyManage.vue`**：挂载 `KeyManageSecurityModals` 并向子面板注入组件实例引用；移除未使用的 `computed` 导入。
- **`src/views/key/KeyManage0029Panel.vue`**、**`src/views/key/KeyManage0019Panel.vue`**：备份 / 销毁 / 查看口令改为调用注入的安全弹窗方法。

## 2026-04-14（监控总览 · 证书数量悬浮明细）

- **`src/views/Dashboard.vue`**：数据统计区「证书数量」增加信息图标悬浮提示，展示证书细分数量：**根证书 24 张**、**签名证书 72 张**、**用户证书 60 张**。
- **`src/views/Dashboard.vue`**：固定统计项支持按项配置 `detailLines` 明细并在有明细时显示 tooltip，其他统计项保持原展示不变。

## 2026-04-14（监控总览 · 跨月提示交互）

- **`src/views/Dashboard.vue`**：移除业务筛选区“当前口径：自然月统计（按日仅支持月内）”文案，不再在界面常驻显示该提示。
- **`src/views/Dashboard.vue`**：日期区间取消禁选跨月日期，改为在用户选择跨月区间时弹出错误提示 **「暂不支持跨月查询」**，并回退到当前月份合法区间。

## 2026-04-14（监控总览 · 业务单位展示调整）

- **`src/views/Dashboard.vue`**：业务数据卡片将单位从底部独立行调整为挂在业务名称右侧（如「签名业务 次」），单位字体大小保持不变。
- **`src/views/Dashboard.vue`**：单位文案由动态括号说明（如 `次（今日）`、`次（3天合计）`）统一为 `次`，去除括号内附加内容。

## 2026-04-14（监控总览 · 业务筛选二次精简）

- **`src/views/Dashboard.vue`**：按反馈将快捷项精简为 **今日 / 昨日 / 本月**；移除原“统计口径/统计维度”切换控件，仅保留快捷操作。
- **`src/views/Dashboard.vue`**：筛选控件保留 **月份下拉** 与 **日期区间**；月份变化时自动将日期区间重置为该月范围（当月为月初至今日）。
- **`src/views/Dashboard.vue`**：日期区间继续限制为所选月份内，跨月选择自动回退到当前月份合法区间，保证“不跨月”规则。

## 2026-04-14（监控总览 · 业务统计时间筛选口径）

- **`src/views/Dashboard.vue`**：业务数据筛选区改为「统计口径 + 统计维度 + 快捷筛选」结构；新增 **自然月（不跨月）** 口径说明、维度切换（按月 / 按日（月内））及对应快捷项（按月：本月/上月/近3个月/近6个月；按日：本月至今/本月前7天/本月前15天）。
- **`src/views/Dashboard.vue`**：按日模式新增「月份 + 日期区间」联动，日期选择限制在所选月份内，避免跨月统计；按月模式支持 `monthrange`。
- **`src/views/Dashboard.vue`**：统计计算统一基于 `bizEffectiveRange`，按月维度自动换算为起止月的自然日区间，保证示例数据缩放与单位文案一致。

## 2026-04-09（CA根证管理 · 列表列名）

- **`src/views/cert/CACert.vue`**：列表列标题由「CA证书主题（DN）」改为 **「CA证书（DN）」**。

## 2026-04-09（CA根证管理 · CA 证书链独立页与推送 GitHub）

- **`src/views/cert/CACertChain.vue`**（新）：**返回**、标题「CA-证书链」、表格列（证书 SN、证书 DN、签发者 DN、证书生效/失效时间、算法类型）。从列表进入时通过 `history.state.caCertRow` 携带当前行；直接打开 URL 时用与列表一致的 `FALLBACK_CA_ROWS`。内置 id=1 与参考示意图一致的 SN/时间（DN 仍取自当前行）；id=2/3 为两层链演示，id=4 为 ML-DSA 单根；其余/新增行为单根自签样式并由 `certLabel`、有效期等推导。
- **`src/views/cert/CACert.vue`**：点击 **CA证书** 链式按钮跳转 `CACertChain`（`router.push` + `state`），移除原「CA根证详情」弹窗。
- **`src/router/index.js`**：新增 `/cert/ca/chain/:id`（`CACertChain`），顶栏面包屑为「签名验签服务 / CA根证管理 / CA-证书链」，其中「CA根证管理」可点回列表。
- **`docs/界面功能说明.md`**：标题改为「SVS签名验签1.8.0 原型」；文档范围句略作精简。
- **`src/views/Dashboard.vue`**：去除误加的 UTF-8 BOM（与 `main` 内容一致，不纳入本次功能 diff）。

## 2026-04-09（一键检测 · 证书前置说明与异常提示）

- **`src/views/Detect.vue`**：在「检测方式」上方增加 **warning** 前置说明：检测前需上传 **CA 根证**、**用户证书**，并说明证书问题将提示重新上传。证书相关接口异常时，结果区顶部 **error** 提示「未检测到证书，请重新上传。」；明细行在异常项下追加同文案。新增 `isCertRelatedServiceRow`、`buildServiceResultsForRun`、`DEMO_SIMULATE_CERT_MISSING`（默认 `false` 全正常；置 `true` 时原型模拟证书缺失以预览提示）。
- **`docs/界面功能说明.md`**：「五、一键检测」补充前置提示与证书类异常说明，并注明 `DEMO_SIMULATE_CERT_MISSING` 演示开关。

## 2026-04-09（文档 · 界面功能说明）

- **新增** `docs/界面功能说明.md`：按路由与页面实现汇总**全部界面**的功能说明；含侧栏可见性与 URL 对照、重定向与已删除路由说明，以及监控总览、应用/密钥/证书/CA、系统各子页与白名单、一键检测等章节。
- **`docs/界面功能说明.md` 改写**：改为**按功能域**组织（运行监控、密钥生命周期、证书与信任、访问控制、对接应用、运行环境、账号权限、健康检查等），弱化路径/侧栏/路由表；文末保留简短原型预期说明。
- **`docs/界面功能说明.md` 再改**：明确**仅原型、仅侧栏已开放菜单**（设备资源、密钥管理、CA根证、白名单、一键检测）；删除对已隐藏入口（应用/证书/用户证书/系统信息等）的功能说明；补充菜单与章节对照表与附言。

## 2026-04-09（密钥管理 · 0019 是否可导出为「是/否」）

- **`src/constants/gmt0019.js`**：`EXPORT_FLAG_OPTIONS` 文案由「不可导出/可导出」改为 **「否 / 是」**（`uiExportFlag` 仍为 0/1）。
- **`src/views/key/KeyManage0019Panel.vue`**：列表与详情示例 `exportableLabel` 改为 **「是」「否」**；生成密钥表单项标签改为 **是否可导出**，校验提示同步。

## 2026-04-09（CA根证管理 · DN 搜索与示例数据）

- **`src/views/cert/CACert.vue`**：筛选区增加 **DN** 输入，与 CA 名称、有效期一并参与「查询」。**DN 模糊查询**：`dnFuzzyMatch` 对 `certLabel` 做小写、去空白后比对；支持空格/中英文逗号/顿号拆成多关键字，**全部子串命中** 即保留（顺序不限）。占位与输入框宽度略加宽。列表默认数据为示意图四条并补全生效/过期；**CA证书** 链式详情；**操作** 含上传下级证书/CRL/OCSP/删除；底部分页与 `pagedList` 行为同前。

## 2026-04-09（系统管理 · 移除服务管理界面）

- **`src/router/index.js`**：删除 `/system/service`（服务管理）路由。
- **`src/components/layout/Sidebar.vue`**：系统管理子菜单移除「服务管理」项。
- **`src/views/system/Permission.vue`**：权限树「系统管理」下移除「服务管理」节点；超级管理员默认勾选去掉对应 id `33`。
- **删除** `src/views/system/ServiceManage.vue`。

## 2026-04-09（监控总览 · 设备资源区布局）

- **`src/views/Dashboard.vue`**：「系统状态与资源」区仅调整布局与尺寸——**第一行** 为两列网格：**设备基本信息** 与 **网络状态**（独立卡片，原内嵌网络块提升为同级卡片）；**第二行** 三列并排：**CPU 使用率**、**内存使用率**、**硬盘使用率**。新增 `.card-grid--device-row`、`.card-grid--usage-row`、`.network-status-card`、`.usage-rate-card` 及紧凑环形图相关样式，文案与数据绑定不变。

## 2026-04-08（Git · 推送至 GitHub）

- 已将本地 `main` 推送到 `https://github.com/Clair-Lin/svs18.git`（含原型各页面与 operatelog 等提交）。

## 2026-04-08（一键检测 · 服务接口增加云签名四类检测）

- **`src/views/Detect.vue`**：服务接口检测列表增加 **获取随机数**（`/cloud_sign_svs/cert/generateRandom`）、**导出证书**（`/cloud_sign_svs/cert/ExportCert`）、**数据签名**（`/cloud_sign_svs/cert/SignData`）、**数据验签**（`/cloud_sign_svs/cert/VerifySignedData`）；与现有三项共用占位主机 `https://192.168.1.100:443` 拼接完整 URL；`STEPS_SERVICE`、`STEPS_ALL` 进度与状态文案同步为 7 项服务接口（含上述四类）+ 完成/加密卡/汇总。

## 2026-04-08（白名单配置 · 按示意图精简，无启用禁用）

- **`src/views/whitelist/WhitelistConfig.vue`**：界面与示意图对齐——工具栏仅 **新增**、**删除**（多选批量）；表格列 **IP白名单**、**操作**（行内删除）；去掉全局/行内 **启用禁用**、筛选、查看编辑、备注与时间列、配额行与「立即生效」确认链。新增弹窗标题 **新增IP白名单**，必填多行输入，占位与说明文案支持英文逗号分隔及 `*`、`/xx`（1~32）网段；一次提交可解析多条并做与列表及批次内重叠校验。示例数据改为三条 `segment` 结构。
- **`src/utils/whitelistIp.js`**：新增 `wildcardIpv4ToRange`、`segmentToRange`、`isValidWhitelistSegment`、`parseCommaSeparatedSegments`；`cidrToRange` 支持 `allowPrefixZero`，白名单场景 CIDR 前缀限制为 **1~32**；`rowToNumericRange` / `displayIpSegment` / `parseImportLine` 支持 `segment` 字段及 `*` 网段解析。

## 2026-04-08（CA根证管理 · 有效期筛选与生效/过期列）

- **`src/views/cert/CACert.vue`**：筛选区增加 **有效期**（日期范围）；表格增加 **生效时间**、**过期时间** 列；查询按 CA 名称 + 证书有效期与区间 **交集** 过滤；添加表单必填 **生效/过期** 日期；详情展示对应字段。

## 2026-04-08（CA根证管理 · 按示意图精简）

- **`src/views/cert/CACert.vue`**：去掉 **黑名单管理** Tab 及全部黑名单逻辑；页面改为 **CA名称** 筛选（占位「请输入CA名称」）+ **查询/重置**、**添加**；表格列 **CA名称 / CA描述 / CA证书 / 操作**（查看、删除）；默认无数据展示 **暂无数据**；添加弹窗含 CA 名称、描述、证书文件选择；详情弹窗同步字段。
- **`src/router/index.js`**：`/cert/ca` 使用静态面包屑「签名验签服务 / CA根证管理」，移除 `dynamicBreadcrumb`。

## 2026-04-08（密钥管理 · 通用密码服务接口 · 移除副本状态）

- **`src/views/key/KeyManage0019Panel.vue`**：列表与密钥详情中删除 **副本状态**；去掉示例数据中的 `replicaCurrent` / `replicaTotal` 及 `QuestionFilled`、相关样式。

## 2026-04-08（密钥管理 · 通用密码服务接口 · 口令与用途与导出列）

- **`src/constants/gmt0019.js`**：密钥用途拆分为 **`KEY_USAGE_OPTIONS_SM2_0019`**（签名、密钥交换协议、加密）与 **`KEY_USAGE_OPTIONS_RSA_0019`**（签名、密钥交换（加密））；移除原统一列表 `KEY_USAGE_OPTIONS_0019`。
- **`src/views/key/KeyManage0019Panel.vue`**：生成密钥表单增加与签名验签服务器一致的 **密钥访问口令**（必填、6–32 字符）；密钥用途随 **SM2 / RSA** 切换选项；列表增加 **是否可导出** 列；筛选「密钥用途」与示例数据、详情弹窗同步；详情中「添加时间」改为展示可读时间字符串。

## 2026-04-08（密钥管理 · 签名验签服务器 · 密钥用途按算法限制）

- **`src/views/key/KeyManage0029Panel.vue`**：**SM2 / RSA** 下「密钥用途」可同时选 **签名验签**、**加密解密**；**SM4 / 3DES / AES** 下 **签名验签** 禁用且切换为该算法时自动将用途设为仅 **加密解密**。

## 2026-04-08（密钥管理 · 签名验签服务器算法与密钥长度）

- **`src/views/key/KeyManage0029Panel.vue`**：「密码算法」筛选与「生成密钥」中「密钥算法」含 **SM2 / RSA / SM4 / 3DES / AES**；`KEY_SIZES_BY_ALGORITHM` 固定为 **SM2→256**、**RSA→2048**、**SM4→128**、**3DES→112**、**AES→128**；切换算法时自动将密钥长度设为对应值。

## 2026-04-08（监控总览 · 制作解信封无悬浮明细）

- **`src/views/Dashboard.vue`**：**制作信封**、**解信封** 不再配置 `detail`、无 **P1/P7 悬浮内容**，且不展示信息图标；仅 **签名业务 / 验签业务** 保留两列悬浮明细。

## 2026-04-08（监控总览 · 悬浮按签名/验签业务裁剪）

- **`src/views/Dashboard.vue`**：悬浮明细按业务类型裁剪：`签名业务` 仅显示 `P1/P7 签名成功/失败`；`验签业务` 仅显示 `P1/P7 验签成功/失败`；其余业务仍展示完整两列明细。

## 2026-04-08（监控总览 · 业务数据悬浮改为P1/P7两列）

- **`src/views/Dashboard.vue`**：业务数据提示框内容改为两列展示：左列 `P1` 四项（签名成功/失败、验签成功/失败），右列 `P7` 四项（签名成功/失败、验签成功/失败）；新增 `.biz-detail-tooltip-grid` 双列布局样式。

## 2026-04-08（监控总览 · 业务数据增加总和）

- **`src/views/Dashboard.vue`**：业务数据每项在“成功、失败”之外新增“**总和（成功+失败）**”一行；同时把“成功总数/失败总数”文案恢复为“成功/失败”。

## 2026-04-08（监控总览 · 业务数据悬浮细项与对齐）

- **`src/views/Dashboard.vue`**：业务数据每项的悬浮内容改为 8 个明细：`P1 签名成功/失败`、`P1 验签成功/失败`、`P7 签名成功/失败`、`P7 验签成功/失败`；使用 `el-tooltip` 内容插槽按行展示。
- **`src/views/Dashboard.vue`**：业务数据卡改为 `成功总数 / 失败总数` 文案；成功失败数据文本改为左对齐，同时通过固定内容宽度 + 自动外边距保持整体视觉居中。

## 2026-04-08（监控总览 · 业务统计改版与服务连接移除）

- **`src/views/Dashboard.vue`**：删除「**服务与连接**」整块（模板、`serviceList` 数据与 `.service-status` 样式）。
- **`src/views/Dashboard.vue`**：业务统计「数据统计」去掉 **用户数量** 指标。
- **`src/views/Dashboard.vue`**：业务数据改为每项 **成功/失败** 双统计；新增悬浮提示图标（`InfoFilled` + `el-tooltip`），展示 **P1 / P7 / 多包** 细分信息；示例数据按时间区间缩放后分别展示成功与失败次数。

## 2026-04-08（一键检测 · 加密卡检测隐藏详情）

- **`src/views/Detect.vue`**：`加密卡检测` 分类行不再展示 `metaLines` 详细信息，仅保留检测项名称与状态结果。

## 2026-04-08（一键检测 · 加密卡检测单项化）

- **`src/views/Detect.vue`**：加密卡检测由「连接 + 健康」两项调整为单项 **加密卡状态**（是否连接正常）；结果明细仅保留该单项，汇总卡中的检测项总数/正常/异常按新口径统计。

## 2026-04-08（一键检测 · 结果区卡片对齐示意图）

- **`src/views/Detect.vue`**：有结果时于 **检查结果** 卡内展示 **五张汇总卡**（整体状态、检测项总数、正常/警告/异常）；**完成时间** 下增加 **检测对象** 灰条（左 `targetLabel`、右 `x/y 正常` 配色）；下方 **服务接口检测 / 加密卡检测** 为 **分类独立折叠**（标题 + `N项` 角标 + 右侧箭头）；明细行 **左圆标、中名称+多行灰字（接口地址/响应时间等）、右状态色字**；移除原单层大折叠与 `el-tag` 行样式；删除未用 **`SuccessFilled`** 引用。

## 2026-04-08（一键检测 · 范围对齐服务接口+加密卡）

- **`src/views/Detect.vue`**：一键检测定位为 **服务接口检测** 与 **加密卡检测**；结果分类中移除 **许可证授权**、**基础设施服务**；汇总条去掉 **节点总数/正常/告警/异常** 四卡，仅保留 **整体状态**；`summary` 不再写入节点字段；注释与样式类说明同步（无多节点维度）。

## 2026-04-08（一键检测 · 去掉节点标题行）

- **`src/views/Detect.vue`**：检查结果 **节点大卡** 头部去掉 **显示器图标** 与 **「未命名节点 (IP)」** 文案；删除仅用于该展示的 `nodeDisplayName`、`resultTargetLabel` 及对应样式；移除未再使用的 **`Monitor`** 图标引用。

## 2026-04-08（监控总览 · 业务统计时间维度）

- **`src/views/Dashboard.vue`**：业务统计拆为 **固定项**（证书/用户/应用实体/并发连接）**单行横向指标**（参考示意图：上标签、下数值、竖线分隔）；中间 **时间维度** 工具栏（今天/昨天/近7天/近30天 + 日期区间）仅作用于下方 **「时间范围内」** 卡片；该卡片内 **签名/验签/制作信封/解信封** 为随筛选变化的示例数据（按日基准 × 区间天数，绿/蓝数值样式）；**无**「密码机运行概况」模块；挂载默认「今天」。

## 2026-04-08（监控总览 · 业务统计昨日与日期宽度）

- **`src/views/Dashboard.vue`**：**昨日** 单日区间使用 **yesterdayScale** 与今日区分示例量；单位 **次（今日）/ 次（昨日）/ 次（所选日）/ 多天合计**；日期区间 **`size="small"`**，宽度 **220px**。

## 2026-04-08（监控总览 · 时间维度并入时间范围内卡片）

- **`src/views/Dashboard.vue`**：**时间维度** 工具栏移入 **「时间范围内」** `page-card` 内（标题下、指标条上）；**`biz-time-toolbar--embedded`** 去掉独立卡片边框与阴影，底部分隔线与下方统计行衔接。

## 2026-04-08（0019 生成密钥 · 去掉应用接口句柄）

- **`src/views/key/KeyManage0019Panel.vue`**：删除 **应用接口句柄**（`hAppHandle`）表单项、`keyForm` 字段、校验规则及打开弹窗时的重置赋值。

## 2026-04-08（密钥管理 · 搜索栏布局）

- **`src/views/key/KeyManage0029Panel.vue`**、**`src/views/key/KeyManage0019Panel.vue`**：搜索区改为 **白底工具栏**（`key-search-toolbar`）；条件项 **左侧文案标签**（密钥ID、**密码算法**、密钥用途、添加时间）+ 控件横向排列；下拉默认文案 **「全部」**；**添加时间** 区间分隔符改为 **「-」**；**查询 / 重置** 与条件同排；样式使用 **`variables.scss`** 间距与边框变量。

## 2026-04-08（一键检测 · 汇总条位置与导出按钮）

- **`src/views/Detect.vue`**：**五张汇总卡**移至 **一键检测卡片** 与 **检查结果卡片** 之间的 **`detect-stat-strip`**（透明、无底板样式）；**导出报告** 仅在已有 **`summary`**（已出检查结果）时 **`v-if` 显示**。

## 2026-04-08（一键检测 · 检查结果样式参考图）

- **`src/views/Detect.vue`**：检查结果区参考示意图——**工具栏**「检查结果」+ **导出报告**（`Download` 图标、原型提示）；**五张汇总卡**（整体状态 / 节点总数 / 正常·告警·异常节点，`个` 后缀、白底浅阴影）；**节点结果大卡**（可折叠头部：箭头、`Monitor`、未命名节点+IP、四色圆点汇总、`inspectItemStats` 与分类项数一致、状态 `el-tag`；异常时红框）；**分类列表**（`（N项）` 标题、左侧状态 `el-tag`+名称+灰色说明）；**全部检测** 下增加示意分类「基础设施服务」MySQL/Redis；许可证授权为样式占位项。

## 2026-04-08（一键检测 · 检查结果独立模块）

- **`src/views/Detect.vue`**：**检查结果** 单独使用第二个 **`page-card`**（`results-module`），与上方「一键检测」操作区分块；根节点 `.detect` 使用纵向间距串联两卡；原 `results-block__title` 改为卡片标题「检查结果」。

## 2026-04-08（一键检测 · 去掉系统自检页签）

- **`src/views/Detect.vue`**：移除顶部 **`el-tabs`「系统自检」** 页签栏，检测配置与结果区直接置于「一键检测」标题下；删除 `activeTab` 与 `.detect-tabs` 样式。

## 2026-04-08（一键检测 · 检测方式三项）

- **`src/views/Detect.vue`**：分段控件改为 **检测方式：** — **全部检测**、**服务接口检测**、**加密卡检测**；`detectType` 为 `all` / `service` / `card`，恢复对应进度步骤与结果（仅服务 / 仅加密卡 / 全部）；空闲提示与检测对象文案随类型切换。

## 2026-04-08（一键检测 · 检查方式工具栏示意图）

- **`src/views/Detect.vue`**：检查方式区域改为**单行工具栏**——左侧「检查方式：」+ **分段单选**（仍含全局 / 节点 / 本机三项），右侧 **「开始检查」**；**白底**、标签为常规字重灰色；去掉浅灰卡片包边与底部蓝色装饰条，与最新示意图一致。

## 2026-04-08（一键检测 · 检查方式仅名称）

- **`src/views/Detect.vue`**：检查方式三个模块 **仅保留简短名称**（全局检查 / 节点检查 / 本机自检），去掉模块内说明文案；空闲提示与检测对象示例文案同步缩短。

## 2026-04-08（一键检测 · 检查方式三模块）

- **`src/views/Detect.vue`**：「检查方式」改为 **三个可选模块卡片**（**全局检查** / **节点检查** / **本机自检**），点击切换选中态；切换时清空未提交结果；未开始检查时 **`el-alert` 文案**随所选方式变化；汇总结果中 **检测对象** 展示对应 `targetLabel`（与本次检查模式一致）。

## 2026-04-08（一键检测 · 启动前样式与单页签）

- **`src/views/Detect.vue`**：顶部使用 **`el-tabs` 且仅保留「系统自检」一个页签**；配置区文案为「检查方式：」+ 固定展示 **「全局检查」**（去掉原「检测内容」多选），右侧 **「开始检查」**；**「检查结果」** 区块在未开始时展示与示意图一致的 **`el-alert` 说明**；进度条仅在检查中或已有结果时显示；检查流程固定为全局全量（原「全部检测」逻辑），移除未使用的 `VideoPlay` 图标与 `STEPS_SERVICE` / `STEPS_CARD`。

## 2026-04-08（白名单 · 仅单个 IPv4）

- **`src/views/whitelist/WhitelistConfig.vue`**：白名单条目类型限定为**单个 IPv4**；移除添加/编辑表单中的类型选择与 CIDR、IP 范围表单项；列表去掉「类型」列，列名与筛选文案改为「IP 地址」；查看弹窗同步；示例数据改为三条单 IP；编辑时若遇历史非 `single` 条目则清空 IP 并提示改为单 IP；删除确认文案改为「IP」；导出 CSV 去掉「类型」列。
- **`src/utils/whitelistIp.js`**：`parseImportLine` 仅接受单行 IPv4，含 `/` 的 CIDR 行返回明确错误提示。

## 2026-04-07（全项目 Vue 标签扫描）

- 已检索全部 `*.vue` 中 **`scoped">` 错误写法**（`scoped` 后多写双引号）：`src/` 下均已为合法 `<style lang="scss" scoped>`；仅 **`SV1.8.0/src/views/system/AdminManage.vue`** 副本曾含该笔误，已改为与主工程一致。
- 已核对 `src/` 内共 20 个 Vue 文件的 `<style` 起始行，无同类畸形闭合。
- 本地执行 **`npm run build`** 通过，用于确认生产构建下 SFC 解析无报错。

## 2026-04-07（AdminManage · style 标签笔误）

- **`src/views/system/AdminManage.vue`**：修正 `<style lang="scss" scoped">` 中 `scoped` 后多余的双引号，改为合法标签 `<style lang="scss" scoped>`，消除生产构建时 Vue 模板解析报错（`Attribute name cannot contain`）。

## 2026-04-07（Netlify 构建 · AdminManage 模板）

- **`src/views/system/AdminManage.vue`**：将 `:type` / `:class` / `:disabled` 中内联的中文字符串比较改为 `roleTagType`、`statusRowClass`、`isSuperAdmin` 辅助函数及 `ROLE_SUPER`、`STATUS_OK` 常量，避免模板属性值内嵌引号在部分环境下触发 Vue 模板解析报错。

## 2026-04-07（删除仓库中 GMT 0019 PDF）

- 从仓库移除 `GMT+0019-2023+通用密码服务接口规范DI.pdf`（Git 跟踪文件删除），用于清理 GitHub 仓库中的该文档文件。

## 2026-04-07（Git 初始化与 GitHub 远程）

- 新增 **`.gitignore`**（忽略 `node_modules/`、`dist/`、日志与常见编辑器目录等）。
- 在项目根目录执行 **`git init`**，首次提交 `chore: initial commit - SVS 1.7.1 prototype (Vue 3 + Vite)`，并添加远程 **`origin`** → `https://github.com/Clair-Lin/svs18.git`。
- 当前环境向 GitHub **推送失败**（连接超时 / 无法交互输入账号），需在可访问 GitHub 的本机完成登录后执行：`git push -u origin main`。

## 2026-04-07（白名单搜索改为按钮触发）

- **`src/views/whitelist/WhitelistConfig.vue`**：搜索栏新增「查询」「重置」按钮；筛选逻辑由输入即筛选改为“点击查询后才生效”（引入 `appliedSearchIp/appliedSearchRemark` 作为已提交条件），并支持回车触发查询。

## 2026-04-07（侧栏系统管理图标修复）

- **`src/components/layout/Sidebar.vue`**：将「系统管理」菜单图标由 `Setting` 调整为 `Tools`，并在 `.el-sub-menu__title` 增加图标与文字颜色兜底（`color: #fff`），修复该菜单图标不显示问题。

## 2026-04-07（顶栏面包屑 · CA根证 / 证书管理示意图）

- **CA 根证**：去掉页面内重复 `el-breadcrumb`，仅保留顶栏（`Header`）面包屑；`CACert.vue` 用 `watchEffect` + `setPageBreadcrumbItems` 写入「签名验签服务 / CA根证管理 / 当前 Tab」；路由 `/cert/ca` 的 `meta` 改为 `dynamicBreadcrumb: true`。`src/views/cert/CACert.vue`、`src/router/index.js`。
- **证书管理**：对齐示意图——仅两 Tab「证书管理」「证书申请管理」；筛选为 **应用编号**、**应用证书名称** 与查询/重置；主按钮「导入加密证书」；表格十列：应用证书名称/主体DN、算法类型、版本号、证书分类、证书序列号、证书主体、证书状态、生效时间、到期时间、操作（查看）；默认空列表以呈现「暂无数据」；详情弹窗字段同步。移除页内面包屑（沿用顶栏三段路径）。`src/views/cert/CertManage.vue`。

## 2026-04-07（CA根证管理 · DN/有效期与黑名单）

- **`src/views/cert/CACert.vue`**：面包屑「签名验签服务 / CA根证管理 / 当前子页」；顶栏 `el-tabs`——**CA根证管理**（筛选：**DN**、**有效期**日期范围、查询/重置；导入根证书；列表不含已拉黑项；操作：查看、删除、加入黑名单；分页）；**黑名单管理**（导出、批量移出、多选表格、单行移出）。导入/详情弹窗；示例数据含一条已在黑名单的根证。

## 2026-04-07（证书管理 · DN/有效期与黑名单）

- **`src/views/cert/CertManage.vue`**：面包屑「签名验签服务 / 证书管理 / 当前子页」；顶栏 `el-tabs`——**证书管理**（筛选：证书编号、应用证书名称、**DN**、**有效期**（`daterange` + `value-format`）与查询/重置；「导入加密证书」；表格列对齐示意图：应用证书名称/密钥摘要、算法类型、颁发者、证书状态、生效/到期、操作；客户端筛选与分页）；**证书申请管理**（`el-empty` 占位）；**黑名单管理**（导出、批量移出黑名单、多选表格）。导入加密证书弹窗：证书名称、上传、证书保护密码、密钥访问口令；证书详情弹窗。

## 2026-04-07

- **白名单配置页增强**：`WhitelistConfig.vue` 与新建 `src/utils/whitelistIp.js`（IPv4/CIDR 校验、CIDR 转数值区间、与列表重叠检测；`ipToLong` 用乘法避免首段≥128 时位运算符号问题）。添加/编辑弹窗：类型「单个 IP / CIDR / IP 范围」动态表单项，备注、是否启用；表单校验 + 防抖重叠提示；展示当前条数/最大 1000。工具栏：批量删除、批量启用/禁用、批量导入（上传 txt/csv 或粘贴，每行 IP 或 CIDR）、导出 CSV（UTF-8 BOM）。列表：IP地址/段、类型、备注、状态开关、添加时间、最后修改人/时间；按 IP、备注筛选；客户端分页。删除确认文案含「删除后该 IP/网段将无法访问」；保存/批量/导入/行内启用开关后弹窗询问是否立即生效并说明热加载与重启建议。

- **白名单合并为单一界面**：侧栏「系统管理」下仅保留一项「白名单配置」`/system/whitelist`（去掉嵌套子菜单 `system-whitelist`）。新增 `WhitelistConfig.vue`：统一说明「访问 IP / P / 服务白名单」为同一策略（仅允许名单内应用服务器 IP 访问签名验签服务器）、连接白名单与密码机授权、本页支持添加/查看/删除（及编辑）；表格列「应用服务器 IP」；操作含查看弹窗、删除确认。删除 `IPWhitelist.vue`、`ServiceWhitelist.vue`。路由：`/system/whitelist` 为主；`/whitelist/ip`、`/whitelist/service`、`/system/whitelist/ip`、`/system/whitelist/service` 均重定向至 `/system/whitelist`。更新 `Sidebar.vue`、`src/router/index.js`。

- **白名单（系统管理下重新归类与界面）**：侧栏移除顶层「白名单配置」，在「系统管理」下增加嵌套子菜单「白名单配置」：`访问IP白名单（P）` → `/system/whitelist/ip`、`服务白名单` → `/system/whitelist/service`；`default-openeds` 增加 `system-whitelist`。路由：`/system/whitelist/ip`、`/system/whitelist/service`，原 `/whitelist/ip`、`/whitelist/service` 重定向到新路径；`meta.title` 同步。`IPWhitelist.vue`：面包屑「系统管理 / 白名单配置 / 访问IP白名单（P）」；标题与「功能说明」对齐 P 白名单、连接白名单/服务白名单配合说明；`el-alert` 与开关文案「启用P白名单」。`ServiceWhitelist.vue`：面包屑与功能说明对齐「白名单配置 / 连接白名单 / 授权认证」及添加查看删除；表格操作列「查看、编辑、删除」；弹窗支持查看（只读）、编辑、添加及删除确认。涉及 `Sidebar.vue`、`src/router/index.js`、`IPWhitelist.vue`、`ServiceWhitelist.vue`。

- **密钥管理界面（P1/P2 对齐）**：更新 `src/views/key/KeyManage.vue`。
  - **P1 列表页**：增加面包屑「签名验签服务 / 密钥管理」；筛选区为密钥 ID、密钥算法（含全部）、密钥用途（含全部）、添加时间范围及「查询」「重置」；主操作「生成密钥」「恢复密钥」；表格列为密钥索引、密钥 ID、密钥算法及用途（双行展示）、副本状态（含说明图标）、添加时间、操作（详情、备份、销毁、查看密钥访问口令）；分页按筛选结果总数切片展示。
  - **P2 详情弹窗**：标题「密钥详情」；键值行展示密钥 ID、密码算法及用途（`算法 | 用途`）、副本状态（绿色）、添加时间（毫秒时间戳，与参考示意一致）。
  - **创建密钥（方案 B：双 Tab）**：弹窗内 `el-tabs`——**常用**：密码算法、密钥用途（复选）、密钥长度、密钥访问口令；**GM/T 0019-2023**：应用接口句柄 `hAppHandle`、密钥容器名 `pucContainerName`、容器名 UTF-8 字节长度（只读，对应 uiContainerLen/uiContainerNameLen）、与常用联动的密码算法与密钥模长 `uiKeyBits`、`uiKeyUsage`（SM2/RSA 分支选项）、`uiExportFlag`。去掉原「0019 补充参数」折叠区。`src/constants/gmt0019.js` 改为导出 `SM2_KEY_USAGE_OPTIONS`、`RSA_KEY_USAGE_OPTIONS`、`EXPORT_FLAG_OPTIONS`。
- **撤销独立 0019 页**：删除 `src/views/key/KeyCreate0019.vue`，移除路由 `/key/create-0019` 及侧栏「0019创建密钥」。

## 2026-04-07（续）

- **密钥管理按 GM/T 0029 / 0019 分界面（方案 A）**：`/key/manage` 重定向至 `/key/manage/0029`；新增路由 `/key/manage/0029`（`KeyManage0029.vue`，GM/T 0029 产品样式：列表列 密钥索引/密钥ID/密钥算法/密钥用途/密钥长度/添加时间/操作；生成密钥为四字段弹窗）、`/key/manage/0019`（`KeyManage0019.vue`，原双 Tab 0019 逻辑）；删除原 `KeyManage.vue`。更新 `src/router/index.js`。
- **侧栏结构**：「签名验签服务」下增加嵌套子菜单「密钥管理」，其下两个子页面菜单项：`GM/T 0029`、`GM/T 0019-2023`（分别对应 `/key/manage/0029`、`/key/manage/0019`）；`el-menu` 设置 `default-openeds` 含 `sign-service`、`key-manage` 便于展开。更新 `src/components/layout/Sidebar.vue`。

## 2026-04-07（证书式顶栏 Tab）

- **密钥管理与证书管理一致的单页双 Tab**：新增 `src/views/key/KeyManage.vue`（`page-card` + 面包屑「签名验签服务 / 密钥管理 / 当前 Tab 名」+ 顶栏 `el-tabs`：`GM/T 0029`、`GM/T 0019-2023`）；内容分别为 `KeyManage0029Panel.vue`、`KeyManage0019Panel.vue`（无独立面包屑）。新增 `KeyManage0019Panel.vue`；删除整页 `KeyManage0029.vue`、`KeyManage0019.vue`。
- **路由**：`/key/manage` 指向 `KeyManage.vue`；`/key/manage/0029`、`/key/manage/0019` 仅 **redirect** 至 `/key/manage?tab=0029` 与 `/key/manage?tab=0019`（兼容旧链接）。`src/router/index.js`。
- **侧栏**：「签名验签服务」下恢复 **单菜单项**「密钥管理」`index="/key/manage"`；`default-openeds` 仅 `sign-service`。`src/components/layout/Sidebar.vue`；`/key/manage` 路径高亮统一为该项。

## 2026-04-07（密钥 Panel 弹窗与样式对齐）

- **0019 生成密钥**：去掉弹窗内「常用 | GM/T 0019」双 Tab，**仅保留 GM/T 0019-2023 单表单**（顶部说明 `el-alert` + hAppHandle / 容器名 / 容器名长度 / 算法 / 模长 / uiKeyUsage / 导出）；移除 `usage`、`password` 及对应校验。`src/views/key/KeyManage0019Panel.vue`。
- **0029 / 0019 样式统一**：两 Panel 根节点统一 `class="key-panel"`；生成密钥弹窗统一 **宽度 560px**、`label-width="120px"`；详情弹窗标签列统一 **120px**。`KeyManage0029Panel.vue`、`KeyManage0019Panel.vue`。

## 2026-04-07（0019 列表列拆分）

- **GM/T 0019 列表**：原「密钥算法及用途」合并列改为 **「密钥算法」**（`algorithmSpec`）、**「密钥用途」**（`usageLabel`）两列，宽度与 0029 侧列表风格一致（各 120px）。详情弹窗同步为两行展示算法与用途。`src/views/key/KeyManage0019Panel.vue`。

## 2026-04-07（密钥管理 Tab / 面包屑规范全称）

- **名词区分**：`KeyManage.vue` 增加 `tabCopy`，顶栏 Tab 为「GM/T 0029-2014 签名验签服务器」「GM/T 0019-2023 通用密码服务接口」；面包屑第三段为「GM/T 0029-2014 · 签名验签服务器技术规范」「GM/T 0019-2023 · 通用密码服务接口规范」。
- **提示文案**：0019 生成密钥 `el-alert` 与成功 `ElMessage`、0029 成功提示、`src/constants/gmt0019.js` 文件头注释、`src/router/index.js` 路由注释，与上述规范名称对齐。

## 2026-04-07（0019 生成密钥表单按标准枚举）

- **密钥类型**：原「密码算法 + 密钥模长」改为单一下拉 **密钥类型**，选项 `1：SM2`～`5：RSA4096`。**密钥长度**为只读，由类型映射比特长度（`KEY_TYPE_TO_BITS_0019`，占位 `uiKeyBits[in]`）。
- **密钥用途**：选项改为 `1：加密`、`2：签名`、`3：密钥交换`。
- **导出**：单选项文案改为「不可导出」「可导出」（仍为 `uiExportFlag` 0/1）。
- `src/constants/gmt0019.js` 导出 `KEY_TYPE_OPTIONS_0019`、`KEY_USAGE_OPTIONS_0019`、`KEY_TYPE_TO_BITS_0019`，移除原 `SM2_KEY_USAGE_OPTIONS` / `RSA_KEY_USAGE_OPTIONS`。`KeyManage0019Panel.vue` 表单与 `keyForm` 字段同步调整。
- **0019 下拉文案**：密钥用途展示为「加密」「签名」「密钥交换」；密钥类型为「SM2」「RSA1024」…「RSA4096」（无数字前缀）。修复 `KEY_TYPE_TO_BITS_0019` 类型→比特映射对象。

## 2026-04-07（FeatureList 界面）

- **监控总览（对齐 FeatureList 监控功能）**：`src/views/Dashboard.vue` 增加页头说明；分块标题「系统状态与资源」「业务统计」「网络监控」「SNMP 监控」「服务与连接」「告警」；设备信息增加**连接数**；新增业务指标网格（管理员访问、证书/用户/应用实体数量、并发连接、签名/验签、制作/解信封）；新增**网络接口状态**表；SNMP 卡片标题改为「SNMP 服务与采集指标」；示例时间改为 2026。
- **导航与路由标题**：侧栏与 `meta.title` 由「设备资源」改为「监控总览」。`Sidebar.vue`、`src/router/index.js`。
- **一键检测**：服务接口说明与进度文案对齐「获取服务器证书、签名、验签」；结果表核心三项 + 全部检测时附加加密/证书/管理接口；按检测类型汇总检测项数量。`src/views/Detect.vue`。
- **白名单文案**：IP 白名单、服务白名单页顶 `el-alert` 与 FeatureList 中访问控制描述一致。`IPWhitelist.vue`、`ServiceWhitelist.vue`。

## 2026-04-07（监控总览调整）

- **业务统计**：去掉「管理员访问次数」指标。`src/views/Dashboard.vue`
- **SNMP**：移除整段 SNMP 监控 UI 与 `snmpMetrics` 等数据；删除相关样式。
- **告警**：整块「系统告警」用 `showAlarmSection`（默认 `false`）控制，暂隐藏；需恢复时将 `showAlarmSection` 改为 `true`。
- **文案**：页头说明与 `router/index.js` 中监控路由注释去掉 SNMP 表述，与当前页面一致。

## 2026-04-07（监控总览 · 网络并入基本信息）

- **设备基本信息卡片**：按示意图改为「健康状态 + CPU 型号 + CPU 核数」行式展示；其下 **网络状态**（管理端口/服务端口 + 状态徽标）、**网口列表** 表（网口、IP、流量列内上下行 Mb/s）。移除独立「网络监控」分块与原 `networkInterfaces` 宽表。
- **数据**：`deviceBasic`、`networkPorts`、`nicTrafficList` 示例值与参考图一致（含 lo / eth0 流量）。`src/views/Dashboard.vue`；监控总览页头说明同步。

## 2026-04-07（监控总览 · 使用率环形图）

- **CPU / 内存 / 硬盘**：由半圆仪表盘改为 **ECharts 环形图**（`#1890ff` 已用 + `#f0f0f0` 底环）；CPU 卡片内居中展示；内存、硬盘为 **左侧环图 + 右侧**「已使用」「可用/全部」文案，示例数值与设备资源示意图一致（CPU 6.7%、内存 56.71% / 4.29G / 3.28G&7.57G、硬盘 13.44% / 8.22G / 52.97G&61.19G）。`src/views/Dashboard.vue`

## 2026-04-07（监控总览 · 服务状态精简）

- **服务状态表**：去掉「监控服务」「管理服务」两行，仅保留签名 / 加密 / 证书；`totalServiceConnections` 按三行 connections 汇总改为 42。`src/views/Dashboard.vue`

## 2026-04-07（一键检测 · 菜单与页面精简）

- **侧栏**：「一键检测」从顶层移至 **系统管理** 子菜单最后一项；`default-openeds` 增加 `system` 以便展开。`Sidebar.vue`
- **路由**：正式路径改为 `/system/detect`；原 `/detect` **redirect** 至 `/system/detect`。`src/router/index.js`
- **Detect 页**：服务接口仅保留证书/签名/验签三项，加密卡为描述列表；汇总按所选检测范围统计。`src/views/Detect.vue`

## 2026-04-07（一键检测 · 恢复分块）

- **分块检测**：恢复三块可选——**全部检测**、**服务接口检测**、**加密卡检测**；进度步骤随类型变化。（后续统计项与 UI 以「系统自检式布局」条为准。）`src/views/Detect.vue`

## 2026-04-07（一键检测 · 系统自检式布局）

- **布局对齐参考图**：面包屑「系统管理 / 一键检测」；`el-tabs` 首项「一键检测」+「业务自检」「服务探测」占位（disabled）。
- **工具区**：检测方式「全局检测 / 节点检测」（原型展示）；保留三块检测范围；**开始检测** + 全宽进度条（完成后 100%，成功/失败配色）。
- **统计卡**：整体状态、检测项总数、正常、警告、异常（五卡横排，响应式降级）。
- **分块结果**：检测对象标题行；`el-collapse` — **服务接口检测**（行式：图标 + 接口名 + 元数据 + 标签）、**加密卡检测**（连接/健康两项）、**检测汇总**（文字 + 完成时间）。
- **计数**：含加密卡时按 **连接 + 健康** 2 子项计入总数（全部模式共 5 项）。`src/views/Detect.vue`

## 2026-04-07（一键检测 · 去页签与汇总折叠）

- 去掉 `el-tabs` 及占位分页，仅保留 **一键检测** 页（面包屑 + 卡片标题）。
- **检测内容**：单行 `el-radio-button` — 全部检测 / 服务接口检测 / 加密卡检测（取代原「检测方式」+ 三卡片）。
- 保留顶部 **五卡统计**；删除底部 **检测汇总** `el-collapse-item`；完成时间改在统计卡下方一行展示。
- `src/views/Detect.vue`

## 2026-04-07（一键检测 · 切换内容清空结果）

- 切换「检测内容」单选项时 **清空** 统计卡、分块结果、进度与完成时间；若正在检测则 **清除定时器** 并结束检测中状态。`src/views/Detect.vue`

## 2026-04-07（0019 生成密钥 · 类型与长度简化）

- **密钥类型**仅 **SM2**、**RSA**；**密钥长度**为下拉，SM2 仅 **256**、RSA 仅 **2048**（`KEY_LENGTHS_BY_TYPE_0019`），切换类型时 `syncKeyLengthForType` 自动校正当前长度。
- 移除 **容器名长度**表单项及 `uiContainerLen` 计算属性。
- `gmt0019.js`：以 `KEY_LENGTHS_BY_TYPE_0019` 取代原 `KEY_TYPE_TO_BITS_0019` 与多档 RSA 类型枚举。

## 2026-06-04（网络配置 · 接口管理弹窗与网口列表）

- **`src/utils/networkInterface.js`**（新）：物理网口演示数据（ETH0–ETH4）、用途/主接口/bond 模式等枚举与 `formatIpCell` 工具。
- **`src/views/system/network/NetworkPortPanel.vue`**：网口列表对齐设计图——接口别名、接口名、IP/掩码/网关（IPv4/IPv6 双行）、用途、网口状态图标、禁/启用开关；操作 **编辑**（「接口编辑」弹窗：用途单选 + IPV4/IPV6 页签）、**网口详情**（只读详情弹窗）。
- **`src/views/system/network/NetworkSubInterfacePanel.vue`**：**添加** 打开「添加子接口」弹窗（归属主接口、禁/启用、IP 类型、IP、掩码）；添加后写入列表。
- **`src/views/system/network/NetworkBondPanel.vue`**：**添加** 打开「添加聚合接口」弹窗（bond. 前缀名称、bond 模式、绑定网口多选 + 提示、IPV4/IPV6 页签）。
- **`src/views/system/network/NetworkVlanPanel.vue`**：**添加** 打开「添加VLAN」弹窗（VLAN. 前缀 ID、关联接口、禁/启用、IPV4/IPV6 页签）。
- **`src/views/system/network/networkPanel.scss`**：补充双行单元格、网口状态图标、IP 页签、详情列表、带前缀输入框等共用样式。
- **`src/views/system/network/networkDialog.scss`**（新）、**`NetworkConfig.vue`**：各 Tab 弹窗统一对话框头/脚样式。

## 2026-06-04（密钥管理 · PQC 算法「新」角标）

- **`src/views/key/KeyManage0029Panel.vue`**：查询区「密码算法」将 PQC 项归入 **PQC算法** 分组，分组标题展示 **新** 角标；生成密钥下拉 **PQC体系密钥** 分组同步 **新** 角标（与 IBC 的 V1.9.1 样式一致）；选择 PQC 类型时表单项「密钥类型」旁显示 **新**（非 PQC/IBC 不再误显示）。

## 2026-06-04（密钥管理 · PQC 角标改为 V1.9.1）

- **`src/views/key/KeyManage0029Panel.vue`**：PQC 相关分组标题角标及选中 PQC 时「密钥类型」旁标签由 **新** 改为 **V1.9.1**（与 IBC 一致）。

## 2026-06-04（密钥管理 · 通用密码容器 Tab 角标）

- **`src/views/key/KeyManage.vue`**：「通用密码容器」页签角标由 **V1.9.1** 改为 **新**。

## 2026-06-04（网络配置 · 网桥 Tab）

- **`src/views/system/NetworkConfig.vue`**：VLAN 后新增 **网桥** Tab，路由 `?tab=bridge`。
- **`src/views/system/network/NetworkBridgePanel.vue`**（新）：**添加网桥** 按钮；列表列——网桥名称、绑定网口、操作（编辑/删除）；默认 **br0** 仅可编辑不可删除。
- **`src/utils/networkInterface.js`**：默认网桥 `br0` 及名称校验（br + 0–10）、`isSystemBridgeName` 等工具函数。
- 添加/编辑弹窗：网桥名称（`br` 前缀 + 0–10 数字）、绑定网口下拉、网关（必填）、子网掩码（选填）。
- **`NetworkBridgePanel.vue`**：网桥添加/编辑弹窗样式优化（白底标题栏、表单项间距与右对齐标签、统一 32px 控件高度、底栏按钮右对齐），表单文案与字段未改。
- **`networkDialog.scss`**：接口管理全部弹窗收紧头/体/脚内边距（约 16–20px 横向）；表单项间距 16px；网口详情弹窗与网桥弹窗同步收紧。

## 2026-06-04（检测中心 · 设备自检增加 SM1）

- **`src/utils/inspectCenter.js`**：国密算法类新增 **SM1算法自检**；设备自检共 **14 项**；schema **v6** 自动为历史记录补齐该项并保留其余项状态。
