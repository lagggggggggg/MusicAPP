<template>
  <div class="search">
    <transition>
      <div class='text' v-if="show">111111111111111111111111</div>
    </transition>
    <button class="btn" @click='click'></button>
  </div>
</template>

<script>

export default {
  name: 'Search',
  data(){
    return {
      show:true
    }
  },
  methods:{
    click(){
      this.show = !this.show
    }
  }
}
</script>

<style>
.search{
  display: flex;
  flex-direction: column;

}
.text{
  color:aliceblue;
  font-size:30px;
}

.btn{
  width:20px;
  height:20px

}

.v-enter-active{
  transition: all 1s
}
.v-enter{
  opacity: 0
}
</style>