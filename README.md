# navigation_trae

一个简洁、紧凑、可自定义的站点导航页面，支持多导航页管理、分组管理、站点卡片、拖拽排序、数据导入导出、主题切换和多语言切换。

## 功能特性

- **多导航页管理**：支持创建、编辑、删除多个导航页，可在顶部下拉或标签页切换。
- **分组管理**：每个页面支持多个分组，可自定义分组名称和颜色。
- **站点卡片**：每个分组下可添加站点，支持名称、地址、描述、图标和视觉特效。
- **拖拽排序**：编辑模式下可拖拽分组和站点进行排序，也支持跨分组移动站点。
- **视觉特效**：站点卡片支持高亮、闪烁、跳动、抖动四种视觉效果。
- **数据导入导出**：支持将导航数据导出为 JSON 文件，或从 JSON 文件导入；导入时可预览页面、分组和站点数量，并选择导入模式。
- **主题切换**：支持浅色、深色、跟随系统三种主题模式。
- **多语言支持**：支持中文和英文切换。
- **自定义布局**：可设置每行显示的分组数量、站点卡片布局（水平 / 垂直 / 紧凑）、卡片显示内容等。
- **图标获取**：添加站点时可通过多种图标服务（Google、DuckDuckGo、Clearbit、Icon Horse 等）自动获取站点图标，支持智能选择最快服务。
- **浏览器扩展**：支持打包为 Chrome / Edge 扩展，替换浏览器默认新标签页。

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式方案**：Tailwind CSS 3
- **状态管理**：Zustand
- **拖拽排序**：@dnd-kit/core + @dnd-kit/sortable
- **图标库**：lucide-react
- **本地存储**：localStorage 持久化应用数据和配置

## 安装与运行

### 环境要求

- Node.js 18+
- pnpm（或 npm / yarn）

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

默认开发服务器地址为 `http://localhost:5174`。

### 构建生产版本

```bash
pnpm build
```

构建产物位于 `dist/` 目录。

### 预览生产构建

```bash
pnpm preview
```

### 构建浏览器扩展

```bash
pnpm build:extension
```

构建产物位于 `dist-extension/` 目录，可直接作为浏览器扩展加载：

1. 打开 Chrome / Edge 浏览器的扩展管理页面（`chrome://extensions` 或 `edge://extensions`）。
2. 开启右上角的「开发者模式」。
3. 点击「加载已解压的扩展程序」。
4. 选择项目根目录下的 `dist-extension` 文件夹。
5. 打开新标签页，即可看到自定义导航页面。

## 项目结构

```
.
├── public/
│   └── favicon.svg          # 网站标签栏图标
├── src/
│   ├── components/          # React 组件
│   ├── hooks/               # 自定义 Hooks
│   ├── pages/               # 页面组件
│   ├── store/               # Zustand 状态管理
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # 工具函数和示例数据
│   ├── App.tsx              # 应用根组件
│   ├── index.css            # 全局样式与主题变量
│   └── main.tsx             # 应用入口
├── index.html               # HTML 模板
├── package.json             # 项目依赖与脚本
├── tailwind.config.js       # Tailwind 配置
├── tsconfig.json            # TypeScript 配置
└── vite.config.ts           # Vite 配置
```

## 数据导入格式

导入文件需为 JSON 格式，支持以下两种结构：

### 完整格式（推荐）

```json
{
  "pages": [
    {
      "id": "page_1",
      "name": "常用导航",
      "color": "#3b82f6",
      "groups": [
        {
          "id": "group_1",
          "name": "搜索引擎",
          "color": "#3b82f6",
          "sites": [
            {
              "id": "site_1",
              "name": "Google",
              "url": "https://www.google.com",
              "description": "全球最大搜索引擎",
              "icon": "",
              "effects": { "highlight": true }
            }
          ]
        }
      ]
    }
  ]
}
```

### 简化格式

仅包含分组数组时，会自动创建一个默认页面：

```json
[
  {
    "name": "搜索引擎",
    "color": "#3b82f6",
    "sites": [
      { "name": "Google", "url": "https://www.google.com" }
    ]
  }
]
```

## 导入模式

- **导入到当前页面**：用文件中第一个页面的分组和站点覆盖当前导航页。
- **作为新页面导入**：将文件中的页面作为新页面追加到现有数据中。
- **替换所有数据**：用导入文件完全覆盖所有现有数据。

## 配置说明

应用配置（主题、语言、布局等）会自动保存到浏览器 `localStorage`，无需手动编辑文件。

## 部署

构建完成后，可将 `dist/` 目录部署到任意静态站点托管服务，例如：

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

## 许可证

MIT
