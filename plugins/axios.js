import Cookies from 'js-cookie'

export default function({ $axios, redirect }) {
  // Cookies.set('authenticationToken', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ6aGFuZzIwMDg0QDEyNi5jb20iLCJhdXRoIjoiUk9MRV9BRE1JTiIsImV4cCI6MTY1MjQ5ODU0NX0.-ijFpVcZQmZqNmcwef2C1CqXq8sWppNtZu8CEeZjjbDHv-Tyw7EGCFi5UEmcjTGfjw-i83DVkJ8S72OoVW4bqg')

  $axios.onRequest((config) => {
    let token = Cookies.get('authenticationToken')
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
  })
  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      if (error.response.data.code === -9) {
        window.location.href = 'https://account.easyapi.com/login?from=https://cms.easyapi.com/console/'
      } else if (error.response.data.code === -8) {
        window.location.href = 'https://team.easyapi.com/new?from=https://cms.easyapi.com/console/'
      } else {
        this.$message.warning(error.response.data.message)
      }
    }
  })
}
