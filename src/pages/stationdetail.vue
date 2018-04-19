<template>
  <div class="detail-box">
    <div class="top">
      <h1>xx站</h1>
      <h3>xx线</h3>
      <mu-raised-button label="线路图" class="set-button" secondary/>
      <mu-raised-button label="设为终点" class="set-button" primary/>
      <mu-raised-button label="设为起点" class="set-button" />
    </div>
    <div class="middle">
      <div class="middle-block">
        <span>xx线 xxx方向</span>
        <span class="time">time-time</span>
      </div>
      <div class="middle-block">
        <span>xx线 xxx方向</span>
        <span class="time">time-time</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      stationCode: this.$route.params.statCode
    }
  },
  mounted () {
    this.getDetail()
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

          }
        })
    }
  }

}
</script>

<style lang="less" scoped>
.detail-box {
  .top {
    height: 160px;
    background: #eeeeee;
    padding: 20px 5%;
    h3 {
      margin-bottom: 10px;
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
