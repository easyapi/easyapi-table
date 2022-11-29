import { ElMessage } from 'element-plus'

const baseUrl = 'https://account-api.easyapi.com'
const tableUrl = 'https://table-api.easyapi.com'

const get = async (url: string, params = {}): Promise<ApiResponse> => {
  try {
    const token = useCookie('robotToken')
    const res = await $fetch<ApiResponse>(url, {
      headers: {
        Authorization: token.value ? `Bearer ${token.value}` : '',
      },
      method: 'GET',
      params,
    })
    return res
  } catch (error: any) {
    ElMessage({
      type: 'error',
      message: error.data.message,
    })
    return error.data
  }
}

const post = async (url: string, data = {}): Promise<ApiResponse> => {
  try {
    const token = useCookie('robotToken')
    const res = await $fetch<ApiResponse>(url, {
      headers: {
        Authorization: token.value ? `Bearer ${token.value}` : '',
      },
      method: 'POST',
      body: data,
    })
    return res
  } catch (error: any) {
    ElMessage({
      type: 'error',
      message: error.data.message,
    })
    return error.data
  }
}

const put = async (url: string, data = {}): Promise<ApiResponse> => {
  try {
    const token = useCookie('robotToken')
    const res = await $fetch<ApiResponse>(url, {
      headers: {
        Authorization: token.value ? `Bearer ${token.value}` : '',
      },
      method: 'PUT',
      body: data,
    })
    return res
  } catch (error: any) {
    ElMessage({
      type: 'error',
      message: error.data.message,
    })
    return error.data
  }
}

const del = async (url: string, data = {}): Promise<ApiResponse> => {
  try {
    const token = useCookie('robotToken')
    const res = await $fetch<ApiResponse>(url, {
      headers: {
        Authorization: token.value ? `Bearer ${token.value}` : '',
      },
      method: 'DELETE',
      body: data,
    })
    return res
  } catch (error: any) {
    ElMessage({
      type: 'error',
      message: error.data.message,
    })
    return error.data
  }
}

export default { get, post, put, del, baseUrl, tableUrl }
