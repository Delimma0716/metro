// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex'
import MuseUI from 'muse-ui'
import Less from 'less'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-carbon.css'
// import 'muse-ui/dist/theme-light.css'

Vue.config.productionTip = false

Vue.use(MuseUI)
Vue.use(Less)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>',
  store,
})
