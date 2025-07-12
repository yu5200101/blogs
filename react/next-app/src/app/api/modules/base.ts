import api from '@/app/api/axios/index'
import type { AxiosResponse } from 'axios'

export const getUserInfo = (): Promise<AxiosResponse> => api.get('/getUserInfo')
