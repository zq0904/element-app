<template>
  <ul class="discountsInfo">
    <li class="discountsInfo-li" v-for="(item, index) in supports" :key="index">
      <p class="discountsInfo-li-p">
        <span class="discountsInfo-li-p-span">
          <DiscountsIcon :size="32" :type="item.type" :solid="solid"></DiscountsIcon>
        </span>{{item.description}}
      </p>
    </li>
  </ul>
</template>

<script>
import DiscountsIcon from './discountsIcon'

export default {
  props: {
    supports: {
      type: Array,
      required: true
    },
    solid: { // 透传 至 DiscountsIcon组件
      type: String,
      default: ''
    }
  },
  components: {
    DiscountsIcon
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/app';

.discountsInfo {
  @include px2rem(padding, 0 0 30 96);
  &-li {
    @include px2rem(margin-bottom, 24);
    &-p {
      @include lh(32, 32);
      @include font-dpr(24);
      color: #fff;
      &-span {
        @include px2rem(margin-right, 12);
      }
    }
  }
}
</style>
