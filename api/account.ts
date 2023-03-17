import http from '~/api/request'

export const account = {
  /**
   * 获取用户信息
   */
  getUser(): Promise<ApiResponse> {
    return http.get(`${useRuntimeConfig().public.accountUrl}/account`)
  },
}
