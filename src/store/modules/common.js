import { list } from '@/api/plan';

const state = {
  plan: ''
}

const mutations = {
  UPDATE_PLANDETAIL: (state, data) => {
    state.plan = data
  }
}

const actions = {
  updatePlanDetail({  commit }, data) {
    return new Promise((resolve, reject) => {
      list(data).then(res => {
        commit('UPDATE_PLANDETAIL', res)
      }).catch(ex => {
        reject(ex)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
