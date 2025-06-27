from fastapi import APIRouter

router = APIRouter()

@router.get("/list")
def list_accounts():
    """获取小红书账号列表"""
    return {"accounts": []}
