import http from '~/api/request'

export const qiniu = {
  /**
   * 获取七牛空间KEY
   *
   */
  getQiniuKey(): Promise<ApiResponse> {
    return http.get('https://api.easyapi.com/qiniu/key')
  },

  /**
   * 获取七牛空间TOKEN
   */
  getQiniuToken(): Promise<ApiResponse> {
    return http.get('https://api.easyapi.com/qiniu/upload-token')
  },

  /**
  * 七牛上传文件
  */
  uploadFiles(data: any): Promise<ApiResponse> {
    return http.post('https://upload.qiniup.com', data)
  },
}
