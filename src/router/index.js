import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/pages/index'
import Choosecity from '@/pages/choosecity'
import Linelist from '@/pages/linelist'
import Metromap from '@/components/map/metromap'

Vue.use(VueRouter)

const routes = [{
  path: '',
  component: Index,
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
      name: '站点信息',
      component: Linelist
    },
    {
      path: 'transfer',
      name: '换乘查询',
      component: Linelist
    },
    {
      path: 'settings',
      name: '设置',
      component: Linelist
    }
  ]
}]

const router = new VueRouter({
  routes: routes
})

export default router
