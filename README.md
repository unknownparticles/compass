# 🧭 奶茶与酒鬼指南针 (Milk Tea & Alcohol Compass)

> **为你指南身边的奶茶店与小酒馆。**  
> 这是一个基于 GPS 定位与设备罗盘方向的移动端友好渐进式 Web 应用 (PWA)。无论你是想来一杯午后的奶茶续命，还是深夜想找个小酒馆微醺，它都能像指南针一样为你指明方向。

---

## ✨ 功能特点

* **🗺️ 罗盘指向**：实时获取设备方向，指针直接指向最近的奶茶店或小酒馆，给你极具方向感的探索体验。
* **📡 雷达扫描**：雷达图展示你周边的奶茶与酒吧分布，极简炫酷。
* **📍 互动地图**：内置 Leaflet 地图支持，直观查看所有点位的空间方位。
* **📱 离线可用 (PWA)**：完全支持 PWA，即使在弱网或无网状态下，已预缓存的文件仍可正常秒开。
* **🔒 隐私安全**：完全基于前端进行 GPS 罗盘计算，不上传任何个人位置数据。

---

## 🛠️ 本地开发

### 前提条件
已安装 [Node.js](https://nodejs.org/) (推荐 v18 或更高版本)。

1. **安装依赖项**：
   ```bash
   npm install
   ```

2. **环境变量配置**：
   复制项目根目录下的 `.env.example` 并重命名为 `.env`：
   ```bash
   cp .env.example .env
   ```
   *如需配置特定的 Gemini API 密钥，请在 `.env` 文件中配置 `VITE_GEMINI_API_KEY`。*

3. **运行开发服务器**：
   ```bash
   npm run dev
   ```
   本地运行后，在浏览器中访问控制台输出的地址（默认为 `http://localhost:3000`）。

4. **本地打包与预览**：
   ```bash
   npm run build
   ```
   打包完成后，运行本地预览：
   ```bash
   npm run preview
   ```

---

## 🚀 部署至 GitHub Pages

本项目已配置了自动部署工作流，目标地址为：`https://unknownparticles.github.io/compass/`

### 自动部署步骤：

1. **配置 GitHub 仓库**
   在本地初始化 Git 仓库，并关联到远程仓库 `https://github.com/unknownparticles/compass.git`：
   ```bash
   git init
   git add .
   git commit -m "feat: pwa support and github pages deployment"
   git branch -M main
   git remote add origin https://github.com/unknownparticles/compass.git
   ```

2. **推送代码**
   直接推送到 `main` 分支即可自动触发构建：
   ```bash
   git push -u origin main
   ```

3. **开启 Pages 服务权限**
   - 访问 GitHub 上的项目页面 `https://github.com/unknownparticles/compass`。
   - 点击顶部菜单栏的 **Settings** -> 左侧菜单栏的 **Pages**。
   - 在 **Build and deployment** 下的 **Source** 中，将默认的 `Deploy from a branch` 改为 **`GitHub Actions`**。
   - 部署完成后，您便可以通过浏览器访问 `https://unknownparticles.github.io/compass/`。

---

## 📱 PWA 安装指南

1. **iOS (Safari)**：
   用 Safari 打开部署页面，点击底部导航栏的**“分享”**图标，选择 **“添加到主屏幕 (Add to Home Screen)”**。
2. **Android (Chrome)** / **PC 端**：
   使用 Chrome 等主流浏览器打开页面，地址栏会提示 **“安装应用”**，点击即可在桌面创建独立的 App 快捷方式。