import Vue from 'vue'
import Router from 'vue-router'
import Test from '../components/test' // 测试文件
import Goods from '../components/Goods/Goods' // 商品
import Ratings from '../components/Ratings/Ratings' // 评价
import Merchant from '../components/Merchant/Merchant' // 商家

Vue.use(Router)

export default new Router({
  linkExactActiveClass: 'on',
  routes: [
    { path: '/test', component: Test }, // 测试文件
    { path: '/', component: Goods },
    { path: '/ratings', component: Ratings },
    { path: '/merchant', component: Merchant }
  ]
})
