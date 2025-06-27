// 抑制 Ant Design React 兼容性警告
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // 抑制特定的 Ant Design React 兼容性警告
    if (
      args[0] && 
      typeof args[0] === 'string' && 
      args[0].includes('[antd: compatible] antd v5 support React is 16 ~ 18')
    ) {
      return;
    }
    originalError.apply(console, args);
  };
} 