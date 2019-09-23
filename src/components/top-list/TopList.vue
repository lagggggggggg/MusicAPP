<template>
  <div>
    <transition name="slide">
      <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
    </transition>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getMusicList} from '../../api/rank'
import {ERR_OK} from '../../api/config'
import { getMusic } from '../../api/singer'
import { createSong,isValidMusic } from '../../common/js/song'
import MusicList from '../music-list/MusicList'


export default {
  name:'TopList',
  computed:{
    title(){
      return this.topList.topTitle
    },
    bgImage(){
      if(this.songs.length){
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'topList'
    ])
  },
  data(){
    return {
      songs:[],
      rank:true,
    }
  },
  created(){
    if(!this.topList.id){
      this.$router.push({
        path:'/rank'
      })
      return 
    }
    this._getMusicList()
  },
  components:{
    MusicList,
  },
  methods:{
    _getMusicList(){
      getMusicList(this.topList.id).then(res=>{
        if(res.code === ERR_OK){
          this.songs = this._normalizeSongs(res.songlist)
          console.log(this.songs)
        }
      })
    },
    _normalizeSongs(list) {
      const ret = []
      list.forEach((item,index) => {
        const musicData = item.data
        musicData.index = index
        if (isValidMusic(musicData)) {
          getMusic(musicData.songmid).then(res => {
            if (res.code === ERR_OK) {
              const svkey = res.data.items
              const songVkey = svkey[0].vkey
              const newSong = createSong(musicData, songVkey)
              ret.push(newSong)
              this._sortArr(ret)
            }
          })
        }
      })
      return ret
    },
    _sortArr(arr){
      return arr.sort((a,b)=>{
        return a.index - b.index
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable';
@import '~@/common/stylus/mixin';

.slide-enter-active, .slide-leave-active
  transition: all 0.3s;

.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0);

</style>