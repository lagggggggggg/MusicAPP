<template>
  <div class="search-list" v-show="searches.length">
    <ul>
      <li :key="index" class="search-item"  v-for="(item,index) in searches" @click="select(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="delet(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script >
  export default {
    props: {
      searches: {
        type: Array,
        default () {
          return []
        }
      }
    },
    methods: {
      select(item){
        this.$emit('selectItem',item)
      },
      delet(item){
        this.$emit('delet',item)
      },
    }
  }
</script>

<style scoped lang="stylus">
  @import "~@/common/stylus/variable"
  @import "~@/common/stylus/mixin"

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>