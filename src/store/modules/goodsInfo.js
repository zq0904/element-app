import { MERGEGOODSINFO, SPLICEGOODS } from '../mutation-types'
import _ from 'lodash'

const state = {
  goods: [], // 购物车信息
  shippingPrice: '', // 配送费
  startPrice: '' // 起送价
}

// 提交异步 mutaion
const actions = {
  mergeGoodsInfo: ({ commit }, ...args) => {
    commit(MERGEGOODSINFO, ...args)
  },
  spliceGoods: ({ commit }, ...args) => {
    commit(SPLICEGOODS, ...args)
  }
}

const mutations = {
  // 合并goodsInfo
  [MERGEGOODSINFO] (state, obj) { // state 为 局部状态
    _.merge(state, obj)
  },
  // splice goods 使用数组的变异方法 触发视图更新
  [SPLICEGOODS] (state, obj) {
    if (obj.type === 'empty') { // 清空
      state.goods.splice(0)
    } else { // 增加 减少 只是在做赋值操作
      if (obj.item.count === 0) { // count减为0 这一项赋值为null
        state.goods.splice(obj.index, 1, null)
        return false
      }
      state.goods[obj.index] = obj.item // 这种方式不是响应式的 使用深拷贝解决
      state.goods = JSON.parse(JSON.stringify(state.goods))
    }
  }
}

export default {
  state,
  actions,
  mutations
}
