<template>
  <div>
    <m-loading v-show="showLoading"></m-loading>
    <div id="mainmap" v-show="!showLoading"></div>
  </div>
</template>

<script>
import Loading from '@/components/tools/loading'
export default {
  data() {
    return {
      map: '',
      lines: [],
      showLoading: true
    }
  },
  mounted() {
    // 预留0.5s加载数据
    setTimeout(() => {
      this.showLoading = false
      this.init()
    }, 500)
  },
  methods: {
    init() {
      this.map = subway('mainmap', {
        // 上海的adcode
        adcode: this.$store.state.currentCityInfo.code,
        theme: 'colorful',
        easy: 1
      })
      // 让地图在下层
      document.getElementById('drag_handle').style.position = 'relative'
      // 地图加载完之后才能获取到所有线路
      this.map.event.on('subway.complete', () => {
        // 设置当前城市地图
        this.$store.commit('setCurrentCityMap', this.map)
      })
    }
  },
  components: {
    'm-loading': Loading
  }
}
</script>

<style lang="less" scoped>
// 地图不超过导航栏
#mainmap {
  position: relative;
  overflow: hidden;
}
</style>


