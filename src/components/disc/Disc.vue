<template>
  <div>
    <transition name="slide">
      <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
  </div>
</template>

<script>
import MusicList from '../music-list/MusicList'
import {mapGetters} from 'vuex'
import {ERR_OK} from '../../api/config'
import {getSongList} from '../../api/recommend'
import { getMusic } from '../../api/singer'
import {createSongList,isValidMusic} from '../../common/js/song.js'

export default {
  name:'Disc',
  computed:{
    title(){
      return this.disc.dissname
    },
    bgImage(){
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  data(){
    return {
      songs:[]
    }
  },
  created(){
    this._getSongList()
  },
  components:{
    MusicList,
  },
  methods:{
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs(list) {
      const ret = []
      list.forEach((musicData,index) => {
        if (isValidMusic(musicData)) {
          musicData.index = index
          getMusic(musicData.mid).then(res => {
            if (res.code === ERR_OK) {
              const svkey = res.data.items
              const songVkey = svkey[0].vkey
              const newSong = createSongList(musicData, songVkey)
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
    }
  }
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