import httpx
from typing import Any, Dict

COMFYUI_API_URL = "http://localhost:8188"  # 默认ComfyUI本地API地址，可根据实际情况修改

async def comfyui_txt2img(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    调用ComfyUI的文生图API
    :param payload: 文生图参数
    :return: 生成结果
    """
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{COMFYUI_API_URL}/prompt", json=payload)
        resp.raise_for_status()
        return resp.json()

async def comfyui_img2img(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    调用ComfyUI的图生图API
    :param payload: 图生图参数
    :return: 生成结果
    """
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{COMFYUI_API_URL}/img2img", json=payload)
        resp.raise_for_status()
        return resp.json()
