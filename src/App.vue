<template>
  <div id="app">
    <my-header></my-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive> 
    <player v-if="true"></player>
  </div>
</template>

<script>
import MyHeader from './components/my-header/my-header'
import Tab from './components/tab/Tab'
import Player from './components/player/Player'

export default {
  name: 'App',
  components:{
    MyHeader,
    Tab,
    Player
  },
}
</script>

<style>

</style>
