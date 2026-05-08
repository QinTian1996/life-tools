# 架构决策记录

> 最后更新：2026-05-08

## 部署链路

```
你 git push → GitHub → Vercel 自动构建部署 → life-tools-kappa.vercel.app
```

- 仓库：`https://github.com/QinTian1996/life-tools`
- 本地：`~/projects/life-tools`
- 框架：Next.js (App Router) + TypeScript + Tailwind
- 域名：Vercel 自带（后续可绑自定义域名 + CDN 加速）

## LLM 接入

**原则：API Key 绝不碰前端。**

```
朋友手机 → /api/xxx → route.ts(服务端) → GLM API
                         ↑
                    Key 在此（Vercel 环境变量）
```

- 前端只调自己的 API Route（`fetch('/api/eat')`）
- 服务端从 `process.env.GLM_API_KEY` 读取
- 部署时在 Vercel → Settings → Environment Variables 中设置
- GLM 模型：`glm-4.5`（或其他 Zhipu 可用模型）
- 基础 URL：`https://api.z.ai/api/paas/v4`

## 访问控制

**当前：无限制**（先跑通再加固）

**后续方案（按需升级）：**
- 轻量：Next.js middleware 校验密码 → 写 cookie → 免重复输入
- 进阶：邀请码体系，一人一码，可控人数

**不做的事：**
- 不用 Vercel 付费密码功能
- 不做微信小程序（认证审核太重）

## 八字功能方向

```
用户输入生日 → 前端 TS 排盘 → /api/bazi → GLM 解读 → 返回报告
```

- 排盘：前端纯计算（查节气、排四柱、定格局），不调 API
- 解读：后端调 LLM，prompt 内嵌分析框架
- 不动本地已有的专业命理工作流（bazi-analysis skill / PDF 转换）

## 功能规划

| 功能 | 状态 | 说明 |
|------|:---:|------|
| 首页导航 | ✅ 已上线 | life-tools-kappa.vercel.app |
| 命里浅析 | 🔜 待开发 | 前端排盘 + LLM 解读 |
| 今天吃什么 | 🔜 待开发 | LLM 推荐 |
| AI 换衣 | ⏸ 暂缓 | 图生图成本高 |

## 开发约定

- Coding agent 负责实现，喵十七负责架构决策
- 新项目统一放在 `~/projects/`
- 不在 `~` 下直接创建文件或目录
