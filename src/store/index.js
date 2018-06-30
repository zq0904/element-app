import Vue from 'vue'
import Vuex from 'vuex'
import test from './modules/test' // 测试
import api from './modules/api' // 接口地址
import goodsInfo from './modules/goodsInfo' // 商品信息
import getters from './getters' // 派生模块路径

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: { // state actions异步 mutations同步
    test,
    api,
    goodsInfo
  },
  getters
})

// 热重载模块
if (module.hot) {
  module.hot.accept([
    './getters'
    // , './modules/goodsInfo'
  ], () => {
    // 获取更新后的模块
    // 因为 babel 6 的模块编译格式问题，这里需要加上 `.default`
    const newGetters = require('./getters').default
    // const newModulesGoodsInfo = require('./modules/goodsInfo').default
    // 加载新模块
    store.hotUpdate({
      getters: newGetters
      // ,
      // modules: {
      //   goodsInfo: newModulesGoodsInfo
      // }
    })
  })
}

export default store
