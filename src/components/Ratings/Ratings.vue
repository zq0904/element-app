<template>
  <div ref="Ratings" class="Ratings">
    <div class="Ratings-warp">
      <div class="Ratings-title">
        <div class="Ratings-title-left">
          <p class="Ratings-title-left-val">{{ seller.score }}</p>
          <p class="Ratings-title-left-h4">综合评分</p>
          <p class="Ratings-title-left-text">高于周边商家{{ seller.rankRate }}%</p>
        </div>
        <div class="Ratings-title-right">
          <p class="Ratings-title-right-manner">
            <span class="Ratings-title-right-manner-text pull-left">服务态度</span>
            <star class="pull-left" :size="36" :score="seller.serviceScore || 0"></star>
            <span class="Ratings-title-right-manner-val pull-left">{{ seller.serviceScore }}</span>
          </p>
          <p class="Ratings-title-right-manner">
            <span class="Ratings-title-right-manner-text pull-left">商品评分</span>
            <star class="pull-left" :size="36" :score="seller.foodScore || 0"></star>
            <span class="Ratings-title-right-manner-val pull-left">{{ seller.foodScore }}</span>
          </p>
          <p class="Ratings-title-right-time">
            <span class="Ratings-title-right-manner-text pull-left">送达时间</span>
            <span class="Ratings-title-right-time-val pull-left">{{ seller.deliveryTime }}分钟</span>
          </p>
        </div>
      </div>
      <SplitLine></SplitLine>
      <SelectEvaluateType
        :typeText="['全部', '满意', '不满意']"
        :typeArr="ratings"
        @result-arr="resultArr"></SelectEvaluateType>
      <ul class="Ratings-main">
        <li class="Ratings-main-li" v-for="(item, index) in filterArr" :key="index">
          <img :src="item.avatar" class="Ratings-main-li-img">
          <span class="Ratings-main-li-name">{{item.username}}</span>
          <span class="Ratings-main-li-time">{{item.rateTime | format}}</span>
          <p class="Ratings-main-li-grade">
            <star class="pull-left" :size="24" :score="item.score"></star>
            <span class="Ratings-main-li-grade-deliveryTime pull-left" v-if="item.deliveryTime">{{item.deliveryTime}}分钟送达</span>
          </p>
          <p class="Ratings-main-li-text" v-if="item.text">{{item.text}}</p>
          <p class="Ratings-main-li-recommend clearfix">
            <span class="Ratings-main-li-recommend-icon" :class="item.rateType ? 'icon-thumb_down' : 'icon-thumb_up'"></span>
            <span class="Ratings-main-li-recommend-item"
              v-if="i < 4"
              v-for="(e, i) in item.recommend" :key="i">{{e}}</span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import star from '../common/star'
import SplitLine from '../common/SplitLine'
import SelectEvaluateType from '../common/SelectEvaluateType'
import Bscroll from 'better-scroll'
import moment from 'moment'

const resOk = 1 // 声明请求成功 标识

export default {
  props: {
    seller: {
      type: Object,
      required: true
    }
  },
  components: {
    star,
    SplitLine,
    SelectEvaluateType
  },
  data () {
    return {
      ratings: [], // 所有的评论信息
      filterArr: [] // 过滤后的数组
    }
  },
  computed: {
    ...mapGetters({
      api: 'getApi'
    })
  },
  async created() {
    const {data} = await this.$http.get(this.api.ratings)
    // console.log(data)
    if (data.status !== resOk) return
    this.ratings = data.data
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new Bscroll(this.$refs.Ratings, {
        click: true
      })
    })
  },
  methods: {
    resultArr(arr) {
      this.filterArr = arr
      this.$nextTick(() => {
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

<style lang='scss'>
@import '../../assets/scss/app';

.Ratings {
  &-warp {
    width: 100%;
  }
  &-title {
    @include c3(display, flex);
    @include px2rem(height, 212);
    @include px2rem(padding, 36 0);
    text-align: center;
    &-left {
      flex: 0 0 px2rem(275);
      @include wh(275, 140);
      border-right: 1px solid #E6E7E8;
      &-val {
        @include lh(56, 56);
        @include px2rem(margin-bottom, 12);
        @include font-dpr(48);
        color: #FF9900;
      }
      &-h4 {
        @include lh(24, 24);
        @include px2rem(margin-bottom, 16);
        @include font-dpr(24);
        color: rgb(7, 17, 27);
      }
      &-text {
        @include lh(20, 20);
        @include font-dpr(20);
        color: #93999F;
      }
    }
    &-right {
      flex: 1;
      @include px2rem(padding, 0 46);
      &-manner {
        @include lh(36, 36);
        @include px2rem(margin-bottom, 16);
        &-text {
          @include px2rem(margin-right, 24);
          @include font-dpr(24);
          color: rgb(7, 17, 27);
        }
        &-val {
          @include px2rem(margin-left, 20);
          @include font-dpr(24);
          color: rgb(255, 153, 0);
        }
      }
      &-time {
        @include lh(36, 36);
        &-val {
          @include lh(36, 36);
          @include font-dpr(24);
          color: rgb(147, 153, 159);
        }
      }
    }
    // 由于淘宝 flexble 56 meta缩放比为0.5 影响媒体查询
    @media screen and (max-width: 640px) and (-webkit-device-pixel-ratio: 2) { // 5媒体查询
      &-right {
        @include px2rem(padding, 0 35);
      }
    }
  }
  &-main {
    @include px2rem(padding, 0 36);
    &-li {
      position: relative;
      @include px2rem(padding, 36 0 36 80);
      border-bottom: 1px solid #E6E7E8;
      &-img {
        position: absolute;
        @include px2rem(top, 36);
        left: 0;
        @include wh(56, 56);
        border-radius: 50%;
      }
      &-name {
        float: left;
        @include px2rem(height, 32);
        @include font-dpr(20);
        color: rgb(147, 153, 159);
      }
      &-time {
        float: right;
        @include px2rem(height, 32);
        @include font-dpr(20);
        color: #93999F;
      }
      &-grade {
        @include lh(24, 24);
        @include px2rem(margin, 32 0 12);
        &-deliveryTime {
          @include lh(24, 24);
          @include px2rem(margin-left, 12);
          @include font-dpr(20);
          font-weight: 200;
          color: rgb(147, 153, 159);
        }
      }
      &-text {
        @include px2rem(line-height, 36);
        @include px2rem(margin-bottom, 16);
        @include font-dpr(24);
        color: rgb(7, 17, 27);
      }
      &-recommend {
        @include lh(32, 32);
        &-icon {
          float: left;
          position: relative;
          @include wh(32, 32);
          @include font-dpr(24);
          &::before {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0);
          }
          &.icon-thumb_down {
            color: #B7BBBF;
          }
          &.icon-thumb_up {
            color: #00A0DC;
          }
        }
        &-item {
          float: left;
          @include px2rem(max-width, 126);
          @include lh(32, 32);
          @include px2rem(margin-left, 16);
          @include px2rem(padding, 0 12);
          @include se();
          @include font-dpr(18);
          border: 1px solid #93999F;
          border-radius: 2px;
          text-align: center;
          color: #93999F;
          background-color: rgb(255, 255, 255);
          &:nth-child(2) {
            @include px2rem(margin-left, 10);
          }
        }
      }
    }
  }
}
</style>
