<template>
  <div class="singer">
    <list-view :data="singerList" @select="selectSinger"></list-view>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import {getSingerList} from '../../api/singer'
import { ERR_OK } from '../../api/config'
import Singer from '../../common/js/singer'
import ListView from '../../base/listview/ListView'
import {mapMutations} from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  name: 'Singer',
  data(){
    return {
      singerList:[],
    }
  },
  created(){
    this._getSingerList()
  },
  components:{
    ListView,
  },
  methods:{
    _getSingerList(){
      getSingerList().then(res=>{
        if(res.code === ERR_OK){
          this.singerList = this._normalizeSingerList(res.data.list)
        }
      })
    },
    _normalizeSingerList(list){
      let map = {
        hot:{
          title: HOT_NAME,
          items:[],
        }
      }
      list.forEach((item,index) => {
        if(index<HOT_SINGER_LEN){
          map.hot.items.push(new Singer(item.Fsinger_mid,item.Fsinger_name))
        }
        const key = item.Findex
        if(!map[key]){
          map[key]={
            title:key,
            items:[]
          }
        }
        map[key].items.push(new Singer(item.Fsinger_mid,item.Fsinger_name))   
      });
      let hot = [];
      let ret = [];
      for(let key in map){
        let val = map[key]
        if(val.title.match(/[a-zA-Z]/)){
            ret.push(val)
        }else if(val.title === HOT_NAME){
            hot.push(val)
        }
      }
      ret.sort((a, b) => {
         return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
       return hot.concat(ret) 
    },
    selectSinger(singer){
      this.$router.push({
        path:`singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger:'SET_SINGER'
    })
  },
}
</script>

<style lang='stylus' scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    .slide-enter-active, .slide-leave-active
      transition: all .3s
    .slide-enter,  .slide-leave-to  
      transform: opacity 0
</style>