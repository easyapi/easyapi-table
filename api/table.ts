import http from '~/api/request'

export const table = {
  /**
   * 获取数据表格字段列表
   *
   * @param teamUrl EasyAPI团队URL
   * @param projectCode EasyAPI项目编码
   * @param sheetCode 数据表编码
   *
   * @see https://www.easyapi.com
   */
  getFieldList(params: any, teamUrl: string, projectCode: string, sheetCode: string): Promise<ApiResponse> {
    return http.get(`${useRuntimeConfig().public.baseUrl}/${teamUrl}/${projectCode}/${sheetCode}/fields`, params)
  },

  /**
   * 获取记录列表
   *
   * @param teamUrl EasyAPI团队URL
   * @param projectCode EasyAPI项目编码
   * @param sheetCode 数据表编码
   *
   * @see https://www.easyapi.com
   */
  getRecordList(params: any, teamUrl: string, projectCode: string, sheetCode: string): Promise<ApiResponse> {
    return http.get(`${useRuntimeConfig().public.baseUrl}/${teamUrl}/${projectCode}/${sheetCode}/records`, params)
  },

  /**
   * 查询记录列表
   *
   * @param teamUrl EasyAPI团队URL
   * @param projectCode EasyAPI项目编码
   * @param sheetCode 数据表编码
   *
   * @see https://www.easyapi.com
   */
  searchRecordList(data: any, teamUrl: string, projectCode: string, sheetCode: string): Promise<ApiResponse> {
    return http.post(`${useRuntimeConfig().public.baseUrl}/${teamUrl}/${projectCode}/${sheetCode}/record/search`, data)
  },

  /**
   * 创建记录
   *
   * @param teamUrl EasyAPI团队URL
   * @param projectCode EasyAPI项目编码
   * @param sheetCode 数据表编码
   *
   * @see https://www.easyapi.com
   */
  creatRecord(data: any, teamUrl: string, projectCode: string, sheetCode: string): Promise<ApiResponse> {
    return http.post(`${useRuntimeConfig().public.baseUrl}/${teamUrl}/${projectCode}/${sheetCode}/records`, data)
  },

  /**
   * 修改记录
   *
   * @param teamUrl EasyAPI团队URL
   * @param projectCode EasyAPI项目编码
   * @param sheetCode 数据表编码
   *
   * @see https://www.easyapi.com
   */
  updateRecord(data: any, teamUrl: string, projectCode: string, sheetCode: string): Promise<ApiResponse> {
    return http.put(`${useRuntimeConfig().public.baseUrl}/${teamUrl}/${projectCode}/${sheetCode}/records`, data)
  },

  /**
   * 删除记录
   *
   * @param teamUrl EasyAPI团队URL
   * @param projectCode EasyAPI项目编码
   * @param sheetCode 数据表编码
   *
   * @see https://www.easyapi.com
   */
  deleteRecord(data: any, teamUrl: string, projectCode: string, sheetCode: string): Promise<ApiResponse> {
    return http.delete(`${useRuntimeConfig().public.baseUrl}/${teamUrl}/${projectCode}/${sheetCode}/records`, data)
  },
}
