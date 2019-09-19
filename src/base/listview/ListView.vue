<template>
  <scroll ref="scroll" 
    class="listview" 
    :data="data"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
  >
    <ul>
      <li v-for="group in data" :key="group.index" class="list-group" ref="group">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li 
            v-for="item in group.items" 
            :key="item.index" 
            class="list-group-item"
            @click="onSelect(item)"
          >
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut">
      <ul>
        <li v-for="(item,index) in shortcutList" class="item" 
          :key='index' 
          :data-index="index"
          :class="{current:currentIndex==index}"
          @touchstart = "onShortcutTouchStart"
          @touchmove.stop.prevent = "onShortcutTouchMove"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from '../scroll/Scroll'
import {getData} from '../../common/js/dom'
import Loading from '../loading/Loading'

const ANCHOR_HEIGHT = 18
export default {

  props: {
    data:{
      type: Array,
      default:[],
    }
  },
  created(){
    this.touchStart = {},
    this.listenScroll = true,
    this.listHeight = [],
    this.probeType = 3
  },
  data(){
    return {
      scrollY:-1,
      currentIndex:0,
    }
  },
  watch:{
    data(){
      setTimeout(()=>{
        this._calculateListHeight()
      },20)
    },
    scrollY(newY){
      if(newY>0){
        this.currentIndex = 0
        return 
      }
      let listHeight = this.listHeight
      for (let i = 0;i<listHeight.length-1;i++){
        let height1 = listHeight[i]
        let height2 = listHeight[i+1]
        if(-newY>=height1 && -newY<height2){
          this.currentIndex = i
          return 
        }
      }
      this.currentIndex = listHeight.length-2
    },
  },
  computed:{
    shortcutList(){
      return this.data.map((item)=>{
        return item.title.substr(0,1)
      })
    },
    fixedTitle(){
      if(this.scrollY>0){
        return null
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  components: {
    Scroll,
    Loading
  },
  methods:{
    onSelect(item){
      this.$emit('select', item)
    },
    onShortcutTouchStart(e){
      this.touchStart.y1 = e.touches[0].pageY
      let anchorIndex = getData(e.target,'index')
      this.touchStart.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e){
      this.touchStart.y2 = e.touches[0].pageY
      let number = Math.floor((this.touchStart.y2-this.touchStart.y1)/ANCHOR_HEIGHT)
      let anchorIndex = parseInt(this.touchStart.anchorIndex) + number
      this._scrollTo(anchorIndex)
    },
    scroll(pos){
      this.scrollY = pos.y
    },
    _scrollTo(index){
      this.$refs.scroll.scrollToElement(this.$refs.group[index],0)
    },
    _calculateListHeight(){
      this.listHeight = []
      let height = 0
      this.listHeight.push(height)
      let list = this.$refs.group
      for(let i=0;i<list.length;i++){
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
 @import "~@/common/stylus/variable"

.listview
  position: relative
  width: 100%
  height:100%;
  overflow: hidden
  background: $color-background
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>