<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
        <div class="header">
            <h1 class="title">添加歌曲到列表</h1>
            <div class="close" @click="hide">
                <i class="icon-close"></i>
            </div>
        </div>
        <div class="search-box-wrapper">
          <search-box ref="searchBox" placeholder="搜索歌曲" @query="getQuery"></search-box>
        </div>
        <div class="shortcut" v-show="!query">
          <switches :currentIndex="currentIndex" :switches="switches" @switch="switchItem"></switches>
          <div class="list-wrapper">
            <scroll ref="songList" v-show="currentIndex===0" :data="playHistory" class="list-scroll">
              <div class="list-inner">
                <song-list :songs="playHistory" @select="seletcSong"></song-list>
              </div>
            </scroll>
            <scroll ref="searchList" v-show="currentIndex === 1" :data="searchHistory" class="list-scroll">
              <div class="list-inner">
                <search-list :searches="searchHistory" @selectItem="setQuery" @delet="deletSearchHistory"></search-list>
              </div>
            </scroll>
          </div>
        </div>
        <div class="search-result" v-show="query">
            <suggest :query="query" :showSinger="showSinger" @select="selectSuggest" @scrollList="inputBlur"></suggest>
        </div>
    </div>
  </transition>
</template>

<script>
import Suggest from '../suggest/Suggest'
import SearchBox from '../../base/search-box/SearchBox'
import {mapGetters,mapActions} from 'vuex'
import {searchMixin} from '../../common/js/mixin'
import Switches from '../../base/switches/Switches'
import Scroll from '../../base/scroll/Scroll'
import SongList from '../../base/song-list/SongList'
import Song from '../../common/js/song'
import SearchList from '../../base/search-list/SearchList'

export default {
  mixins:[searchMixin],
  data() {
    return {
      showFlag: false,
      showSinger: false,
      currentIndex:0,
      switches:[
        {name:'最近播放'},
        {name:'搜索历史'}
      ]
    };
  },
  computed: {
    ...mapGetters(["playHistory"])
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList
  },
  methods: {
    show() {
      this.showFlag = true;
      if(this.currentIndex ===0 ){
        setTimeou(()=>{
          this.$refs.songList.refresh()
        },20)
      }else{
        setTimeout(()=>{
          this.$refs.searchList.refresh()
        },20)
      }
    },
    hide() {
      this.showFlag = false;
    },
    selectSuggest() {
      this.saveSearch();
    },
    switchItem(index){
      this.currentIndex = index
    },
    seletcSong(item,index){
      if(index!==0){
         this.insertSong(new Song(item))
      }
    },
    ...mapActions([
      'insertSong'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@/common/stylus/variable';
@import '~@/common/stylus/mixin';

.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background: $color-background;

  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }

  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .header {
    position: relative;
    height: 44px;
    text-align: center;

    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }

    .close {
      position: absolute;
      top: 0;
      right: 8px;

      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }

  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut {
    .list-wrapper {
      position: absolute;
      top: 165px;
      bottom: 0;
      width: 100%;

      .list-scroll {
        height: 100%;
        overflow: hidden;

        .list-inner {
          padding: 20px 30px;
        }
      }
    }
  }

  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }

  .tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;

    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 4px;
    }

    .text {
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
}
</style>