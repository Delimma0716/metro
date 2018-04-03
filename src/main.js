// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex'
import MuseUI from 'muse-ui'
import Less from 'less'
import axios from 'axios'
import 'muse-ui/dist/muse-ui.css'
import '@/assets/css/theme-carbon.css'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:3000'

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
  store
})
