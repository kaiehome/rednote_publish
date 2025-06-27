from fastapi import APIRouter

router = APIRouter()

@router.get("/summary")
async def dashboard_summary():
    return {
        "today_publish": 12,
        "account_total": 8,
        "content_total": 25,
        "report_total": 4,
        "trend_today_publish": [2, 4, 6, 8, 10, 12],
        "trend_account_total": [3, 4, 5, 6, 7, 8],
        "trend_content_total": [10, 12, 15, 18, 22, 25],
        "trend_report_total": [1, 2, 2, 3, 4, 4]
    } 