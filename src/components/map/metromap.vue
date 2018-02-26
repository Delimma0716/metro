<template>
  <div id="metromap"></div>
</template>

<script>
export default {
  data() {
    return {
      map: '',
      lines: []
    }
  },
  mounted() {
    this.map = subway('metromap', {
      //上海的adcode
      adcode: this.$store.state.currentCityInfo.code,
      theme: 'colorful',
      easy: 1
    })
    // 地图加载完之后才能获取到所有线路
    this.map.event.on('subway.complete', () => {
      // 设置当前城市地图
      this.$store.commit('setCurrentCityMap', this.map)
    })
  }
}
</script>

<style lang="less">
// 地图不超过导航栏
#metromap {
  position: relative;
  overflow: hidden;
}
// 让地图在下层
.amap-subway-api #drag_handle {
  position: relative;
}
</style>


