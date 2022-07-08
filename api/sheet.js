import { tableUrl } from './api'

/**
 * 获取数据表详情
 *
 * @param teamUrl EasyAPI团队URL
 * @param projectCode EasyAPI项目编码
 * @param sheetCode 数据表编码
 *
 * @see https://www.easyapi.com
 */
export const getSheet = (params, teamUrl, projectCode, sheetCode, context) => {
  return context.$axios.get(`${tableUrl}/${teamUrl}/${projectCode}/sheet/${sheetCode}`, { params: { params } })
}
