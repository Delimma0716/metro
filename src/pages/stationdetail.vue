<template>
  <div class="detail-box">
    <div class="top">
      <h1>{{stationName}}</h1>
      <h3>
        <span v-for="line in lines">{{line}}</span>
      </h3>
      <div v-if="map!==''">
        <mu-raised-button label="到这里去" class="set-button" secondary @click="navigate" />
        <mu-raised-button label="设为终点" class="set-button" primary @click="setEnd" />
        <mu-raised-button label="设为起点" class="set-button" @click="setStart" />
      </div>
    </div>
    <div class="middle">
      <div class="middle-block" v-for="schedule in schedules">
        <span>{{schedule.ls}} {{schedule.n}}方向</span>
        <span class="time">{{schedule.ft}} / {{schedule.lt}}</span>
      </div>
    </div>
    <div class="bottom">
      <m-loading v-show="showLoading"></m-loading>
      <div id="submap" v-show="!showLoading"></div>
    </div>
    <mu-toast v-if="toast" message="定位失败" />
  </div>
</template>

<script>
import Loading from '@/components/tools/loading'
import axios from 'axios'

export default {
  data () {
    return {
      stationCode: this.$route.params.statCode,
      stationName: this.$route.params.statName,
      position: [],
      lines: [],
      schedules: [],
      // 地图实例
      map: '',
      // 导航插件
      transfer: [],
      walking: [],
      driving: [],
      currentPosition: [],
      toast: false,
      showLoading: false
    }
  },
  mounted () {
    this.getDetail()
  },
  components: {
    'm-loading': Loading
  },
  methods: {
    getDetail () {
      axios
        .post('map/getstinfo', {
          code: this.$store.state.currentCityInfo.code,
          city: this.$store.state.currentCityInfo.city,
          si: this.stationCode
        })
        .then(res => {
          if (res.data.retCode === 1) {
            // 线路去重
            this.lines = []
            for (let line of res.data.data.lines) {
              if (this.lines.indexOf(line) < 0) {
                this.lines.push(line)
              }
            }
            // 若没有时刻则不显示
            this.schedules = []
            for (let schedule of res.data.data.schedules) {
              if (schedule.lt !== '--:--' && schedule.ft !== '--:--' && schedule.ls !== '' && schedule.n !== '') {
                this.schedules.push(schedule)
              }
            }
            this.position = res.data.data.position
            // 显示小地图
            this.showMap()
          }
        })
    },
    // 设置起点
    setStart () {
      this.$store.commit('setStartCode', this.stationCode)
      this.checkRoute()
    },
    // 设置终点
    setEnd () {
      this.$store.commit('setEndCode', this.stationCode)
      this.checkRoute()
    },
    // 检查起点终点
    checkRoute () {
      if (this.$store.state.startCode !== '' && this.$store.state.endCode !== '') {
        this.$router.push('/metromap')
      }
    },
    // 显示周边地图
    showMap () {
      this.map = new AMap.Map('submap', {
        resizeEnable: true,
        zoom: 16,
        center: this.position
      })
      // 定位工具
      AMap.plugin('AMap.Geolocation', () => {
        let geolocation = new AMap.Geolocation()
        this.map.addControl(geolocation)
        AMap.event.addListener(geolocation, 'complete', (result) => {
          geolocation.getCurrentPosition()
        })
        AMap.event.addListener(geolocation, 'error', () => {
          this.toast = true
          setTimeout(() => {
            this.toast = false
          }, 2000)
        })
      })
    },
    // 导航
    navigate () {
      let transOptions = {
        map: this.map,
        panel: 'submap'
      }
      // 定位
      this.map.plugin('AMap.Geolocation', () => {
        let geolocation = new AMap.Geolocation()
        this.showLoading = true
        geolocation.getCurrentPosition((status, result) => {
          if (status === 'complete') {
            this.currentPosition = [result.position.lng, result.position.lat]
            this.showLoading = false
            console.log('------', this.currentPosition, this.position)
            // 导航插件 步行 驾车 公交
            AMap.service(['AMap.Walking', 'AMap.Driving'], () => {
              this.walking = new AMap.Walking(transOptions)
              this.walking.search(this.currentPosition, this.position)

              this.driving = new AMap.Driving(transOptions)
              this.driving.search(this.currentPosition, this.position)

              this.transfer = new AMap.Transfer(transOptions)
              this.transfer.search(this.currentPosition, this.position)
            })
          } else {
            this.toast = true
            setTimeout(() => {
              this.toast = false
            }, 2000)
          }
        })
      })
    },
    // 获取当前位置
    getCurrentPoi () {
      this.currentPosition = [122.488, 31.3813]
    }
  }
}
</script>

<style lang="less" scoped>
.detail-box {
  .top {
    background: #e0e0e0;
    padding: 10px 20px 5%;
    margin-bottom: 20px;
    h3 {
      margin-bottom: 20px;
      span {
        margin-right: 10px;
      }
    }
    .set-button {
      float: right;
      margin-left: 10px;
    }
  }
  .middle {
    padding: 20px 5%;
    .middle-block {
      margin-bottom: 10px;
      .time {
        float: right;
      }
    }
  }
  .bottom {
    padding: 0 20px 5%;
    #submap {
      width: 100%;
      height: 600px;
    }
  }
}
</style>
