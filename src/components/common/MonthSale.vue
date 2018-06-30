<template>
  <div>
    <p class="goods_volume">
      <span class="goods_sellCount">月售{{sellCount}}份</span>
      <span>好评率{{rating}}%</span>
    </p>
    <p class="goods_prices">
      <span class="goods_price"><em class="yen">&yen;</em>{{price}}</span>
      <span class="goods_oldPrice" v-if="oldPrice"><em class="yen">&yen;</em>{{oldPrice}}</span>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    sellCount: {
      type: Number,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    oldPrice: {}
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/app';

  .goods_volume {
    @include px2rem(line-height, 29);
    @include px2rem(margin-bottom, 0);
    @include font-dpr(20);
    color: #93999F;
  }
  .goods_sellCount {
    @include px2rem(margin-right, 24);
  }
  .goods_prices {
    @include lh(48, 48);
    font-weight: 700;
    .goods_price {
      @include px2rem(margin-right, 16);
      @include font-dpr(28);
      font-weight: 700;
      color: #F01414;
    }
    .goods_oldPrice {
      @include font-dpr(20);
      font-weight: 700;
      text-decoration: line-through;
      color: rgb(147, 153, 159);
    }
    .yen {
      @include font-dpr(20);
      font-weight: normal;
      vertical-align: bottom;
    }
  }
</style>
