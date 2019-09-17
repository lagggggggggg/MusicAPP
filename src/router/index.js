import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '../components/recommend/Recommend'
import Rank from '../components/rank/Rank'
import Singer from '../components/singer/Singer'
import Search from '../components/search/Search'

Vue.use(Router)

export default new Router({
  routes:[
    {
      path:'/',
      redirect:'/recommend'
    },
    {
      path:'/recommend',
      component:Recommend
    },
    {
      path:'/singer',
      component:Singer
    },
    {
      path:'/search',
      component:Search
    },
    {
      path:'/rank',
      component:Rank
    },
  ]
})