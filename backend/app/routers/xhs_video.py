from fastapi import APIRouter

router = APIRouter()

@router.get("/list")
def list_videos():
    """获取视频任务列表"""
    return {"videos": []}
