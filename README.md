# 小红书矩阵AI运营平台

本项目包含：
- Next.js 前端（/src）
- Python FastAPI 后端（/backend/app）
- ComfyUI AI内容与视频生成集成

## 功能模块
- 账号管理
- 内容创作与AI生成
- 矩阵任务与自动化发布
- 发布管理
- 视频与素材管理
- 数据采集与分析
- 私信与互动

## 启动后端
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

## 启动前端
```bash
npm run dev
```

---
如需扩展API或前端页面，请参考各模块目录。
