/* eslint-disable no-const-assign */
import { login, logout, getInfo, loginSG, getInfoSG } from '@/api/user'
import { getToken, setToken, removeToken, setRoles, getRoles } from '@/utils/auth'
import { changeUserKey } from '@/utils'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) { // action login里面才是真正调用接口login()方法的地方
    console.log('action login => userInfo: ', userInfo)
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      if (process.env.VUE_APP_BASE_CLIENT_ID === 'sg') {
        loginSG({ username: username.trim(), password }).then(data => {
          console.log('loginSG => data: ', data)
          // const { data } = response
          if (data) {
            const rolesArr = []
            const { access_token, role } = data
            const isString = typeof role.roleKey === 'string'
            const userRoles = changeUserKey(role.roleKey)
            isString ? rolesArr.push(userRoles) : rolesArr = role
            commit('SET_TOKEN', access_token)
            // commit('SET_ROLES', role)
            commit('SET_ROLES', rolesArr)
            setToken(access_token)
            setRoles(rolesArr)
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      } else {
        login({ username: username.trim(), password }).then(data => {
          console.log('data: ', data)
          // const { data } = response
          // const rolesArr = []
          const { roles, access_token } = data
          // console.log('roles: ', roles)
          // console.log('access_token: ', access_token)
          // const types = typeof roles === 'string'
          // console.log('types: ', types)
          // typeof roles === 'string' ? rolesArr.push(roles) : rolesArr = roles
          commit('SET_TOKEN', access_token)
          commit('SET_ROLES', roles)
          // commit('SET_ROLES', rolesArr)
          // console.log('rolesArr: ', rolesArr)
          setToken(access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      }
    })
  },
  // get user info
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const userRoles = getRoles()
      commit('SET_ROLES', userRoles)
      resolve(userRoles)
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        console.log('data: ', data)

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
      // logout(state.token).then(() => {
      //   commit('SET_TOKEN', '')
      //   commit('SET_ROLES', [])
      //   removeToken()
      //   resetRouter()

      //   // reset visited views and cached views
      //   // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      //   dispatch('tagsView/delAllViews', null, { root: true })

      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },
  // // user logout
  // logout({ commit, state, dispatch }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token).then(() => {
  //       commit('SET_TOKEN', '')
  //       commit('SET_ROLES', [])
  //       removeToken()
  //       resetRouter()

  //       // reset visited views and cached views
  //       // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
  //       dispatch('tagsView/delAllViews', null, { root: true })

  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
