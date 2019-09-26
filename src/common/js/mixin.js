import {mapGetters,mapMutations,mapActions} from 'vuex'
import {playMode} from './config'
import {shuffle} from '../js/shuffle'

export const playlistMixin = {
  computed: {
    ...mapGetters(["playlist"])
  },
  mounted() {
    this.handlePlaylist(this.playlist);
  },
  activated() {
    this.handlePlaylist(this.playlist);
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal);
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error("component must implement handllPlaylist method");
    }
  }
};

export const playerMixin = {
  computed:{
    iconMode(){
      return this.mode === playMode.sequence? 'icon-sequence':this.mode=== playMode.loop? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'mode',
      'playlist'
    ])
    
  },

  methods:{
    changeMode(){
      let mode =(this.mode+1)%3
      this.setPlayMode(mode)
      let list =[]
      if(mode===playMode.random){
        list = shuffle(this.sequenceList)
      }else{
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list){
      let index = list.findIndex((item)=>{
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      setPlayingState:'SET_PLAYING_STATE',
      setCurrentIndex : 'SET_CURRENT_INDEX',
      setPlayMode : 'SET_PLAY_MODE',
      setPlayList:'SET_PLAYLIST'
    })
  },
}

export const searchMixin = {
  data(){
    return {
      query:''
    } 
  },
  computed:{
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods:{
    setQuery(query){
      this.$refs.searchBox.setQuery(query)
    },
    getQuery(query){
      this.query = query
    },
    inputBlur(){
      this.$refs.searchBox.inputBlur()
    },
    saveSearch(){
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deletSearchHistory',
    ])
  }
}