import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/pages/index'
import Choosecity from '@/pages/choosecity'
import Linelist from '@/pages/linelist'
import Stationdetail from '@/pages/stationdetail'
import Metromap from '@/components/map/metromap'
import Settings from '@/pages/settings'
import Login from '@/pages/login'
import User from '@/pages/user'

Vue.use(VueRouter)

const routes = [{
  path: '',
  component: Index,
  redirect: 'metromap',
  children: [
    {
      path: 'metromap',
      name: '首页',
      component: Metromap
    },
    {
      path: 'choosecity',
      name: '选择城市',
      component: Choosecity
    },
    {
      path: 'linelist',
      name: '选择站点',
      component: Linelist,
    },
    {
      path: 'transfer',
      name: '换乘查询',
      // component: Linelist
    },
    {
      path: 'settings',
      name: '设置',
      component: Settings
    },
    {
      path: 'login',
      name: '登录',
      component: Login
    },
    {
      path: 'user',
      name: '个人中心',
      component: User
    },
    {
      path: 'stationdetail/:statCode',
      name: '站点信息',
      component: Stationdetail
    }
  ]
}]

const router = new VueRouter({
  routes: routes
})

export default router
