from fastapi import APIRouter

router = APIRouter()

@router.get("/tasks")
def list_matrix_tasks():
    """获取矩阵任务列表"""
    return {"tasks": []}
