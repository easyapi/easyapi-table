import http from '~/api/request'

export const account = {
  /**
   * 获取用户信息
   *
   */
  getUser(): Promise<ApiResponse> {
    return http.get(`${http.baseUrl}/account`)
  }
}
