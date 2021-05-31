const plan = {
  state: {
    testData: '我是从store中获取的数据',
    num: 1,
  },
  getters: {
    testData: state => state.testData,
    num: state => state.num
  },
  actions: {
    getOrderQueryList({ commit, state, dispatch }, params) {
        setTimeout(() => {
            let num = state.num + 1 // 在action里面可以引用state.num，但是不可以直接修改
            commit('changeNum',num)
        }, 300)
    }
  },
  mutations: {
    changeNum(state, value) {
        state.num = value
    },
  },
}
export default plan
