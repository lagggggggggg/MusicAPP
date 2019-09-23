import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '../components/recommend/Recommend'
import Rank from '../components/rank/Rank'
import Singer from '../components/singer/Singer'
import Search from '../components/search/Search'
import SingerDetail from '../components/singer-detail/SingerDetail'
import Disc from '../components/disc/Disc.vue'
import TopList from '../components/top-list/TopList'

Vue.use(Router)

export default new Router({
  routes:[
    {
      path:'/',
      redirect:'/recommend',
    },
    {
      path:'/recommend',
      component:Recommend,
      children:[
        {
          path:':id',
          component:Disc
        }
      ]
    },
    {
      path:'/singer',
      component:Singer,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {
      path:'/search',
      component:Search,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {
      path:'/rank',
      component:Rank,
      children:[
        {
          path:':id',
          component:TopList
        }
      ]
    },
  ]
})