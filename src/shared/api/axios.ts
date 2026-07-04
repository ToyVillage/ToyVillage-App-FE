import axios from 'axios'

// 공통 Axios 인스턴스. 모든 API 호출은 이 인스턴스를 경유한다(design-rules.md).
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10_000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 공통 에러 처리 자리(로깅/토큰 갱신 등)
    return Promise.reject(error)
  },
)
