import { baseUrl } from './api'

/**
 * 获取用户信息
 *
 * @see https://www.easyai.com
 */
export const getUser = (context) => {
  return context.$axios.get(`${baseUrl}/account`)
}
