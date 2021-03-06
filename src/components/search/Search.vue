<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="getQuery"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll ref="shortcut" class="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="(item,index) in hotKeys" :key="index" @click="setQuery(item.k)">{{item.k}}</li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @selectItem="selectOne" @delet="deletSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query.length">
      <suggest ref="suggest" :query="query" @scrollList="inputBlur" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from '../../base/search-box/SearchBox'
import {getHotKey} from '../../api/search'
import {ERR_OK} from '../../api/config'
import Suggest from '../suggest/Suggest'
import {mapActions,mapGetters} from 'vuex'
import SearchList from '../../base/search-list/SearchList'
import Confirm from '../../base/confirm/Confirm'
import Scroll from '../../base/scroll/Scroll'
import {playlistMixin,searchMixin} from '../../common/js/mixin'

export default {
  name: 'Search',
  mixins:[playlistMixin,searchMixin],
  data(){
    return {
      hotKeys:[],
    }
  },
  created(){
    this._getHotKeys()
  },
  components:{
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  },
  computed:{
    shortcut(){
      return this.hotKeys.concat(this.SearchHistory)
    },
  },
  watch:{
    query(newQuery){
      if(!newQuery){
        setTimeout(()=>{
          this.$refs.shortcut.refresh()
        },20)
      }
    }
  },
  methods:{
    handlePlaylist(){
      let bottom = this.playlist.length > 0 ? '60px' : ''
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.shortcutWrapper.style.bottom = bottom 
      this.$refs.shortcut.refresh()
      this.$refs.suggest.refresh()
    },
    selectOne(item){
      this.setQuery(item)
    },
    showConfirm(){
      this.$refs.confirm.show()
    },
    _getHotKeys(){
      getHotKey().then(res=>{
        if(res.code === ERR_OK){
          this.hotKeys = res.data.hotkey.slice(0,10)
        }
      })
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  }
}
</script>

<style lang='stylus' scoped>
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';
.search {
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;
    .shortcut {
      height: 100%;
      overflow: hidden;
      .hot-key {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
          }
          .clear {
            extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }
  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>