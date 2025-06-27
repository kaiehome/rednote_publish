from fastapi import FastAPI

def register_routers(app: FastAPI):
    # 在此处导入并注册各功能模块的路由
    from . import xhs_account, xhs_content, xhs_matrix, xhs_publish, xhs_video, xhs_data, xhs_message
    app.include_router(xhs_account.router, prefix="/xhs/account", tags=["小红书账号"])
    app.include_router(xhs_content.router, prefix="/xhs/content", tags=["小红书内容"])
    app.include_router(xhs_matrix.router, prefix="/xhs/matrix", tags=["小红书矩阵"])
    app.include_router(xhs_publish.router, prefix="/xhs/publish", tags=["小红书发布"])
    app.include_router(xhs_video.router, prefix="/xhs/video", tags=["小红书视频"])
    app.include_router(xhs_data.router, prefix="/xhs/data", tags=["小红书数据"])
    app.include_router(xhs_message.router, prefix="/xhs/message", tags=["小红书私信"])
    from . import comfyui
    app.include_router(comfyui.router, prefix="/comfyui", tags=["ComfyUI"])
    from . import dashboard
    app.include_router(dashboard.router, prefix="/dashboard", tags=["仪表盘"])
