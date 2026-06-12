# 车色偏好调研问卷

一套面向星途 EX7 六种车身颜色的沉浸式调研网站。前台提供电影级滚动视觉与 10 道问卷，其中“所负责的国家”和“负责的产品线”为选填；后台集中保存结果并展示颜色占比、综合排名、原始明细及 Excel 导出。

## 技术栈

- Next.js 16 App Router、React 19、TypeScript
- Tailwind CSS 4、Framer Motion、Recharts
- Prisma、PostgreSQL、Zod
- dnd-kit 拖拽排序、ExcelJS 导出
- Vitest、Playwright

## 环境要求

- Node.js 20.9 或更高版本
- npm 10 或更高版本

## 安装与运行

```bash
npm install
cp .env.example .env
npm run dev
```

打开：

- 问卷页面：[http://localhost:3000](http://localhost:3000)
- 数据看板：[http://localhost:3000/dashboard](http://localhost:3000/dashboard)

开发和正式环境都需要配置数据库连接。正式使用前必须配置以下变量：

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require"
ADMIN_PASSWORD="设置高强度管理员口令"
SESSION_SECRET="至少32位随机字符串"
```

`npm run dev` 会自动生成 Prisma Client，并通过 `prisma db push` 同步 PostgreSQL 表结构；`npm run start` 会在生产启动前执行同样的结构同步。

## 常用命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 生产构建
npm run start        # 启动生产服务器
npm run lint         # ESLint
npm run typecheck    # TypeScript 检查
npm test             # 单元测试和 API 测试
npm run test:e2e     # Playwright 桌面端与移动端流程测试
npm run db:studio    # 打开 Prisma Studio
```

首次执行端到端测试前安装 Chromium：

```bash
npx playwright install chromium
```

## 数据与导出

- 每条正式提交写入 PostgreSQL，浏览器 `localStorage` 只保存未提交草稿。
- `clientSubmissionId` 唯一索引用于防止重复提交。
- 排序题按第 1 名 6 分至第 6 名 1 分计算综合排名。
- Excel 文件包含“汇总指标”和“原始问卷明细”两个工作表。
- 看板使用 HttpOnly 签名 Cookie，默认会话有效期为 8 小时。

## 图片资源

六张原始透明 PNG 已转为响应式 WebP/AVIF，位于 `public/cars/`。页面不会直接加载约 124MB 的源文件，全部 Web 资源合计约 1.3MB。

## 部署说明

项目包含 `render.yaml`，可部署到 Render 免费 Node Web Service；数据库建议使用 Neon PostgreSQL 免费计划。首次部署需要在 Render 中填写 `DATABASE_URL` 和 `ADMIN_PASSWORD`，`SESSION_SECRET` 由 Render 自动生成。

正式部署步骤：

1. 将项目推送到 GitHub、GitLab 或 Bitbucket。
2. 登录 Render，选择 **New > Blueprint** 并连接该仓库。
3. 在 Neon 创建或认领 PostgreSQL 数据库，复制 pooled `DATABASE_URL`。
4. 在 Render Blueprint 页面填写 `DATABASE_URL` 和 `ADMIN_PASSWORD`。
5. 确认创建免费 Web Service。
6. 部署完成后使用 Render 提供的长期 `onrender.com` 地址；绑定自有域名后可使用正式品牌域名。
