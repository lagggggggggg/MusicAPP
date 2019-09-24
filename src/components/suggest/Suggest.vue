<template>
  <scroll 
    ref="suggest"
    class="suggest" 
    :beforeScroll="beforeScroll"
    :data="result"
    :pullUpToFresh="pullUpToFresh"
    @scrollToEnd="searchMore"
    @beforeScroll="scrollList"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="getItemCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getItemText(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import {getSearch} from '../../api/search'
import {ERR_OK} from '../../api/config'
import {createSong,isValidMusic} from '../../common/js/song'
import {getMusic} from '../../api/singer'
import Scroll from '../../base/scroll/Scroll'
import Loading from '../../base/loading/Loading'
import Singer from '../../common/js/singer'
import { mapMutations , mapActions } from 'vuex'
import NoResult from '../../base/no-result/NoResult'

const TYPE_SINGER = 'singer'
const prepage = 20

export default {
  props:{
    query:{
      type:String,
      default:''
    },
    showSinger:{
      type:Boolean,
      default:true
    }
  },
  data(){
    return {
      page:1,
      result:[],
      pullUpToFresh:true,
      hasMore:true,
      beforeScroll:true,
    }
  },
  watch:{
    query(){
      this.search()
    }
  },
  components:{
    Scroll,
    Loading,
    NoResult
  },
  methods:{
    search(){
      this.hasMore = true
      this.page = 1
      this.$refs.suggest.scrollTo(0,0)
      this.result=[]
      getSearch(this.query,this.page,this.showSinger,prepage).then(res=>{
        console.log(res)
        if(res.code === ERR_OK){
          this._genResult(res.data).then(res=>{
            this.result = res
          })
          this._checkHasMore(res.data)
        }
      })
    },
    searchMore(){
      if(!this.hasMore){
        return 
      }
      this.page++
      getSearch(this.query,this.page,this.showSinger,prepage).then(res=>{
        if(res.code === ERR_OK){
          this._genResult(res.data).then((res)=>{
            this.result = this.result.concat(res)
          })
          this._checkHasMore(res.data)
        }
      })
    },
    getItemCls(item){
      if(item.type == TYPE_SINGER){
        return 'icon-mine'
      }else{
        return 'icon-music'
      }
    },
    getItemText(item){
      if(item.type == TYPE_SINGER){
        return item.singername
      }else{
        return `${item.name}—${(item.singer)}`
      }
    },
    selectItem(item){
      if(item.type==TYPE_SINGER){
        let singer = new Singer(
         item.singermid,
         item.singername
        )
        this.$router.push({
          path:`/search/${singer.id}`
        })
        this.setSinger(singer)
      }else{
        this.insertSong(item)
      }
      this.$emit('select')
      console.log(123)
    },
    scrollList(){
      this.$emit('scrollList')
    },
    refresh(){
      this.$refs.suggest.refresh()
    },
    _checkHasMore(data){
      let song = data.song
      if(!song.list.length || song.cunum + (song.curpage-1)*prepage > song.totalnum ){
        this.hasMore = false
      }
    },
    _genResult(data){
      let ret = []
      if(data.zhida && data.zhida.singermid && this.page==1){
        ret.push({...data.zhida,...{type:TYPE_SINGER}})
      }
      if(data.song){
        return this._normalizeSongs(data.song.list).then(res=>{
          ret = ret.concat(res)
          return ret
        })
      }
    },
    _normalizeSongs(list) {
      return new Promise((resolve,reject)=>{
        let ret = []
        list.forEach((musicData,index) => {
          getMusic(musicData.songmid).then(res => {
            if (res.code === ERR_OK) {
              const svkey = res.data.items
              const songVkey = svkey[0].vkey
              const newSong = createSong(musicData, songVkey)
              ret.push(newSong)
              if(index == list.length-1){
                resolve(ret)
              }
            }
          })
        })
      })
    },
    ...mapMutations({
      setSinger:'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }
    .icon {
      flex: 0 0 30px;
      width: 30px;
      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }
    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;
      .text {
        no-wrap();
      }
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}

</style>