# 植觉 · Plant Instinct — 开发复盘

> 一款帮助花艺爱好者识别花材、生成购买清单的 AI 应用。  
> 从构想到上线，51 个 commit，4 天密集开发。

---

## 项目概览

| 项目 | 详情 |
|------|------|
| **名称** | Plant Instinct · 植觉 |
| **地址** | https://plantinstinct.netlify.app |
| **仓库** | jirgigml000048-dev/- |
| **技术栈** | React · TypeScript · Vite · Gemini API · Supabase · Netlify |
| **图片库** | 86 张真实花束照片（/images/ × 48 + /image/ × 38） |
| **开发周期** | 2026-01-11 首个 commit，2026-04-07 密集开发（单日 35 commits） |

---

## 核心功能

1. **风格推荐流** — 选择风格/场合/大小/颜色/主花 → 展示匹配图库照片 → AI 生成购买清单
2. **照片识别流** — 上传花束照片 → Gemini Vision 识别花种 → 生成购买清单  
3. **花束地图** — AI 输出 `box_2d` 坐标，SVG 叠加层标注每种花的位置
4. **生成分享图** — Canvas 2D 渲染带品牌、花材清单、标注的长图
5. **链接分享** — 将清单数据 base64url 编码进 URL，对方打开即恢复
6. **Supabase 缓存** — 每张图库照片只调一次 AI，命中缓存直接返回

---

## 时间线

### 第一阶段：地基（2026-01-11）
- 搭建 React + TypeScript + Vite 项目骨架
- 设计 Material You 绿色调色板，Noto Serif SC + Manrope 字体体系

### 第二阶段：图片库 & 标签系统（2026-04-06～07 前半）
```
feat: photo library upgrade with richer tags + preview mode
feat: add /tag-photos skill for batch flower photo tagging
feat: expand photo library to 36 entries, all real images
feat: replace photo library with real bouquet images
```
从 Unsplash 占位符迁移到本地真实花束照片，建立 `PhotoEntry` 多维标签系统（风格/场合/颜色/主花/季节），新增 `?preview` 隐藏调试页。

### 第三阶段：AI 核心（2026-04-07 上午）
```
feat: better ID accuracy, flower alternatives, image annotation
feat: auto-annotation, style flow annotation, elegant annotation UI
```
- Gemini Vision 花种识别：原始版 → 增加备选花材、新手购买贴士
- 首次引入花束标注（bounding box）功能
- 标注 UI：全屏深色 Modal → **内联 SVG 叠加层**（更沉浸）

### 第四阶段：导出图片（2026-04-07 下午，最多反复的功能）
```
Redesign export card → Fix export card blank image (×3 approaches) → Replace html-to-image with Canvas 2D
```
这是整个开发中最难的一段，连续 5 个 commit 在修同一个问题：

| 尝试 | 方案 | 结果 |
|------|------|------|
| 1 | `html-to-image` 截图导出区域 | 图片区域全空白（CORS） |
| 2 | 固定定位 + `showExportCard` state | 仍空白（图片未预加载） |
| 3 | 图片始终在 DOM 中 | 仍空白（html-to-image 局限） |
| 4 | **纯 Canvas 2D 重写** | ✅ 完全可控，100% 成功 |

> **关键决策**：放弃 `html-to-image` 全量改用 Canvas 手绘。代价是代码量增加（`buildExportImage.ts` ~350 行），收益是零依赖、可精确控制每一个像素。

### 第五阶段：体验打磨（2026-04-07 晚～04-08）
```
Add Supabase photo cache
Export: object-fit cover + annotation toggle
Add 颜色系 & 主花 filter rows to StyleSelector
Export modal: scrollable + back button; localStorage persistence
4 UI fixes: daily home photo, slim banner, edge annotations, link share
```
- Supabase 缓存：从"每次都调 AI"到"只有第一次付费"
- 导出图 object-fit cover 防变形
- 标注位置修复：从"往花束中心挤"改为**推向图片边缘 + 碰撞避让**
- 链接分享功能上线
- localStorage 持久化上次生成的清单

### 第六阶段：内容 & 视觉（2026-04-08）
```
Add 27 new flower photos (p037–p063) + typography polish
Bilingual polish: add English labels across 4 components
HomeScreen: switch banner from landscape to portrait (3:4)
```
图库从 36 张扩充到 63 张，中英混排排版全面升级（类高端杂志风格）。

### 第七阶段：基础设施（2026-04-08～10，当前）
```
Fix share link: encode heroImageUrl in payload
Route Gemini API through Netlify Function proxy
Fix export image annotation layout to match page view
Fix REST API field names: inline_data→inlineData
Restore original Gemini 3 model list
```
- **分享链接**：追加 heroImageUrl 编码，修复接收方看不到图的 bug
- **Netlify Functions 代理**：国内用户无需代理，调用链改为 浏览器 → Netlify（美国） → Gemini
- 一系列 API 兼容性 bug 修复

---

## 关键技术决策

### 决策 1：放弃 html-to-image，用 Canvas 2D 手写导出

**背景**：`html-to-image` 无法捕获从本地 `/images/` 路径加载的图片（无 CORS 头）。  
**解决**：先将图片 `fetch` + `FileReader` 转为 base64 data URL，再用 Canvas 2D 手绘整张导出图。  
**代价**：350 行 Canvas 渲染代码需要手动处理字体、换行、圆角、标注。  
**收益**：完全可控，生成速度快，在所有浏览器一致。

### 决策 2：标注从全屏 Modal 改为内联 SVG Overlay

**背景**：最初花束标注是点击按钮后打开黑色全屏 Modal。  
**解决**：SVG 直接叠在图片上（`absolute inset-0 w-full h-full`），`preserveAspectRatio="none"` 配合 `viewBox="0 0 1000 1000"` 做坐标归一化。  
**效果**：标注和图片融为一体，更沉浸，可直接导出到长图。

### 决策 3：标注位置——推向图片边缘

**问题**：初版算法 `lx = cx ± 70px`，所有标注挤在花束中央互相覆盖。  
**修复**：改为 `toLeft ? 10% : 90%` 的图片宽度，再加同侧碰撞避让（MIN_GAP = 5.4%）。  
**教训**：Canvas 导出的标注算法与页面 SVG 版本要保持同步——初始两套代码不同导致导出图和页面效果不一致。

### 决策 4：Netlify Functions 代理

**问题**：`generativelanguage.googleapis.com` 在中国大陆被封锁，用户必须代理才能用。  
**方案**：把 AI 调用从浏览器端移到 Netlify 服务端函数。用户只需访问 Netlify 域名（国内可访问），服务器再调 Google API。  
**附带收益**：API Key 不再打包进前端 JS bundle（安全性提升），前端 bundle 体积从 736KB 降到 452KB。

### 决策 5：SDK → 原生 fetch

**问题**：`@google/genai` SDK v1.35.0 在 Node.js（Netlify Functions）运行时抛出 "The string did not match the expected pattern."，同样的代码在浏览器没问题。  
**方案**：完全绕过 SDK，改用原生 `fetch` 直接打 Gemini REST API。  
**踩坑**：REST API 用驼峰 (`inlineData`, `mimeType`)，Python SDK 用下划线 (`inline_data`, `mime_type`)——写错了沉默失败（图片请求 400 但错误信息不明显）。

---

## 踩过的坑（Top 5）

1. **导出图片全空白** — `html-to-image` + 跨域图片 = 必然失败。教训：涉及图片导出，优先考虑 Canvas 2D。

2. **标注位置不一致** — 页面 SVG 和 Canvas 导出用两套算法，改了一个忘了改另一个。教训：共享计算逻辑或至少在注释里标明两者需保持同步。

3. **分享链接英雄图消失** — 编码 `PurchaseList` 时没包含 `heroImageUrl`，接收方打开看不到图。教训：分享数据结构要完整，用 `SharePayload` 包装而不是直接编码业务对象。

4. **API Key 环境变量作用域** — Netlify 的环境变量有 `Build` / `Functions` 两种 Scope，只配了 `Build` 导致 Functions 里读不到。教训：迁移到服务端函数后必须检查环境变量作用域。

5. **Gemini 模型版本回退** — 把工作中的 `gemini-3-flash-preview` 换成"看起来更稳定"的 `gemini-1.5-flash`，结果后者在这个 API Key 下 404。教训：不要在没测试的情况下替换正在工作的依赖项。

---

## 架构图

```
浏览器 (React SPA)
  ├── StyleSelector → BouquetGallery → PurchaseList   [风格推荐流]
  ├── PhotoUpload → PurchaseList                        [识别流]
  ├── App.tsx (状态路由，无 react-router)
  └── fetch('/.netlify/functions/gemini')
          │
          ▼
Netlify Function (Node.js)
  └── fetch('generativelanguage.googleapis.com/v1beta/...')
          │
          ▼
Gemini API (gemini-3-flash-preview / fallback chain)

Supabase (PostgreSQL + RLS)
  └── photo_cache 表
        ├── photo_id (PK)
        ├── purchase_list (jsonb)
        └── annotations (jsonb)
```

---

## 数字

| 指标 | 数值 |
|------|------|
| 总 commit 数 | 51 |
| 最忙单日 commit | 35（2026-04-07） |
| 图片数量 | 86 张真实花束照片 |
| App.tsx 行数 | 297 行 |
| 前端 bundle 大小 | 452 KB (gzipped: 129 KB) |
| 组件数量 | 9 个 |
| 工具函数文件 | 4 个 |
| 导出图 Canvas 代码 | ~350 行 |
| 修复导出空白的 commit 数 | 5 个 |

---

## 如果重来一次

1. **第一天就用 Canvas 做导出** — 不要浪费时间在 html-to-image 上
2. **先搭 Netlify Functions，再写 AI 逻辑** — 避免后期迁移引入 SDK 兼容问题
3. **标注算法写一次，同时适配 SVG 和 Canvas** — 用一个共享的坐标计算函数
4. **部署分支管理** — 开发分支的修复需要 merge 到 main 才能上线，要明确告知（本次多次出现"修好了但用户看不到"的情况）

---

*Plant Instinct · 植觉 — Botanical Intelligence*  
*2026-04-10*
