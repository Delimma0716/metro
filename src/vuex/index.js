import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 当前城市地图信息
    currentCityMap: '',
    // 当前城市信息
    currentCityInfo: {
      code: '3100',
      name: '上海',
      city: 'shanghai'
    },
    // 标题栏标题
    headerTitle: '首页'
  },
  mutations: {
    // 更改当前城市
    setCurrentCityMap(state, map) {
      state.currentCityMap = map
    },
    // 更改当前城市信息
    setCurrentCityInfo(state, cityInfo) {
      state.currentCityInfo = cityInfo
    },
    // 更改标题
    setHeaderTitle(state, headerTitle) {
      state.headerTitle = headerTitle
    }
  },
  getters: {
    /**
     * 获取所有城市信息二维数组
     * 0:code
     * 1:{pinyin,name}
     * 
     **/
    getCities: state => {
      let cities = []
      state.currentCityMap.getCityList(list => {
        cities = Object.entries(list)
      })
      return cities
    },

    /**
     * 获取当前城市所有线路
     */
    getLines: state => {
      let lines = []
      
      state.currentCityMap.getLineList(list => {
        lines = list
      })
      return lines
    }
  }
})

export default store