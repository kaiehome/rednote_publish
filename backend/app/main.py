from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import register_routers

app = FastAPI(title="小红书矩阵AI运营平台API")

# 跨域配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册所有路由
register_routers(app)

@app.get("/ping")
def ping():
    return {"msg": "pong"}
