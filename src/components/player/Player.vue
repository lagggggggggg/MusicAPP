<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image"/>
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l" v-show="currentShow==='cd' " @click="showLyric">
            <div class="cd-wrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div> 
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll 
            v-show="currentShow==='lyric'" 
            class="middle-r" 
            ref="lyricList" 
            :data="currentLyric && currentLyric.lines"
          >
            <div @click="showCD"  class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" 
                  :class="{'current':currentLineNum===index}" 
                  class="text" 
                  v-for="(line,index) in currentLyric.lines" 
                  :key="index"
                >
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll> 
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" @click="showCD" :class="{'active':currentShow === 'cd'}"></span>
            <span class="dot" @click="showLyric" :class="{'active':currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange='percentChange'></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div @click="togglePlay" :class="disableCls" class="icon i-center">
              <i :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen"  @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlay" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
     <audio ref="audio" 
      :src="currentSong.url" 
      @canplay="ready" 
      @error="error" 
      @timeupdate="updateTime"
      @ended="end"	
    ></audio>
  </div>
</template>


<script>

import { 
  mapGetters ,
  mapMutations ,
  mapActions,
} from 'vuex'
import ProgressBar from '../../base/progress-bar/ProgressBar'
import ProgressCircle from '../../base/progress-circle/ProgressCircle'
import {playMode} from '../../common/js/config'
import {shuffle} from '../../common/js/shuffle'
import Lyric from 'lyric-parser'
import Scroll from '../../base/scroll/Scroll'
import Playlist from '../playlist/Playlist'
import {playerMixin} from '../../common/js/mixin'

export default {
  mixins:[playerMixin],
  data() {
    return {
      songReady:false,
      currentTime:0,
      radius:32,
      currentLyric:null,
      currentLineNum: null,
      currentShow:'cd',
      playingLyric:'',
    };
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  },
  watch:{
    currentSong(newSong,oldSong){
      if(!newSong.id){
        return 
      }
      if(newSong.id===oldSong.id){
        return 
      }
      if(this.currentLyric){
        this.currentLyric.stop()
      }
      setTimeout(()=>{
        this.$refs.audio.play()
        this.getLyric()
      },1000)
    },
    playing(){
      this.$nextTick(()=>{
        this.playing?this.$refs.audio.play():this.$refs.audio.pause()
      })
    }
  },
  computed:{
    playIcon(){
      return this.playing?'icon-pause':'icon-play'
    },
    miniIcon(){
      return this.playing?'icon-pause-mini':'icon-play-mini'
    },
    cdCls(){
      return this.playing?'play' : 'play pause'
    },
    disableCls(){
      return this.songReady? '' : 'disable'
    },
    percent(){
      return this.currentTime/this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playing',
      'currentIndex',
    ])
  },
  methods:{
    back(){
      this.setFullScreen(false)
    },
    open(){
      this.setFullScreen(true)
    },
    togglePlay(){
      if(!this.songReady){
        return 
      }
      if(this.currentLyric){
        this.currentLyric.togglePlay()
      }
      this.setPlayingState(!this.playing)
    },
    prev(){
      if(!this.songReady){
        return 
      }
      if(this.playlist.length === 1){
        this.loop()
      }else{
       let index = this.currentIndex - 1
        if(index<0){
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if(!this.playing){
          this.togglePlay()
        } 
      }
      this.songReady = false
    },
    next(){
      if(!this.songReady){
        return 
      }
      if(this.playlist.length === 1 ){
        this.loop()
      }else{
        let index = this.currentIndex + 1
        if(index===this.playlist.length){
          index = 0
        }
        this.setCurrentIndex(index)
        if(!this.playing){
          this.togglePlay()
        }
      }
      this.songReady = false
    },
    ready(){
      this.songReady = true
      this.setPlayHistory(this.currentSong)
    },
    end(){
      if(this.mode === playMode.loop){
        this.loop()
      }else{
        this.next()
      }
    },
    loop(){
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if(this.currentLyric){
        this.currentLyric.seek(0)
      }
    },
    error(){
      this.songReady = true
    },
    updateTime(e){
      this.currentTime = e.target.currentTime
    },
    format(time){
      let min = Math.floor(time/60)
      let sec = this._pad(Math.floor(time%60))
      return `${min}:${sec}`
    },
    percentChange(percent){
      let time = this.currentSong.duration*percent 
      this.$refs.audio.currentTime = time
      if(!this.playing){
        this.togglePlay()
      }
      if(this.currentLyric){
        this.currentLyric.seek(time*1000)
      }
    },
    getLyric(){
      this.currentSong.getLyric().then(res=>{
        this.currentLyric = new Lyric(res,this.handleLyric)
        if(this.playing){
          this.currentLyric.play()
        }
      }).catch(()=>{
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    handleLyric({lineNum,txt}){
      this.currentLineNum = lineNum
      if(lineNum>5){
        let el = this.$refs.lyricLine[lineNum-5]
        this.$refs.lyricList.scrollToElement(el,1000)
      }else{
        this.$refs.lyricList.scrollTo(0,0,1000)
      }
      this.playingLyric = txt
    },
    showLyric(){
      this.currentShow='lyric'
    },
    showCD(){
      this.currentShow='cd'
    },
    showPlaylist(){
      this.$refs.playlist.show()
    },
    _pad(num,n=2){
      let len = num.toString().length
      if(len<n){
        num = '0'+ num
        len++
      }
      return num
    },
    ...mapMutations({
      setFullScreen:'SET_FULL_SCREEN',
    }),
    ...mapActions([
      'setPlayHistory'
    ])
  }
};
</script>


<style scoped lang="stylus" >
@import '~@/common/stylus/variable';
@import '~@/common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }

            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause{
              animation-play-state: paused
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .progress-bar-wrapper {
          flex: 1;
        }

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
