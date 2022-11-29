import http from '~/api/request'

export const sheet = {
  /**
   * 获取用户信息
   *
   */
  getUser(): Promise<ApiResponse> {
    return http.get(`${http.baseUrl}/account`)
  },

  /**
   * 获取数据表详情
   *
   * @param teamUrl EasyAPI团队URL
   * @param projectCode EasyAPI项目编码
   * @param sheetCode 数据表编码
   *
   * @see https://www.easyapi.com
   */
  getSheet(params: any, teamUrl: string, projectCode: string, sheetCode: string): Promise<ApiResponse> {
    return http.get(`${http.tableUrl}/${teamUrl}/${projectCode}/sheet/${sheetCode}`, params)
  },

  /**
   * 根据sheetId获取数据表详情
   *
   * @param teamUrl EasyAPI团队URL
   * @param projectCode EasyAPI项目编码
   * @param sheetId 数据表ID
   *
   * @see https://www.easyapi.com
   */
  getSheetById(params: any, teamUrl: string, projectCode: string, sheetId: string): Promise<ApiResponse> {
    return http.get(`${http.tableUrl}/${teamUrl}/${projectCode}/sheet/id-${sheetId}`, params)
  },
}
