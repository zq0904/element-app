<template>
  <div class="merchant" ref="merchant">
    <div class="merchant-wrap">
      <div class="merchant-title">
        <h3 class="merchant-title-h3">{{seller.name}}</h3>
        <p class="merchant-title-p">
          <Star class="merchant-title-p-star" :size="36" :score="seller.score || 0"></Star>
          <span class="merchant-title-p-ratingCount">({{seller.ratingCount}})</span>
          <span class="merchant-title-p-span">月售{{seller.sellCount}}单</span>
        </p>
        <div class="merchant-title-enshrine" @click.stop="collect">
          <span class="icon-favorite" :class="isCollect ? 'on' : ''"></span>
          <div class="merchant-title-enshrine-text">{{isCollect ? '已收藏' : '收藏'}}</div>
        </div>
      </div>
      <ul class="merchant-flex3">
        <li class="merchant-flex3-item">
          <div class="merchant-flex3-item-title">起送价</div>
          <p class="merchant-flex3-item-p">
            <span class="merchant-flex3-item-p-span">{{seller.startPrice}}</span><span class="merchant-flex3-item-p-sub">元</span>
          </p>
        </li>
        <li class="merchant-flex3-item">
          <div class="merchant-flex3-item-title">商家配送</div>
          <p class="merchant-flex3-item-p">
            <span class="merchant-flex3-item-p-span">{{seller.deliveryPrice}}</span><span class="merchant-flex3-item-p-sub">元</span>
          </p>
        </li>
        <li class="merchant-flex3-item">
          <div class="merchant-flex3-item-title">平均配送时间</div>
          <p class="merchant-flex3-item-p">
            <span class="merchant-flex3-item-p-span">{{seller.deliveryTime}}</span><span class="merchant-flex3-item-p-sub">分钟</span>
          </p>
        </li>
      </ul>
      <SplitLine></SplitLine>
      <div class="merchant-notice">
        <h4 class="merchant-notice-title">公告与活动</h4>
        <p class="merchant-notice-text">{{seller.bulletin}}</p>
      </div>
      <div class="merchant-discountsInfo-wrap">
        <DiscountsInfo :supports="seller.supports || []" solid="solid"></DiscountsInfo>
      </div>
      <SplitLine></SplitLine>
      <div class="merchant-live-action">
        <h4 class="merchant-live-action-title">商家实景</h4>
        <div class="merchant-live-action-imgs-wrap">
          <ul class="merchant-live-action-imgs-ul" ref="ul">
            <li class="merchant-live-action-imgs-item" v-for="(item, index) in seller.pics" :key="index">
              <img :src="item">
            </li>
          </ul>
        </div>
      </div>
      <SplitLine></SplitLine>
      <div class="merchant-info">
        <h4 class="merchant-info-title">商家信息</h4>
        <ul class="merchant-info-ul">
          <li class="merchant-info-ul-li" v-for="(item, index) in seller.infos" :key="index">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
import Star from '../common/star'
import SplitLine from '../common/SplitLine'
import DiscountsInfo from '../common/DiscountsInfo'
import _ from 'lodash'

export default {
  props: {
    seller: {
      type: Object,
      required: true
    }
  },
  components: {
    Star,
    SplitLine,
    DiscountsInfo
  },
  data() {
    return {
      isCollect: window.localStorage.merchantInfo && JSON.parse(window.localStorage.merchantInfo)[this.$route.query.id] && JSON.parse(window.localStorage.merchantInfo)[this.$route.query.id].isCollect // 当前是否收藏 这里只是用 localStorage 模拟
    }
  },
  watch: {
    seller: {
      immediate: true, // 路由切换进来 初始要执行一次
      handler(val) {
        // 有数据 初始化 滚动
        if (!val.pics) return
        this.$nextTick(() => {
          const ul = this.$refs.ul
          let offsetWidth = 0
          for (let item of ul.children) { // for of 可以循环 伪数组
            offsetWidth += item.offsetWidth
          }
          ul.style.width = offsetWidth + 1 + 'px' // 在安卓下 width正好会折行 所以+1
          this.scrollLiveAction = new Bscroll(ul.parentElement, {
            scrollX: true,
            eventPassthrough: 'vertical'
          })
          this.scroll = new Bscroll(this.$refs.merchant, {
            click: true
          })
        })
      }
    }
  },
  methods: {
    collect(event) {
      // merchantInfo: {
      //   123: {
      //     isCollect: true
      //   }
      // }
      if (!event._constructed) return
      const id = this.$route.query.id
      const merchantInfo = window.localStorage.merchantInfo
      let isCollect = false
      if (!merchantInfo) { // 首次收藏
        isCollect = true
      } else if (JSON.parse(merchantInfo)[id] === undefined || JSON.parse(merchantInfo)[id].isCollect === false) { // 没有收藏过这个商家 或 收藏过但为false 都要至为true
        isCollect = true
      }
      this.isCollect = isCollect
      console.log(isCollect)
      const o = _.merge(JSON.parse(window.localStorage.merchantInfo || '{}'), { [id]: { isCollect } })
      window.localStorage.merchantInfo = JSON.stringify(o)
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/app';

  .merchant {
    &-wrap {
      overflow: hidden;
    }
    &-title {
      position: relative;
      @include px2rem(height, 115);
      @include px2rem(margin, 36);
      margin-bottom: 0;
      border-bottom: 1px solid rgba(7, 17, 27, .1);
      &-h3 {
        @include lh(28, 28);
        @include px2rem(margin-bottom, 14);
        @include font-dpr(28);
        color: rgb(7, 17, 27);
      }
      &-p {
        @include lh(36, 36);
        @include font-dpr(20);
        color: rgb(77, 85, 93);
        &-star {
          float: left;
          margin-right: px2rem(15) !important;
        }
        &-ratingCount {
          float: left;
        }
        &-span {
          float: left;
          @include px2rem(margin-left, 24);
          @include font-dpr(20);
          color: rgb(77, 85, 93);
        }
      }
      // 收藏
      &-enshrine {
        position: absolute;
        top: 0;
        right: 0;
        @include wh(72, 78);
        text-align: center;
        .icon-favorite {
          position: relative;
          display: block;
          width: 100%;
          @include px2rem(height, 48);
          @include font-dpr(48);
          color: #93999F;
          &::before {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0);
          }
          &.on {
            color: #F01414;
          }
        }
        &-text {
          @include lh(30, 30);
          @include font-dpr(20);
          color: #4D555D;
        }
      }
    }
    &-flex3 {
      display: flex;
      @include px2rem(height, 148);
      @include px2rem(padding, 36 0);
      &-item {
        position: relative;
        flex: 1;
        text-align: center;
        &:last-of-type::before {
          content: none;
        }
        &::before {
          position: absolute;
          top: 0;
          right: 0;
          content: '';
          height: 100%;
          border-right: 1px solid #E6E7E8;
        }
        &-title {
          @include lh(20, 20);
          @include px2rem(margin-bottom, 8);
          @include font-dpr(20);
          color: rgb(147, 153, 159);
        }
        &-p {
          @include px2rem(height, 48);
          color: rgb(7, 17, 27);
          &-span {
            font-weight: 200;
            @include font-dpr(48);
          }
          &-sub {
            font-weight: 200;
            @include font-dpr(20);
          }
        }
      }
    }
    &-notice {
      @include px2rem(padding, 36 36 32);
      &-title {
        @include px2rem(margin-bottom, 16);
        @include font-dpr(28);
        font-weight: 500;
        color: #07111B;
      }
      &-text {
        @include px2rem(line-height, 48);
        @include px2rem(padding, 0 24);
        @include font-dpr(24);
        font-weight: 200;
        color: rgb(240, 20, 20);
      }
    }
    &-discountsInfo-wrap {
      @include px2rem(padding, 0 36);
      // 更改样式
      .discountsInfo {
        padding: 0;
        &-li {
          margin: 0;
          @include px2rem(padding, 32 0 32 24);
          border-top: 1px solid #E6E7E8;
          &-p {
            color: #07111B;
          }
        }
      }
    }
    &-live-action {
      @include px2rem(padding, 36);
      &-title {
        @include lh(26, 26);
        @include px2rem(margin-bottom, 24);
        @include font-dpr(26);
        font-weight: 500;
        color: #07111B;
      }
      &-imgs-wrap {
        width: 100%;
        @include px2rem(height, 180);
        overflow: hidden;
      }
      &-imgs-ul {
        height: 100%;
      }
      &-imgs-item {
        float: left;
        @include wh(252, 180);
        @include px2rem(padding-right, 12);
        &:last-of-type {
          @include px2rem(width, 240);
          @include px2rem(padding-right, 0);
        }
        img {
          @include wh(240, 180);
        }
      }
    }
    &-info {
      @include px2rem(padding, 33 36 0);
      &-title {
        @include px2rem(height, 52);
        @include font-dpr(28);
        font-weight: 500;
      }
      &-ul {
        &-li {
          @include px2rem(line-height, 32);
          @include px2rem(padding, 32 24);
          @include font-dpr(24);
          font-weight: 200;
          border-top: 1px solid #E6E7E8;
          color: #07111B;
        }
      }
    }
  }
</style>
