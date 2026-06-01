# GitHub 推送说明

> **仓库**： [Clair-Lin/svs18](https://github.com/Clair-Lin/svs18)  
> **当前开发分支**：`SVS_1.9.0`  
> **说明**：本文档记录本原型项目推送到 GitHub 的常用流程与近期推送摘要。

---

## 1. 远程与分支

| 项目 | 值 |
|------|-----|
| GitHub 远程名 | `origin` |
| 仓库地址 | `https://github.com/Clair-Lin/svs18.git` |
| 当前迭代分支 | `SVS_1.9.0` |
| 上一稳定迭代 | `SVS_1.8.0` |
| 默认分支 | `main` |

本地查看跟踪状态：

```bash
git branch -vv
git remote -v
```

---

## 2. 标准推送流程

### 2.1 提交前检查

```bash
git status
git diff
git log -5 --oneline
```

### 2.2 暂存与提交

```bash
git add <文件或目录>
git commit -m "feat(scope): 简要说明本次改动目的"
```

提交信息建议遵循仓库既有风格，例如：

- `feat(key): …`
- `feat(inspect): …`
- `fix(…): …`

### 2.3 推送到 GitHub

首次推送当前分支（仅需一次）：

```bash
git push -u origin SVS_1.9.0
```

后续增量推送：

```bash
git push origin SVS_1.9.0
```

### 2.4 网络异常时

若出现 `Could not connect to server` 或 `Connection was reset`，可在网络恢复后重试：

```bash
git push origin SVS_1.9.0
```

本地已提交但未推送时，`git status` 会提示 `Your branch is ahead of 'origin/SVS_1.9.0' by N commit(s)`。

---

## 3. 近期推送摘要（SVS_1.9.0）

| 提交 | 说明 |
|------|------|
| `5840105` | 0029 密钥列表移除 **密钥类型** 列 |
| `76475a6` | V1.9.1 角标（通用密码容器 Tab、侧栏高可用配置、IBC 分组）；SM9 用途统一为签名验签；密钥管理用户操作流程文档更新 |
| `03dd19f` | 设备自检详情导出报告；检测中心修复 |
| `11335ba` | 检测中心整合；密钥管理 0019/0029 与 PQC 类型更新 |

主要涉及模块：

- **密钥管理**：`/key/manage`（0029 / 0019 Tab、SM9 / PQC、V1.9.1 标注）
- **检测中心**：`/system/inspect`（业务检测、设备自检）
- **文档**：`docs/密钥管理-用户操作流程.md`、`operatelog.md`

---

## 4. 相关文档

| 文档 | 说明 |
|------|------|
| [README.md](../README.md) | 项目简介、技术栈、路由与运行方式 |
| [密钥管理-用户操作流程.md](./密钥管理-用户操作流程.md) | 密钥管理界面用户操作流程 |
| [界面功能说明.md](./界面功能说明.md) | 侧栏已展示界面的功能说明 |
| [operatelog.md](../operatelog.md) | 本地开发操作日志（按日期记录改动） |

---

## 5. 注意事项

1. **不要**在文档或提交中包含 `.env`、密钥、账号密码等敏感信息。
2. 原型改动除代码外，按项目约定同步更新 `operatelog.md`；涉及用户流程时同步 `docs/` 下对应文档。
3. 除 GitHub（`origin`）外，仓库可能配置了其他远程（如 Gitee）；推送前确认目标远程与分支名。
4. 合并到 `main` 或创建 Pull Request 前，建议在本地执行 `npm run dev` 验证界面可正常访问。

---

## 6. 修订记录

| 日期 | 说明 |
|------|------|
| 2026-05-29 | 初版：GitHub 推送流程、远程分支说明及 SVS_1.9.0 近期推送摘要 |
