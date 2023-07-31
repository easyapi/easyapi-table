import http from '~/api/request'

export const exportTemplate = {

  /**
   * 获取自定义导出模板列表
   *
   * @param teamUrl EasyAPI团队URL
   * @param projectCode EasyAPI项目编码
   * @param sheetCode 数据表编码
   *
   * @see https://www.easyapi.com
   */
  getList(params: any, teamUrl: string, projectCode: string, sheetCode: string): Promise<ApiResponse> {
    return http.get(`${useRuntimeConfig().public.baseUrl}/${teamUrl}/${projectCode}/${sheetCode}/export-templates`, params)
  },

  /**
   * 创建自定义导出模板
   *
   * @param teamUrl EasyAPI团队URL
   * @param projectCode EasyAPI项目编码
   * @param sheetCode 数据表编码
   *
   * @see https://www.easyapi.com
   */
  create(data: any, teamUrl: string, projectCode: string, sheetCode: string): Promise<ApiResponse> {
    return http.post(`${useRuntimeConfig().public.baseUrl}/${teamUrl}/${projectCode}/${sheetCode}/export-template`, data)
  },

  /**
   * 删除自定义导出模板
   *
   * @param teamUrl EasyAPI团队URL
   * @param projectCode EasyAPI项目编码
   * @param sheetCode 数据表编码
   *
   * @see https://www.easyapi.com
   */
  delete(data: any, teamUrl: string, projectCode: string, sheetCode: string): Promise<ApiResponse> {
    return http.delete(`${useRuntimeConfig().public.baseUrl}/${teamUrl}/${projectCode}/${sheetCode}/export-template`, data)
  },
}
