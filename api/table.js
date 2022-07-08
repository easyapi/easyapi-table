import { tableUrl } from './api'

/**
 * 获取数据表格字段列表
 *
 * @param teamUrl EasyAPI团队URL
 * @param projectCode EasyAPI项目编码
 * @param sheetCode 数据表编码
 *
 * @see https://www.easyapi.com
 */
export const getFieldList = (params, teamUrl, projectCode, sheetCode, context) => {
  return context.$axios.get(`${tableUrl}/${teamUrl}/${projectCode}/${sheetCode}/fields`, { params: { ...params } })
}

/**
 * 获取记录列表
 *
 * @param teamUrl EasyAPI团队URL
 * @param projectCode EasyAPI项目编码
 * @param sheetCode 数据表编码
 *
 * @see https://www.easyapi.com
 */
export const getRecordList = (params, teamUrl, projectCode, sheetCode, context) => {
  return context.$axios.get(`${tableUrl}/${teamUrl}/${projectCode}/${sheetCode}/records`, { params: { ...params } })
}

/**
 * 创建记录
 *
 * @param teamUrl EasyAPI团队URL
 * @param projectCode EasyAPI项目编码
 * @param sheetCode 数据表编码
 *
 * @see https://www.easyapi.com
 */
export const creatRecord = (data, teamUrl, projectCode, sheetCode, context) => {
  return context.$axios.post(`${tableUrl}/${teamUrl}/${projectCode}/${sheetCode}/records`, data)
}

/**
 * 修改记录
 *
 * @param teamUrl EasyAPI团队URL
 * @param projectCode EasyAPI项目编码
 * @param sheetCode 数据表编码
 *
 * @see https://www.easyapi.com
 */
export const updateRecord = (data, teamUrl, projectCode, sheetCode, context) => {
  return context.$axios.put(`${tableUrl}/${teamUrl}/${projectCode}/${sheetCode}/records`, data)
}

/**
 * 删除记录
 *
 * @param teamUrl EasyAPI团队URL
 * @param projectCode EasyAPI项目编码
 * @param sheetCode 数据表编码
 *
 * @see https://www.easyapi.com
 */
export const deleteRecord = (data, teamUrl, projectCode, sheetCode, context) => {
  return context.$axios.delete(`${tableUrl}/${teamUrl}/${projectCode}/${sheetCode}/records`, {
    data: data
  })
}
