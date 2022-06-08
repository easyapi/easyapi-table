import { tableUrl } from './api'

/**
 * 获取数据表格字段列表
 *
 * @param sheetId 数据表ID
 *
 * @see https://www.easyai.com
 */
export const getFieldList = (params, sheetId, context) => {
  return context.$axios.get(`${tableUrl}/${sheetId}/fields`, { params: { ...params } })
}

/**
 * 获取服务商列表
 *
 * @param sheetId 数据表ID
 *
 * @see https://www.easyai.com
 */
export const getRecordList = (params, sheetId, context) => {
  return context.$axios.get(`${tableUrl}/${sheetId}/records`, { params: { ...params } })
}

/**
 * 添加服务商信息
 *
 * @param sheetId 数据表ID
 *
 * @see https://www.easyai.com
 */
export const creatRecord = (data, sheetId, context) => {
  return context.$axios.post(`${tableUrl}/${sheetId}/records`, data)
}

/**
 * 修改服务商信息
 *
 * @param sheetId 数据表ID
 *
 * @see https://www.easyai.com
 */
export const updateRecord = (data, sheetId, context) => {
  return context.$axios.put(`${tableUrl}/${sheetId}/records`, data)
}

/**
 * 删除服务商信息
 *
 * @param sheetId 数据表ID
 *
 * @see https://www.easyai.com
 */
export const deleteRecord = (data, context) => {
  return context.$axios.delete(`${tableUrl}/records`, data)
}
