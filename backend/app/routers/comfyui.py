from fastapi import APIRouter, Body
from app.services.comfyui_service import comfyui_txt2img, comfyui_img2img
from typing import Any, Dict
from fastapi import HTTPException

router = APIRouter()

@router.post("/txt2img")
async def txt2img(payload: Dict[str, Any] = Body(...)):
    """调用ComfyUI文生图"""
    try:
        result = await comfyui_txt2img(payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/img2img")
async def img2img(payload: Dict[str, Any] = Body(...)):
    """调用ComfyUI图生图"""
    try:
        result = await comfyui_img2img(payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
