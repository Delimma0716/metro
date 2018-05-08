<template>
  <div class="detail-box">
    <div class="top">
      <h1>{{stationName}}</h1>
      <h3>
        <span v-for="line in lines">{{line}}</span>
      </h3>
      <mu-raised-button label="线路图" class="set-button" secondary/>
      <mu-raised-button label="设为终点" class="set-button" primary @click="setEnd" />
      <mu-raised-button label="设为起点" class="set-button" @click="setStart" />
    </div>
    <div class="middle">
      <div class="middle-block" v-for="schedule in schedules">
        <span>{{schedule.ls}} {{schedule.n}}方向</span>
        <span class="time">{{schedule.ft}} / {{schedule.lt}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  data () {
    return {
      stationCode: this.$route.params.statCode,
      stationName: this.$route.params.statName,
      lines: [],
      schedules: []
    }
  },
  mounted () {
    this.getDetail()
  },
  computed: {
    ...mapState({
      // 地图实例
      map: 'currentCityMap'
    })
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
    }
  }

}
</script>

<style lang="less" scoped>
.detail-box {
  .top {
    background: #e0e0e0;
    padding: 20px 5%;
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
}
</style>
