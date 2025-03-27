import api from '@/api/axios/index'
import type { AxiosResponse } from 'axios'

interface QueryParams {
  url: string
}

export const wxSignature = (body: QueryParams): Promise<AxiosResponse> => api.JPost('/api/test', body)
