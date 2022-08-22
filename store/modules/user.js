import Cookies from 'js-cookie'
import { getUser } from '@/api/account'

const user = {
  state: {
    userId: '',
    username: '',
    nickname: '',
    photo: '',
    mobile: '',
    email: '',
    token: Cookies.get('authenticationToken')
  },

  mutations: {
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_NICKNAME: (state, nickname) => {
      state.nickname = nickname
    },
    SET_PHOTO: (state, photo) => {
      state.photo = photo
    },
    SET_MOBILE: (state, mobile) => {
      state.mobile = mobile
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },

  actions: {
    /**
     * 用户名登录
     */
    LoginByUsername({ commit }, userInfo) {},

    /**
     * 获取用户信息
     */
    GetUserInfo({ commit }) {
      getUser()
        .then(res => {
          let userInfoData = res.data
          commit('SET_USERID', userInfoData.id)
          commit('SET_USERNAME', userInfoData.username)
          commit('SET_NICKNAME', userInfoData.nickname)
          commit('SET_PHOTO', userInfoData.photo)
          commit('SET_MOBILE', userInfoData.mobile)
          commit('SET_EMAIL', userInfoData.email)
        })
        .catch(error => {
          // Cookies.remove('authenticationToken')
        })
    }
  }
}

export default user
