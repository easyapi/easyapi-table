import http from '~/api/request'

export const qiniu = {
  /**
   * 获取用户信息
   *
   */
  getQiniuKey(): Promise<ApiResponse> {
    return http.get(`https://api.easyapi.com/qiniu/key`)
  },

  /**
   * 获取七牛空间TOKEN
   */
  getQiniuToken(): Promise<ApiResponse> {
    return http.get(`https://api.easyapi.com/qiniu/upload-token`)
  }
}
