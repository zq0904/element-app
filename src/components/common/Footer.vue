<template>
  <div class="fooer">
    <!-- 底部信息 -->
    <div class="fooer-bottomInfo" @click="isToggleShow">
      <div class="cart">
        <span class="icon-shopping_cart cartHeart" :class="{on: totalCount}"></span>
          <em class="cart-number" v-show="totalCount">{{totalCount}}</em>
      </div>
      <div class="money">
        <em class="moneyHeart" :class="{on: totalCount}">&yen;{{ totalPrice }}</em>
        <p class="moneyContent">另需配送费&yen;{{ goodsInfo.shippingPrice }}元</p>
      </div>
      <div class="startSend">
        <!--  -->
        <p class="startSend-p"
          @click.stop="pay"
          :class="{account: differPriceText === '去结算'}">{{ differPriceText }}</p>
      </div>
    </div>
    <!-- 购物车详情 -->
    <transition name="cartInfo">
      <div class="cartInfo" v-show="showCartInfo">
        <h4 class="cartInfo-empty">
          <span class="cartInfo-empty-p">购物车</span>
          <a href="#" class="cartInfo-empty-a" @click.prevent="empty">清空</a>
        </h4>
        <div id="wrapCartInfo">
          <ul class="cartInfo-ul">
            <transition name="cartInfo-ul-li" v-if="e" v-for="(e, i) in goodsInfo.goods" :key="i" @leave="leave">
              <li class="cartInfo-ul-li">
                <span class="cartInfo-ul-li-span">{{ e.name }}</span>
                <span class="cartInfo-ul-li-money"><em class="cartInfo-ul-li-money-em">&yen;</em>{{ e.price * e.count }}</span>
                <Count
                  :food="{name: e.name, price: e.price}"
                  :index="i"></Count>
              </li>
            </transition>
          </ul>
        </div>
      </div>
    </transition>
    <!-- 购物车遮挡层 -->
    <transition name="cartInfo-shade">
      <div class="cartInfo-shade" v-show="showCartInfo" @click.self="showCartInfo = false"></div>
    </transition>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Count from '../common/Count'
import BScroll from 'better-scroll'
import $ from 'jquery'

export default {
  components: {
    Count
  },
  data() {
    return {
      showCartInfo: false // 购物车详情 显示隐藏
    }
  },
  watch: {
    // 监听 个数 为零 隐藏 购物车详情
    totalCount(val) {
      if (val === 0) {
        this.showCartInfo = false
      }
    },
    // 显示购物详情 才去初始化插件 初始化过了 重新计算
    showCartInfo(val) {
      if (!val) return
      if (this.scroll) return this.scroll.refresh()
      this.$nextTick(() => {
        this.scroll = new BScroll('#wrapCartInfo', {
          click: true
        })
      })
    }
  },
  computed: {
    ...mapGetters({
      goodsInfo: 'getGoodsInfo'
    }),
    // 总个数
    totalCount() {
      let num = 0
      this.goodsInfo.goods.forEach(e => {
        if (!e) return
        num += e.count
      })
      return num
    },
    // 计算除配送费 总金额
    totalPrice() {
      let sum = 0
      this.goodsInfo.goods.forEach(e => {
        if (!e) return
        sum += e.price * e.count
      })
      return sum
    },
    // 起送文本
    differPriceText() {
      let val = this.goodsInfo.startPrice - this.totalPrice
      let text = this.totalPrice === 0 ? `¥${val}起送` : val > 0 ? `还差¥${val}起送` : '去结算'
      return text
    }
  },
  methods: {
    ...mapActions([
      'spliceGoods'
    ]),
    // 点击不是起送 且 总个数不为零  显示
    isToggleShow(event) {
      // 支付已经 阻止了事件冒泡
      if (this.totalCount > 0) {
        this.showCartInfo = !this.showCartInfo
      }
    },
    // 清空
    empty() {
      this.spliceGoods({
        type: 'empty'
      })
    },
    // 支付
    pay() {
      if (this.totalPrice - this.goodsInfo.startPrice >= 0) {
        window.alert(`需支付: ${this.totalPrice + this.goodsInfo.shippingPrice}`)
      }
    },
    // 自定义 leave样式 切记 重绘
    leave(el) {
      /* eslint-disable no-unused-vars */
      const rf = el.offsetHeight
      $(el).css({ 'transition': 'all .2s linear' })
    }
  }
}

</script>
<style lang="scss">
@import '../../assets/scss/app';

.fooer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  @include px2rem(height, 96);
  // 底部信息
  .fooer-bottomInfo {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgb(20, 30, 40);
    color: #80858A;
    z-index: 200;
  }
  .cart {
    float: left;
    position: relative;
    @include wh(112, 112);
    @include px2rem(margin, -20 0 0 22);
    background-color: #141C27;
    @include c3(border-radius, 50%);
    z-index: 200;
    &-number {
      position: absolute;
      top: 0;
      right: 0;
      @include wlh(48, 32, 32);
      @include px2rem(border-radius, 30);
      @include font-dpr(14);
      @include c3(box-shadow, 0 4px 8px 0 rgba(0, 0, 0, .4));
      font-weight: 700;
      text-align: center;
      color: #fff;
      background-color: #EF0E12;
    }
    .cartHeart {
      @include absolute_center(88, 88);
      @include lh(88, 88);
      @include font-dpr(48);
      text-align: center;
      background-color: #2B343D;
      color: #808589;
      @include c3(border-radius, 50%);
      &.on {
        background-color: #00A0DC;
        color: #FFFFFF;
      }
    }
  }
  .money {
    float: left;
    @include px2rem(padding, 24 0 0 22);
    .moneyHeart {
      float: left;
      @include lh(48, 48);
      @include px2rem(padding-right, 25);
      @include font-dpr(28);
      font-weight: 700;
      @include border(rgba(255, 255, 255, .1), 1, right);
      &.on {
        color: #FEFFFF;
      }
    }
    .moneyContent {
      float: left;
      @include lh(48, 48);
      @include px2rem(padding-left, 24);
      @include font-dpr(20);
    }
  }
  .startSend {
    float: right;
    @include wlh(210, 96, 96);
    @include font-dpr(26);
    text-align: center;
    background-color: #2B333B;
    &-p{
      font-weight: 700;
      height: 100%;
    }
    .account {
      background-color: #009130;
      color: #fff;
    }
  }
  // 购物车详情
  #wrapCartInfo {
    @include px2rem(max-height, 435);
    overflow: hidden;
    background-color: #fff;
  }
  .cartInfo {
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 100%;
    z-index: 100;
    &-empty {
      @include lh(80, 80);
      border-bottom: 2px solid #DBDEE1;
      text-align: right;
      background-color: #F3F5F7;
      &-p {
        float: left;
        @include px2rem(padding-left, 36);
        @include font-dpr(28);
        font-weight: 200;
        color: rgb(7, 17, 27);
      }
      &-a {
        @include px2rem(margin-right, 36);
        @include font-dpr(24);
        color: rgb(0, 160, 220);
      }
    }
    &-ul {
      @include px2rem(padding, 0 36);
      background-color: #FFFFFF;
      &-li {
        position: relative;
        @include lh(96, 96);
        margin-left: 0;
        @include border(#E6E7E8);
        &-span {
          @include font-dpr(28);
          color: rgb(7, 17, 27);
        }
        &-money {
          position: absolute;
          @include px2rem(top, 26);
          @include px2rem(right, 168);
          @include px2rem(line-height, 48);
          @include font-dpr(28);
          font-weight: 700;
          color: rgb(240, 20, 20);
          &-em {
            @include px2rem(margin-right, 6);
            @include font-dpr(20);
            font-weight: normal;
          }
        }
        .symbol {
          @include px2rem(bottom, 26);
          right: 0;
        }
      }
    }
  }
  // 购物车遮挡层
  .cartInfo-shade {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(7, 17, 27, .6);
    backdrop-filter: blur(5px);
    z-index: 99;
  }
  // 购物车详情 过渡
  .cartInfo-enter, .cartInfo-leave-to {
    bottom: 0;
    transform: translate3d(0, 100%, 0);
  }
  .cartInfo-enter-active, .cartInfo-leave-active {
    transition: all 0.4s linear;
  }
  // 遮挡层 过渡
  .cartInfo-shade-enter, .cartInfo-shade-leave-to {
    opacity: 0;
    background-color: rgba(0, 0, 0, 0);
  }
  .cartInfo-shade-enter-active, .cartInfo-shade-leave-active {
    transition: all 0.4s linear;
  }
  // 详情列表 减为0 过渡消失
  .cartInfo-ul-li-leave {
    margin-left: 9999px;
  }
  .cartInfo-ul-li-leave-to {
    margin-left: 9999px;
    @include lh(0, 0);
  }
}

</style>
