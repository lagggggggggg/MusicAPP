<template>
  <div class="container">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail, getMusic} from '../../api/singer'
import {ERR_OK} from '../../api/config'
import {createSong,isValidMusic} from '../../common/js/song'
import MusicList from '../music-list/MusicList'

export default {
  data(){
    return {
      songs:[]
    }
  },
  computed:{
    title(){
      return this.singer.name
    },
    bgImage(){
      return this.singer.avatar
    },
    singerID(){
       let id = this.singer.id
       return id
    },
    ...mapGetters([
      'singer'
    ])
  },
  created(){
    this._getSingerDetail()
  },
  components:{
    MusicList,
  },
  methods:{
    _getSingerDetail(){
      if(!this.singerID){
        this.$router.push({
          path:'/singer'
        })
        return 
      }
      getSingerDetail(this.singerID).then(res=>{
        if(res.code === ERR_OK){
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    _normalizeSongs(list) {
      const ret = [] 
      list.forEach(item => {
        const { musicData } = item 
        if (isValidMusic(musicData)) {
          getMusic(musicData.songmid).then(res => {
            if (res.code === ERR_OK) {
              const svkey = res.data.items
              const songVkey = svkey[0].vkey
              const newSong = createSong(musicData, songVkey)
              ret.push(newSong)
            }
          })
        }
      })
      return ret
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

</style>