<template>
  <transition name="foodDetails">
    <div ref="foodDetails" v-show="toggle" class="foodDetails">
      <div class="foodDetails-warp">
        <div class="foodDetails-imgWrap">
          <a href="#" class="icon-arrow_lift" @click.stop.prevent="toggle = false"></a>
          <img :src="nowFood.image" :alt="nowFood.name" class="foodDetails-imgWrap-img">
        </div>
        <div class="foodDetails-title" v-if="toggle">
          <h4 class="foodDetails-title-h4">{{nowFood.name}}</h4>
          <MonthSale
            class="foodDetails-title-MonthSale"
            :sellCount="nowFood.sellCount"
            :rating="nowFood.rating"
            :price="nowFood.price"
            :oldPrice="nowFood.oldPrice"
            ></MonthSale>
            <Count
              v-show="goodsInfo.goods[nowIndex]"
              class="coverage-Count"
              :food="{name: nowFood.name, price: nowFood.price}"
              :index="nowIndex"
              @click-add="handlerClickAdd"></Count>
            <transition name="addShoppingcart" >
              <span class="foodDetails-title-addShoppingcart"
                @click.stop.prevent="addFirst"
                v-show="!goodsInfo.goods[nowIndex]">
                  加入购物车
                  <em class="foodDetails-title-addShoppingcart-em"></em>
              </span>
            </transition>
        </div>
        <SplitLine v-show="nowFood.info"></SplitLine>
        <div class="foodDetails-introduce" v-show="nowFood.info">
          <h5 class="foodDetails-introduce-title">商品介绍</h5>
          <p class="foodDetails-introduce-p">{{ nowFood.info }}</p>
        </div>
        <SplitLine></SplitLine>
        <div class="foodDetails-evaluate">商品评价</div>
        <SelectEvaluateType
          :typeArr="nowFood.ratings || []"
          @result-arr="resultArr"></SelectEvaluateType>
        <ul v-if="nowFood.ratings && nowFood.ratings.length" class="foodDetails-ratings">
          <li class="foodDetails-ratings-li" v-for="(item, index) in filterArr" :key="index">
            <div class="foodDetails-ratings-li-user">
              <span class="foodDetails-ratings-li-username">{{item.username}}</span>
              <img :src="item.avatar" class="foodDetails-ratings-li-useravatar">
            </div>
            <div class="foodDetails-ratings-li-time">{{item.rateTime | format}}</div>
            <p class="foodDetails-ratings-li-p">
              <span class="foodDetails-ratings-li-p-icon"
                :class="item.rateType ? 'icon-thumb_down' : 'icon-thumb_up'"></span>
              <span class="foodDetails-ratings-li-p-text">{{ item.text }}</span>
            </p>
          </li>
        </ul>
        <div v-else class="foodDetails-noRatings">暂无评价</div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BScroll from 'better-scroll'
import MonthSale from '../common/MonthSale'
import Count from '../common/Count'
import SplitLine from '../common/SplitLine'
import SelectEvaluateType from '../common/SelectEvaluateType'
import moment from 'moment'

export default {
  props: {
    nowFood: {
      type: Object,
      required: true
    },
    nowIndex: {
      type: Number,
      required: true
    }
  },
  components: {
    MonthSale,
    Count,
    SplitLine,
    SelectEvaluateType
  },
  data () {
    return {
      toggle: false, // 整个组建的显示隐藏
      filterArr: [] // ratings过滤之后的数组
    }
  },
  watch: {
    toggle(val) {
      if (val) {
        if (this.scroll) return this.scroll.refresh()
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.foodDetails, {
            click: true
          })
        })
      }
    }
  },
  computed: {
    ...mapGetters({
      'goodsInfo': 'getGoodsInfo'
    })
  },
  methods: {
    ...mapActions([
      'spliceGoods'
    ]),
    // 首次添加
    addFirst(event) {
      if (this.goodsInfo.goods[this.nowIndex]) return
      this.spliceGoods({
        item: {
          name: this.nowFood.name,
          price: this.nowFood.price,
          count: 1
        },
        index: this.nowIndex
      })
      // 引用 隐藏的target 保证位置正确
      this.$emit('transpond', event.target.children[0])
    },
    // 转发 target
    handlerClickAdd(target) {
      this.$emit('transpond', target)
    },
    // 选项变更的时候 拿到过滤后的数组
    resultArr(arr) {
      this.filterArr = arr
      this.$nextTick(() => {
        // 容器高度变化 为保证bscroll高度计算正确 调用更新方法
        if (this.scroll) return this.scroll.refresh()
      })
    }
  },
  filters: {
    format(val) {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/app';

.foodDetails {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  bottom: px2rem(96);
  background-color: #fff;
  z-index: 99;
  &-imgWrap { /*随便任意嵌套 性能优化*/
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%; /* padding 给%相对自身width */
    .icon-arrow_lift {
      position: absolute;
      @include px2rem(top, 20);
      @include px2rem(left, 20);
      @include font-dpr(28);
      color: #fff;
      z-index: 1;
    }
    &-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  &-title {
    position: relative;
    width: 100%;
    height: px2rem(217);
    padding: px2rem(36);
    &-h4 {
      @include px2rem(line-height, 28);
      @include px2rem(padding-bottom, 14);
      font-weight: 700;
      @include font-dpr(28);
      color: rgb(7, 17, 27);
    }
    // 样式覆盖
    &-MonthSale .goods_volume{
      padding-bottom: px2rem(36);
    }
    &-addShoppingcart {
      position: absolute;
      @include px2rem(right, 36);
      @include px2rem(bottom, 36);
      @include wh(148, 48);
      @include px2rem(line-height, 48);
      text-align: center;
      background-color: #00A0DC;
      color: #fff;
      @include font-dpr(20);
      @include px2rem(border-radius, 24);
      // 引用target
      &-em {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        @include wh(48, 44);
        z-index: -1;
      }
    }
    // 样式覆盖
    .coverage-Count {
      right: px2rem(36);
      bottom: px2rem(36);
    }
  }
  &-introduce {
    height: px2rem(250);
    padding: px2rem(36);
    &-title {
      height: px2rem(38);
      @include font-dpr(28);
      font-weight: 700;
    }
    &-p {
      @include px2rem(padding-left, 16);
      @include px2rem(padding-right, 16);
      @include px2rem(line-height, 48);
      @include font-dpr(24);
      font-weight: 200;
      color: rgb(77, 85, 93);
    }
  }
  &-evaluate {
    @include px2rem(height, 62);
    @include px2rem(padding-top, 34);
    @include px2rem(padding-left, 36);
    @include font-dpr(28);
    font-weight: 700;
  }
  &-ratings-li {
    position: relative;
    @include px2rem(height, 133);
    @include px2rem(padding, 32 36);
    padding-bottom: 0;
    &-user {
      position: absolute;
      @include px2rem(top, 32);
      @include px2rem(right, 36);
      &name {
        float: left;
        @include lh(24, 24);
        @include px2rem(margin-right, 12);
        @include font-dpr(20);
        color: rgb(147, 153, 159);
      }
      &avatar {
        @include wh(24, 24);
        border-radius: 50%;
      }
    }
    &-time {
      @include lh(24, 24);
      @include font-dpr(20);
      color: rgb(147, 153, 159);
    }
    &-p {
      position: relative;
      @include px2rem(height, 77);
      @include px2rem(padding-top, 12);
      @include px2rem(padding-bottom, 33);
      &-icon {
        float: left;
        position: relative;
        @include wh(24, 32);
        @include px2rem(margin-right, 6);
        color: rgb(147, 153, 159);
        &.icon-thumb_up {
          color: #00A0DC;
        }
        &::before {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
        }
      }
      &-text {
        float: left;
        @include lh(32, 32);
        @include font-dpr(24);
        color: rgb(7, 17, 27);
      }
      &::before {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        content: '';
        border-bottom: 1px solid #E6E7E8;
      }
    }
  }
  &-noRatings {
    @include px2rem(height, 77);
    @include px2rem(padding-top, 12);
    @include px2rem(padding-left, 36);
    @include font-dpr(24);
    color: rgb(7, 17, 27);
  }
}
// 进入 离开 过渡
.foodDetails-enter, .foodDetails-leave-to {
  transform: translate3d(100%, 0, 0);
}
.foodDetails-enter-active, .foodDetails-leave-active {
  transition: all .3s linear;
}
// 首次添加过渡
.addShoppingcart-enter, .addShoppingcart-leave-to {
  opacity: 0;
}
.addShoppingcart-enter-active, .addShoppingcart-leave-active {
  transition: all .3s linear;
}
</style>
