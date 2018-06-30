<template>
  <div class="SelectEvaluateType">
    <div class="SelectEvaluateType-type">
      <span class="SelectEvaluateType-type-span"
        :class="{on: nowType === 2}"
        @click.stop="changeType(2, $event)">{{typeText[0]}}<em class="SelectEvaluateType-type-span-em">{{typeVal[0]}}</em></span>
      <span class="SelectEvaluateType-type-span"
        :class="{on: nowType === 0}"
        @click.stop="changeType(0, $event)">{{typeText[1]}}<em class="SelectEvaluateType-type-span-em">{{typeVal[1]}}</em></span>
      <span class="SelectEvaluateType-type-span item"
        :class="{on: nowType === 1}"
        @click.stop="changeType(1, $event)">{{typeText[2]}}<em class="SelectEvaluateType-type-span-em">{{typeVal[2]}}</em></span>
    </div>
    <div class="SelectEvaluateType-evaluate">
      <span class="icon-check_circle pull-left"
        :class="{on: nowOnlySeeEvaluation}"
        @click.stop="changeOnlySeeEvaluation"></span>
      <span class="SelectEvaluateType-evaluate-span pull-left">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    typeText: {
      type: Array,
      default() {
        return ['全部', '推荐', '吐槽']
      }
    },
    typeArr: { // 全部的评论 自己过滤
      type: Array,
      required: true
    },
    initType: { // 初始的 当前类型 2全部 0推荐 1吐槽
      type: Number,
      default: 2
    },
    initOnlySeeEvaluation: { // 初始的 是否 只看有评论的
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      nowType: this.initType,
      nowOnlySeeEvaluation: this.initOnlySeeEvaluation
    }
  },
  watch: {
    typeArr() {
      console.log(1)
      this.result()
    },
    nowType() {
      this.result()
    },
    nowOnlySeeEvaluation() {
      this.result()
    }
  },
  computed: {
    // 类型数组值
    typeVal() {
      return this.typeArr.length !== 0 ? [this.typeArr.length, this.typeArr.filter(e => e.rateType === 0).length, this.typeArr.filter(e => e.rateType === 1).length] : [0, 0, 0]
    }
  },
  methods: {
    changeType(val, event) {
      if (!event._constructed) return // 只处理 better-scroll 派发的click
      this.nowType = val
    },
    changeOnlySeeEvaluation(event) {
      if (!event._constructed) return // 只处理 better-scroll 派发的click
      this.nowOnlySeeEvaluation = !this.nowOnlySeeEvaluation
    },
    // 发送结果 数组
    result() {
      const arr = this.typeArr.filter(e => {
        const isType = this.nowType === 2 ? true : this.nowType === e.rateType
        const isText = this.nowOnlySeeEvaluation ? e.text !== '' : true
        return isType && isText
      })
      this.$emit('result-arr', arr)
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/app';

  .SelectEvaluateType {
    @include px2rem(height, 236);
    @include px2rem(padding, 36);
    padding-bottom: 0;
    border-bottom: 2px solid #E6E7E8;
    &-type {
      @include px2rem(height, 100);
      &-span {
        float: left;
        @include px2rem(height, 64);
        @include px2rem(line-height, 64);
        @include px2rem(padding, 0 24);
        margin-right: px2rem(16);
        text-align: center;
        @include font-dpr(24);
        color: #4D555D;
        background-color: #CCECF8;
        border-radius: 2px;
        &.on {
          color: #fff;
          background-color: #00A0DC;
        }
        &-em {
          @include px2rem(margin-left, 5);
          @include font-dpr(16);
        }
      }
      .item {
        background-color: rgba(77, 85, 93, .2);
        &.on {
          background-color: rgb(77, 85, 93);
        }
      }
    }
    &-evaluate {
      @include px2rem(height, 98);
      // @include px2rem(line-height, 48);
      @include px2rem(padding-top, 24);
      @include px2rem(padding-bottom, 24);
      @include font-dpr(24);
      border-top: 1px solid #E6E7E8;
      color: #B7BBBF;
      &-span {
        @include lh(48, 48);
      }
      .icon-check_circle {
        position: relative;
        @include wh(48, 48);
        @include font-dpr(48);
        @include px2rem(margin-right, 8);
        &::before {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
        }
        &.on {
          color: #00C850;
        }
      }
    }
  }
</style>
