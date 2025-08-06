// lib/auth.ts
import api from '@/app/api';

// 服务端专用认证检查
export async function isAuthenticated() {
  try {
    // 创建服务端专用的 API 实例
    const res = await api.getUserInfo();
    return res.data
  } catch (error) {
    return false
  }
}