/**
 * 获取七牛KEY
 */
export const getQiniuKey = (context) => {
  return context.$axios.get(`https://api.easyapi.com/qiniu/key`)
}


/**
 * 获取七牛空间TOKEN
 */
export const getQiniuToken = (context) => {
  return context.$axios.get(`https://api.easyapi.com/qiniu/upToken`)
}
