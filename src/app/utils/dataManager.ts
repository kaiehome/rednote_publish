// 数据管理器 - 统一管理各个模块的数据

export interface AccountData {
  key: string;
  name: string;
  status: string;
  created: string;
}

export interface ContentData {
  key: string;
  title: string;
  status: string;
  created: string;
}

export interface DashboardSummary {
  account_total: number;
  content_total: number;
  today_publish: number;
  report_total: number;
  trend_account_total: number[];
  trend_content_total: number[];
  trend_today_publish: number[];
  trend_report_total: number[];
}

// 获取账号数据
export const getAccountData = (): AccountData[] => {
  if (typeof window === 'undefined') return [];
  const savedData = localStorage.getItem('accountData');
  if (savedData) {
    return JSON.parse(savedData);
  }
  // 如果没有保存的数据，返回空数组，让组件使用初始数据
  return [];
};

// 获取内容数据
export const getContentData = (): ContentData[] => {
  if (typeof window === 'undefined') return [];
  const savedData = localStorage.getItem('contentData');
  if (savedData) {
    return JSON.parse(savedData);
  }
  // 默认内容数据
  const defaultContent = [
    { key: "1", title: "AI生成内容1", status: "草稿", created: "2024-06-25" },
    { key: "2", title: "AI生成内容2", status: "已发布", created: "2024-06-24" },
    { key: "3", title: "小红书运营技巧", status: "已发布", created: "2024-06-23" },
    { key: "4", title: "AI写作助手使用指南", status: "草稿", created: "2024-06-22" },
  ];
  localStorage.setItem('contentData', JSON.stringify(defaultContent));
  return defaultContent;
};

// 保存内容数据
export const saveContentData = (data: ContentData[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('contentData', JSON.stringify(data));
    notifyDataChange();
  }
};

// 生成趋势数据（基于实际数据的模拟）
const generateTrend = (currentValue: number, days: number = 7): number[] => {
  const trend = [];
  for (let i = days - 1; i >= 0; i--) {
    // 基于当前值生成合理的历史趋势
    const variation = Math.random() * 0.3 - 0.15; // ±15% 的变化
    const historyValue = Math.max(0, Math.round(currentValue * (1 - i * 0.1 + variation)));
    trend.push(historyValue);
  }
  return trend.sort((a, b) => a - b); // 让趋势呈上升状态
};

// 计算今日发布数量
const getTodayPublishCount = (): number => {
  const contentData = getContentData();
  const today = new Date().toISOString().slice(0, 10);
  return contentData.filter(item => 
    item.created === today && item.status === '已发布'
  ).length;
};

// 获取仪表盘汇总数据
export const getDashboardSummary = (): DashboardSummary => {
  const accountData = getAccountData();
  const contentData = getContentData();
  
  const account_total = accountData.length;
  const content_total = contentData.length;
  const today_publish = getTodayPublishCount();
  const report_total = 3; // 固定报表数量，可以后续扩展
  
  return {
    account_total,
    content_total, 
    today_publish,
    report_total,
    trend_account_total: generateTrend(account_total),
    trend_content_total: generateTrend(content_total),
    trend_today_publish: generateTrend(today_publish),
    trend_report_total: generateTrend(report_total),
  };
};

// 监听数据变化的事件系统
let dataChangeListeners: Array<() => void> = [];

export const onDataChange = (callback: () => void) => {
  dataChangeListeners.push(callback);
  return () => {
    dataChangeListeners = dataChangeListeners.filter(cb => cb !== callback);
  };
};

export const notifyDataChange = () => {
  dataChangeListeners.forEach(callback => callback());
};

// 包装localStorage操作，自动触发数据变化事件
export const saveAccountData = (data: AccountData[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accountData', JSON.stringify(data));
    notifyDataChange();
  }
}; 