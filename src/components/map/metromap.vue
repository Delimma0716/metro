<template>
  <div>
    <m-loading v-show="showLoading"></m-loading>
    <div id="mainmap" v-show="!showLoading"></div>
  </div>
</template>

<script>
import Loading from '@/components/tools/loading'
export default {
  data () {
    return {
      map: '',
      lines: [],
      showLoading: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.map = subway('mainmap', {
        // 上海的adcode
        adcode: this.$store.state.currentCityInfo.code,
        theme: 'colorful',
        easy: 1,
        doubleclick: { switch: true }
      })
      // 让地图在下层
      document.getElementById('drag_handle').style.position = 'relative'
      // 地图加载完之后才能获取到subway
      this.map.event.on('subway.complete', () => {
        // 加载完毕
        this.showLoading = false
        // 设置当前城市地图
        this.$store.commit('setCurrentCityMap', this.map)
        this.route()
      })
    },
    // 路径规划
    route () {
      if (this.$store.state.startCode !== '' && this.$store.state.endCode !== '') {
        this.map.route(this.$store.state.startCode, this.$store.state.endCode)
        this.$store.commit('setStartCode', '')
        this.$store.commit('setEndCode', '')
      }
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
