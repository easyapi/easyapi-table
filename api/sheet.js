import { tableUrl } from './api'

/**
 * 获取数据表详情
 *
 * @param projectId 项目ID
 * @param sheetId 数据表ID
 *
 * @see https://www.easyapi.com
 */
export const getSheet = (params, projectId, sheetId, context) => {
  return context.$axios.get(`${tableUrl}/${projectId}/sheet/${sheetId}`, { params: { params } })
}


