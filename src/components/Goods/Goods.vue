<template>
  <div class="goods">
    <div class="goods_type" ref="leftWarpper">
      <!-- 左边 -->
      <ul>
        <li ref="leftItem" v-for="(item, index) in goods" :class="{on: getIndex===index}" :key="index" @click="selectDetail(index, $event)" class="goods_type_li">
          <p class="goods_son">
            <span v-if="item.type >= 0" class="goodsOffset">
              <DiscountsIcon :size="24" :type="item.type" solid="solid"></DiscountsIcon>
            </span>{{item.name}}
          </p>
        </li>
      </ul>
    </div>
    <div class="goods_detail" ref="rightWarpper">
      <!-- 右边 -->
      <ul class="goods_right">
        <li ref="rightItem" v-for="(item, index) in goods" :key="index" class="jsSelect">
          <h5 class="title">{{item.name}}</h5>
          <ul>
            <li v-for="(e, i) in item.foods" :key="i" @click="selectFood(e, addIndex(index, i))" class="goods_item">
              <div class="goods_line">
                <img v-lazy="e.icon" class="goods_img">
                <div class="goods_info">
                  <h6 class="goods_name">{{e.name}}</h6>
                  <p class="goods_description" v-if="e.description">{{e.description}}</p>
                  <MonthSale
                    :sellCount="e.sellCount"
                    :rating="e.rating"
                    :price="e.price"
                    :oldPrice="e.oldPrice"
                    ></MonthSale>
                </div>
                <Count
                  :food="{name: e.name, price: e.price}"
                  :index="addIndex(index, i)"
                  @click-add="handlerClickAdd"></Count>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 好比 在这个页面中存储了一些小球 -->
    <transition name="ball"
      v-for="(item, index) in balls" :key="index"
      @before-enter="beforeEnter(index, $event)"
      @enter="enter(index, $event)"
      @after-enter="afterEnter(index, $event)">
      <div class="ball" v-show="item.show">
        <div class="inner icon-circle"></div>
      </div>
    </transition>
    <!-- 食物详情 -->
    <FoodDetails
      ref="FoodDetails"
      :nowFood="nowFood"
      :nowIndex="nowIndex"
      @transpond="handlerClickAdd"></FoodDetails>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import BScroll from 'better-scroll'
import DiscountsIcon from '../common/discountsIcon'
import Count from '../common/Count'
import MonthSale from '../common/MonthSale'
import FoodDetails from './FoodDetails'
import $ from 'jquery'

const resOk = 1

export default {
  components: {
    DiscountsIcon,
    Count,
    FoodDetails,
    MonthSale
  },
  data() {
    return {
      goods: [], // goods数据
      leftWarpper: '', // left 包装容器高
      leftHeights: [], // left 每个li累积高
      rightHeights: [], // right 每个li 累积高
      scrollY: 0, // y轴方向滚动距离
      balls: [{ show: false }, { show: false }, { show: false }], // 同时最多存在3个小球
      nowFood: {}, // 当前选择的商品
      nowIndex: 0// 当前选择的商品 索引
    }
  },
  computed: {
    ...mapGetters({
      api: 'getApi'
    }),
    // 监听 right scrollY 当前那个索引 高亮 联动 left
    getIndex() {
      let index = 0
      for (let i = 0; i < this.rightHeights.length; i++) {
        if (this.scrollY >= this.rightHeights[i] && i !== this.rightHeights.length - 1) {
          index = i
        }
      }
      // 保证整个视图都渲染完毕 在去调用
      this.$nextTick(() => {
        const maxVal = this.leftHeights[this.leftHeights.length - 1] - this.leftWarpper // 最大允许移动的值
        const offsetY = (this.leftWarpper - this.leftHeights[1]) / 2 // left y轴方向偏移值 保证在中间
        let val = this.leftHeights[index] - offsetY < 0 ? 0 : this.leftHeights[index] - offsetY
        val = val > maxVal ? maxVal : val
        this.goodsLeft.scrollTo(0, -val, 300) // 联动左侧
      })
      return index
    }
  },
  created() {
    this.getGoods()
  },
  methods: {
    ...mapActions([
      'mergeGoodsInfo',
      'replaceGoods'
    ]),
    // 获取商品信息
    async getGoods() {
      const { data } = await this.$http.get(this.api.goods)
      if (data.status !== resOk) return
      this.goods = data.data
      // console.log(data)
      // 保证整个视图都渲染完毕 在去调用
      this.$nextTick(() => {
        this._initBScroll()
        this._getHeights()
      })
    },
    // 初始化 better-scroll
    _initBScroll() {
      // 挂载到vue实例上 方便使用
      this.goodsLeft = new BScroll(this.$refs['leftWarpper'], {
        click: true // 移动端 better-scroll 会派发一个 click 事件 event 参数加一个私有属性 _constructed，值为 true
        // 在移动端 如果不设置 click: true 默认会禁用 元素及其以下所有click事件
        // pc端 自己也有一个click事件
      })
      this.goodsRight = new BScroll(this.$refs['rightWarpper'], { click: true, probeType: 3 }) // momentum 滚动动画运行过程中实时派发 scroll 事件
      this.goodsRight.on('scroll', pos => {
        this.scrollY = -pos.y
      })
    },
    // 获取 累积高 及 包装容器高
    _getHeights() {
      this.leftWarpper = this.$refs.leftWarpper.offsetHeight

      const leftItem = this.$refs.leftItem
      const rightItem = this.$refs.rightItem
      let sum = 0
      let and = 0
      this.leftHeights.push(sum)
      this.rightHeights.push(and)
      for (let i = 0; i < leftItem.length; i++) { // left right 数量一定是对应的
        sum += leftItem[i].offsetHeight
        and += rightItem[i].offsetHeight
        this.leftHeights.push(sum)
        this.rightHeights.push(and)
      }
    },
    // 点击 left
    selectDetail(index, $event) {
      if ($event._constructed) { // better-scroll派发的click事件 会多这么一个属性为true 只执行派发的click 而不执行 原声的click事件
        this.goodsRight.scrollTo(0, -this.rightHeights[index], 300) //  x y time滚动动画执行的时长
      }
    },
    // 解决 由循环嵌套说带来的count组件 index不唯一、不连续问题
    addIndex(index, i) {
      let base = 0 // 基数
      for (let j = 1; j <= index; j++) {
        base += this.goods[index - j].foods.length
      }
      return base + i
    },
    // 获取子组件target
    handlerClickAdd(dom) {
      // 体验优化 $nextTick不仅保证整个视图都更新完毕 还能保证整个视图都重绘完毕
      this.$nextTick(() => {
        const startRect = dom.getBoundingClientRect() // 起止位置
        const endRect = $('.icon-shopping_cart')[0].getBoundingClientRect() // 终止位置
        // 每次点击 都从现在没事干小球取一个 置为true 触发过渡钩子
        for (let e of this.balls) {
          if (e.show === false) {
            e.startRect = startRect
            e.endRect = endRect
            e.show = true
            return
          }
        }
      })
    },
    beforeEnter(index, el) { // index 由模本使用balls数组渲染 这里的关系很重要
      const startRect = this.balls[index].startRect
      $(el).css({ // 外层控制水平方向
        'top': startRect.top, // 设置初始位置
        'left': startRect.left,
        '-webkit-transform': 'translate3d(0, 0, 0)',
        'transform': 'translate3d(0, 0, 0)'
      }).children().css({ // 内层控制垂直方向
        '-webkit-transform': 'translate3d(0, 0, 0)',
        'transform': 'translate3d(0, 0, 0)'
      })
    },
    enter(index, el) { // done参数不给 才是默认监听 transitionend结束调用 afterEnter
      /* eslint-disable no-unused-vars */
      let refresh = el.offsetHeight
      const startRect = this.balls[index].startRect
      const endRect = this.balls[index].endRect
      $(el).css({
        '-webkit-transform': `translate3d(-${startRect.left - endRect.left - (endRect.width - startRect.width) / 2}px, 0, 0)`,
        'transform': `translate3d(-${startRect.left - endRect.left - (endRect.width - startRect.width) / 2}px, 0, 0)`
      }).children().css({
        '-webkit-transform': `translate3d(0, ${endRect.top - startRect.top + (endRect.height - startRect.height) / 2}px, 0)`,
        'transform': `translate3d(0, ${endRect.top - startRect.top + (endRect.height - startRect.height) / 2}px, 0)`
      })
    },
    afterEnter(index, el) {
      $(el).hide()
      this.balls[index].show = false
    },
    // 选择商品详情
    selectFood(food, index) {
      if (this.$refs.FoodDetails.toggle) return
      this.nowFood = food
      this.nowIndex = index
      this.$refs.FoodDetails.toggle = true // 直接修改子组件的数据
    }
  }
}

</script>
<style lang="scss">
// 从这里开始考虑 css渲染性能问题
// 1.嵌套最好不要超过3层 2.关键选择器尽量使用类选择器
@import '../../assets/scss/app';

.goods {
  @include c3(display, flex);
  .goods_type {
    @include flex-basis(160); // flex实现的2拦布局
  }
  .goods_detail {
    @include c3(flex, 1);
  }
}

.goods_type_li {
  display: table;
  width: 100%;
  @include lh(108, 28);
  @include px2rem(padding, 0 24);
  @include font-dpr(24);
  background-color: #f3f5f7;
  &.on {
    position: relative;
    top: -1px;
    background-color: #fff;
    .goods_son {
      font-weight: 700;
    }
    .goods_son::before {
      display: none;
    }
  }
  &:last-of-type .goods_son::before {
    display: none;
  }
  .goods_son {
    display: table-cell;
    vertical-align: middle;
    position: relative;
    color: #07111B;
    @include border(rgba(7, 17, 21, .1));
  }
  .goodsOffset {
    @include px2rem(margin-right, 4);
  }
}

.goods_right {
  .title {
    position: relative;
    @include lh(52, 52);
    @include px2rem(padding-left, 24);
    @include font-dpr(26);
    background-color: #F3F5F7;
    color: #93999F;
    @include border(#D9DDE1, 2, left)
  }
  .goods_item {
    @include px2rem(padding, 36 36 0);
    .goods_line {
      position: relative;
      display: flex;
      @include border(rgba(7, 17, 27, .1));
      @include px2rem(padding-bottom, 36);
    } // 去掉最后一个
    &:last-of-type .goods_line::before {
      display: none;
    }
  }

  .goods_img {
    @include flex-basis(114);
    @include wh(114, 114);
    @include px2rem(margin-right, 20);
  }
  .goods_info {
    flex: 1;
  }
  .goods_name {
    @include px2rem(line-height, 28);
    @include px2rem(margin, 4 0 10);
    @include font-dpr(28);
    color: rgb(7, 17, 27);
  }
  .goods_description {
    @include px2rem(line-height, 29);
    @include px2rem(margin-bottom, 10);
    @include font-dpr(20);
    color: #93999F;
  }
}
// 动画的小球
.ball {
  position: fixed;
  @include wh(48, 44);
  @include font-dpr(42);
  color: #00A0DC;
  z-index: 300;
  .inner {
    width: 100%;
    height: 100%;
    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      @include c3(transform, translate(-50%, -50%))
    }
  }
}
.ball-enter-active {
  transition: all .3s linear;
  .inner {
    transition: all .3s cubic-bezier(.24,-0.35,.65,-0.09);
  }
}
</style>
