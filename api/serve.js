import { serviceUrl } from './api'

/**
 * 获取数据表格字段列表
 *
 *
 * @see https://www.easyai.com
 */
export const getFieldList = (params, provider, context) => {
  return context.$axios.get(`${serviceUrl}/${provider}/fields`, { params: { ...params } })
}

/**
 * 获取服务商列表
 *
 *
 * @see https://www.easyai.com
 */
export const getRecordList = (params, provider, context) => {
  return context.$axios.get(`${serviceUrl}/${provider}/records`, { params: { ...params } })
}
