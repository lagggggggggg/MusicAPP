// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import fastclick from 'fastclick'
import 'common/stylus/index.styl'
import router from './router/index'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload,{
  loading:require('./common/image/logo.png')
})
fastclick.attach(document.body)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App),
  router
})
