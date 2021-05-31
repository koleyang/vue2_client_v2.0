import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
// 这里注册module里面的store.js文件，这句话意思是：加载module/目录下所有以.js结尾的文件
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default // 拼接：成名(文件名) = 值(文件路径)对形式
  return modules
}, {})

const store = new Vuex.Store({
  modules, // 注册：这里才是真正注册module里面的所有store的文件
  getters // 注册：公共的getters
})

export default store
