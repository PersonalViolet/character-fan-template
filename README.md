# character-fan-template— 可自定义人物主题的 Vue 3 前端

基于 Vue 3 + TypeScript + Vite 构建的角色主题展示页面。**开发者只需修改一个配置文件 + 替换静态资源，即可切换为不同的人物主题网站。**

## ✨ 功能

- 🎨 **配置文件驱动**：修改 `public/project.json` 即可切换主题，无需改动代码
- 🖼️ **视频展示**：支持 Bilibili 和 YouTube，自动获取封面（Bilibili 通过 JSONP 绕过 CORS）
- 🖼️ **图片画廊**：CSS Grid 响应式布局，点击跳转来源
- 🔘 **点击互动**：点击按钮计数（localStorage 持久化）、随机音效、角色图飞过屏幕
- 🎵 **音频支持**：替换 `public/audio/` 下的 mp3 文件即可
- 📱 **响应式设计**：适配手机到 4K 桌面
- 🚀 **纯静态部署**：`npm run build` 后可直接部署到任何静态托管（Vercel、Netlify、GitHub Pages 等）

## 🚀 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 构建生产版本
npm run build

# 4. 预览生产版本
npm run preview
```

## 📁 项目结构

```
├── public/
│   ├── project.json          ← ★ 核心配置文件（修改此文件即可切换主题）
│   ├── favicon.ico           ← 标签页图标
│   ├── img/                  ← 角色图片（飞行小人、头像等）
│   │   ├── chibi1.svg
│   │   ├── chibi2.svg
│   │   └── profile.svg
│   └── audio/                ← 点击音效文件
│       └── ...
├── src/
│   ├── components/
│   │   ├── PageHeader.vue    — 标题区
│   │   ├── CounterSection.vue — 计数按钮 + 飞行小人动画
│   │   ├── VideoGallery.vue  — 视频区
│   │   ├── ImageGallery.vue  — 图片画廊
│   │   └── PageFooter.vue    — 页脚
│   ├── composables/
│   │   ├── useConfig.ts      — 加载 project.json
│   │   └── useCounter.ts     — localStorage 计数器
│   ├── types/index.ts        — TypeScript 类型
│   ├── assets/main.css       — 全局样式
│   ├── App.vue
│   └── main.ts
└── index.html
```

## ⚙️ project.json 配置参考

```json
{
  // ========== 基础信息 ==========
  "title": "页面标题",              // 浏览器标签页标题
  "favicon": "/favicon.ico",         // 标签页图标路径
  "backgroundColor": "#E77471",      // 页面背景色（支持 hex/rgb/hsl）
  "characterName": "角色名",

  // ========== 页面头部 ==========
  "headerTitle": "Welcome to xxx",   // 大标题
  "headerSubtitle": "描述文字",      // 副标题

  // ========== 计数器区域 ==========
  "buttonText": "点击按钮文字",
  "counterLabel": "已点击",
  "counterUnit": "次",

  // ========== 点击动画 ==========
  "chibiImages": ["chibi1.svg", "chibi2.svg"],
        // ↑ 对应 public/img/ 下的文件名，点击时随机选一个飞过屏幕
  "audioFiles": ["mun1.mp3", "mun2.mp3", "mun3.mp3"],
        // ↑ 对应 public/audio/ 下的文件名，点击时随机播放

  // ========== 视频区 ==========
  "video": {
    "title": "视频标题",
    "subtitle": "副标题文字",
    "items": [
      {
        "id": "BV1GJ411x7h7",         // Bilibili: BV号; YouTube: 视频ID
        "platform": "bilibili",        // "bilibili" | "youtube"
        "thumbnail": ""                // 可选：自定义封面 URL，留空则自动获取
      }
    ]
  },

  // ========== 图片画廊 ==========
  "img": {
    "title": "画廊标题",
    "subtitle": "副标题文字",
    "items": [
      { "link": "https://...", "img": "https://...图片URL..." }
      // link: 点击图片跳转的链接
      // img:  图片的 URL（支持外部链接或本地 /img/xxx.jpg）
    ]
  },

  // ========== 页脚 ==========
  "footer": {
    "profileImage": "/img/profile.svg",
    "headerText": "联系方式",
    "contacts": [
      {
        "icon": "mdi:twitter",         // Iconify 图标名（可选）
        "label": "@username",          // 显示文字
        "url": "https://twitter.com"   // 点击跳转链接
      }
    ],
    "repoText": "GitHub 仓库：",
    "repoUrl": "https://github.com/...",
    "customContent": "<p>自定义 <b>HTML</b></p>"
        // ↑ 可选字段，支持任意 HTML，会渲染在联系方式下方
  }
}
```

### Iconify 图标

`contacts[].icon` 支持任意 [Iconify](https://icon-sets.iconify.design/) 图标名，格式为 `prefix:name`。

常用图标：

| 服务 | icon 值 | 颜色 |
|------|---------|------|
| Twitter/X | `mdi:twitter` | #1d9bf0 |
| GitHub | `mdi:github` | #000000 |
| Discord | `ic:baseline-discord` 或 `mdi:discord` | #5662f6 |
| YouTube | `mdi:youtube` | #ff0000 |
| Instagram | `mdi:instagram` | #e4405f |
| Email | `mdi:email` | #ea4335 |

如需更多图标颜色，在 `PageFooter.vue` 的 `brandIconColors` 对象中添加即可。

## 🎨 如何自定义主题

### 方式一：修改配置文件

编辑 `public/project.json`，修改标题、颜色、文字等。开发服务器会自动热更新。

### 方式二：替换静态资源

| 替换内容 | 路径 | 说明 |
|----------|------|------|
| 标签页图标 | `public/favicon.ico` | 替换为你自己的 .ico 文件 |
| 飞行小人 | `public/img/` | 替换图片文件（png/jpg/svg 均可），然后在 `project.json` 的 `chibiImages` 中更新文件名 |
| 页脚头像 | `public/img/` | 替换后更新 `project.json` 中 `footer.profileImage` |
| 点击音效 | `public/audio/` | 替换 mp3 文件，更新 `project.json` 的 `audioFiles` |

### 方式三：页脚自定义 HTML

在 `project.json` 的 `footer.customContent` 中写入任意 HTML：

```json
"customContent": "<p>📧 <a href=\"mailto:me@example.com\">me@example.com</a></p><p>© 2025 My Character</p>"
```

## 🔧 视频封面说明

| 平台 | 封面获取方式 |
|------|-------------|
| **YouTube** | 自动：`https://img.youtube.com/vi/{视频ID}/maxresdefault.jpg` |
| **Bilibili** | 自动（JSONP）：从 Bilibili API 实时获取封面 |
| **任意平台** | 手动：在 `thumbnail` 字段填入封面图片 URL |

- Bilibili 封面使用 JSONP 技术绕过 CORS 限制，纯静态部署可用
- 封面图片加载时使用 `referrerpolicy="no-referrer"` 绕过 CDN 防盗链
- 若自动获取失败，显示带有 BV 号的粉色渐变占位符

## 📦 部署

项目是纯静态网站，构建产物在 `dist/` 目录：

```bash
npm run build
```

将 `dist/` 目录的内容上传到任意静态托管服务：

- **GitHub Pages**：将 `dist/` 推送到 `gh-pages` 分支
- **Vercel / Netlify**：连接仓库，构建命令 `npm run build`，输出目录 `dist`
- **Nginx**：`root /path/to/dist;`
- **任何静态文件服务器**

## 📝 计数数据说明

点击按钮的累计次数存储在浏览器的 `localStorage` 中，key 为 `dania-click-counter`。这意味着：
- 每个访客的计数是独立的
- 清除浏览器数据会重置计数
- 不同设备/浏览器之间不同步

## 🛠️ 技术栈

- **Vue 3**（Composition API + `<script setup>`）
- **TypeScript**
- **Vite 8**
- **Iconify**（图标）
- **Pinia** + **Vue Router**（已安装，当前为单页未使用路由）

## 🙏 灵感来源

本项目灵感来自 [tannhauser.moe](https://github.com/KawaiiShadowii/tannhauser.moe)，一个精美的粉丝站点。

