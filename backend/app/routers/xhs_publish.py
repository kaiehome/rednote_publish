from fastapi import APIRouter

router = APIRouter()

@router.get("/list")
def list_publish():
    """获取发布记录列表"""
    return {"publish": []}
