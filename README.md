# 看看Rekeless在干什么捏

这是一个实时展示指定Steam用户游戏状态和TeamSpeak服务器状态的网页应用。通过整合Steam API和TeamSpeak服务器查询，提供简洁直观的状态展示界面。

## 功能特点

- 实时显示Steam用户在线状态、当前游戏信息
- 展示用户游玩时长排名前三的游戏
- 实时监控TeamSpeak服务器状态及在线用户
- 响应式设计，适配各种屏幕尺寸
- 优雅的半透明玻璃态UI设计
- 自动刷新和页面可见性感知更新

## 技术栈

- **前端**：HTML5、CSS3、JavaScript、Bootstrap 5
- **后端**：Node.js、Express
- **API集成**：Steam Web API、TeamSpeak Server Query

## 部署说明

### 前提条件

- Node.js (v14+) 环境
- Steam API 密钥（可从[Steam开发者网站](https://steamcommunity.com/dev/apikey)获取）
- TeamSpeak 服务器访问权限

### 安装步骤

1. 克隆或下载项目代码
2. 安装依赖包：
```bash
npm install express ts3-nodejs-library axios
```
3. 配置服务器信息：
   - 编辑`server.js`中的`CONFIG`对象，填入你的Steam API密钥、SteamID和TeamSpeak服务器信息
4. 启动服务器：
```bash
node server.js
```
5. 访问 `http://localhost:3000` 即可查看页面

## 页面功能说明

1. **Steam状态卡片**：
   - 显示用户头像、名称和在线状态
   - 若用户正在游戏，显示游戏封面和名称
   - 若用户未在游戏，显示其游玩时长前三的游戏

2. **TeamSpeak状态卡片**：
   - 显示服务器在线状态和在线人数
   - 列出当前在线用户及其在线时长
   - 提供"加入服务器"按钮，一键连接

## 数据刷新机制

- 页面每30秒自动刷新一次数据
- 当页面从后台切换到前台时，自动触发数据刷新
- 网络错误时会自动重试，最多重试5次

## 版本信息

当前版本：V2.1.6

## 声明

本网页由Deepseek R1与OpenAI GPT-4模型生成，由Rekeless进行部署。
