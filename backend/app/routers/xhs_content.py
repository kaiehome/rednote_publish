from fastapi import APIRouter

router = APIRouter()

@router.get("/list")
def list_contents():
    """获取内容创作任务列表"""
    return {"contents": []}
