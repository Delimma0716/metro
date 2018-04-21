<template>
  <div>
    <mu-list v-if="showList">
      <mu-list-item v-for="lineNo in Object.keys(lineList)" :title="lineNo" toggleNested :open="false">
        <mu-icon slot="left" value="directions_railway" />
        <mu-list-item v-for="stat in lineList[lineNo]" slot="nested" :title="stat[0]" :to="'stationdetail/'+stat[1]+'/'+stat[0]" class="slist-item">
        </mu-list-item>
      </mu-list-item>
    </mu-list>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      lineList: {},
      showList: false
    }
  },
  mounted() {
    this.getAllLines()
  },
  methods: {
    getAllLines() {
      this.lineList = {}
      // 获取所有线路
      axios
        .post('map/getlines', {
          code: this.$store.state.currentCityInfo.code,
          city: this.$store.state.currentCityInfo.city
        })
        .then(res => {
          let linelist = res.data.data.l
          linelist.forEach(line => {
            // 渲染数据
            let linename = (line.ln + ' ' + line.la).trim()
            this.lineList[linename] = []
            line.st.forEach(stat => {
              this.lineList[linename].push([stat.n, stat.si])
            })
          })
          console.log(this.lineList)
          this.showList = true
        })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
