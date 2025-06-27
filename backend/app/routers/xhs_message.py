from fastapi import APIRouter

router = APIRouter()

@router.get("/list")
def list_messages():
    """获取私信消息列表"""
    return {"messages": []}
