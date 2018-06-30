<template>
  <div class="symbol">
    <!-- 添加按钮 -->
    <em class="symbol-em icon-add_circle" @click.stop="add"></em>
    <span v-if="goodsInfo.goods[index]" class="symbol-span">{{goodsInfo.goods[index].count}}</span>
    <!-- 减少按钮 -->
    <transition name="subtract">
      <em class="symbol-em subtract icon-remove_circle_outline"
        v-if="goodsInfo.goods[index]"
        @click.stop="subtract"></em>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    food: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
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
    // 添加
    add(event) {
      if (!event._constructed) return // 只处理 better-scroll 派发的click
      // goods中index这一项存在否 存在 取count + 1 不存在 取1
      this.food.count = this.goodsInfo.goods[this.index] ? this.goodsInfo.goods[this.index].count + 1 : 1
      this.spliceGoods({
        index: this.index,
        item: this.food
      })
      // 通知父组件
      this.$emit('click-add', event.target)
    },
    // 删减
    subtract(event) {
      if (!event._constructed) return // 只处理 better-scroll 派发的click
      // 减少至0 是有过渡时间 是可以点击的
      if (!this.goodsInfo.goods[this.index]) return
      this.food.count = this.goodsInfo.goods[this.index].count - 1
      this.spliceGoods({
        index: this.index,
        item: this.food
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/app.scss';
.symbol {
  position: absolute;
  @include px2rem(bottom, 36);
  right: 0;
  @include wh(144, 44)
  &-span {
    float: right;
    @include wh(48, 44);
    @include px2rem(line-height, 44);
    @include font-dpr(20);
    color: rgb(147, 153, 159);
    text-align: center;
  }
  &-em {
    float: right;
    @include wh(48, 44);
    position: relative;
    @include font-dpr(42);
    color: #00A0DC;
    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      @include c3(transform, translate(-50%, -50%))
    }
  }
}

// 过渡
.subtract {
  float: left;
}
.subtract-enter-active, .subtract-leave-active {
  transition: all .3s linear;
}
.subtract-enter, .subtract-leave-to {
  @include c3(transform, translateX(px2rem(48)) rotate(180deg));
  opacity: 0;
}
</style>
