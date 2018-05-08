<template>
  <div class="box">
    <div class="action">
      <mu-raised-button icon="add" mini class="demo-float-button" label="添加提醒" @click="open" />
    </div>
    <!-- 提醒列表 -->
    <mu-list class="list">
      <mu-divider v-if="alarms.length>0" />
      <div v-for="(alarm,index) in alarms">
        <mu-list-item disableRipple @click="handleToggle('events')" :title="alarm.alValue">
          <mu-switch :v-model="alarm" slot="right" :value="start[index]" @change="startAlarm(index,alarm)" />
        </mu-list-item>
        <mu-divider />
      </div>
    </mu-list>
    <!-- 添加提醒 -->
    <div class="addBox" id="add">
      <mu-appbar>
        <mu-flat-button slot="left" label="取消" color="white" @click="close" />
        <div style="text-align:center;font-size:18px;">添加提醒</div>
        <mu-flat-button slot="right" label="确定" color="white" @click="addAlarm" />
      </mu-appbar>
      <mu-content-block>
        <div class="radioBox">
          <mu-radio label="按站点" name="group" :nativeValue="radioValue[0]" v-model="type" uncheckIcon="radio_button_unchecked" checkedIcon="radio_button_checked" /> <br/>
          <mu-picker :slots="stationSlots" :visible-item-count="5" @change="stationChange" :values="stations" />
        </div>
        <div class="radioBox">
          <mu-radio label="按时间" name="group" :nativeValue="radioValue[1]" v-model="type" class="demo-radio" uncheckIcon="radio_button_unchecked" checkedIcon="radio_button_checked" /> <br/>
          <mu-time-picker hintText="选择时间" v-model="time" /><br/>
        </div>
      </mu-content-block>
    </div>

    <mu-snackbar v-if="snackbar" :message="msg" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  data () {
    return {
      alarms: [],
      radioValue: ['stat', 'time'],
      type: 'stat',
      time: '',
      lines: {},
      stationSlots: [],
      stations: [],
      stationLine: '',
      stationName: '',
      msg: '',
      snackbar: false,
      start: []
    }
  },
  mounted () {
    this.getAlarms()
  },
  methods: {
    // 获取改用户所有提醒
    getAlarms () {
      axios.post('user/getalarms', {
        username: localStorage.getItem('userName')
      }).then(res => {
        if (res.data.retCode === 1) {
          this.alarms = res.data.msg.reverse()
          this.start = new Array(this.alarms.length).fill(false)
        } else {
          this.snackbar = true
          this.msg = res.data.msg
          setTimeout(() => {
            this.snackbar = false
          }, 2000)
        }
      })
    },
    open () {
      this.getLines()
    },
    close () {
      document.getElementById('add').style.display = 'none'
    },
    // 获取站点名称
    getLines () {
      this.lines = {}
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
            this.lines[linename] = []
            line.st.forEach(stat => {
              this.lines[linename].push(stat.n)
            })
          })
          this.stationSlots = [
            {
              width: '50%',
              textAlign: 'left',
              values: Object.keys(this.lines)
            },
            {
              width: '50%',
              textAlign: 'left',
              values: this.lines[Object.keys(this.lines)[0]]
            }
          ]
          this.stations = [
            Object.keys(this.lines)[0],
            this.lines[Object.keys(this.lines)[0]][0].split(':')[0]
          ]
          this.stationLine = this.stations[0]
          this.stationName = this.stations[1]
          document.getElementById('add').style.display = 'block'
        })
    },
    // 选择站点
    stationChange (value, index) {
      switch (index) {
        case 0:
          this.stationLine = value
          let arr = this.lines[value]
          this.stationSlots[1].values = arr
          this.stationName = arr[0]
          break
        case 1:
          this.stationName = value
          break
      }
      this.stations = [this.stationLine, this.stationName]
    },
    // 添加提醒
    addAlarm () {
      let v = this.type === 'stat' ? this.stationName : this.time
      axios.post('user/addalarm', {
        username: localStorage.getItem('userName'),
        type: this.type,
        value: v
      }).then(res => {
        if (res.data.retCode === 1) {
          this.close()
          this.getAlarms()
        } else {
          this.snackbar = true
          this.msg = res.data.msg
          setTimeout(() => {
            this.snackbar = false
          }, 2000)
        }
      })
    },
    // 启动提醒
    startAlarm (index, alarm) {
      this.start[index] = !this.start[index]
      if (this.start[index]) {
        // 提醒
      }
    }
  }

}
</script>

<style lang="less" scoped>
.box {
  .action {
    text-align: right;
    padding: 20px 2%;
  }
  .list {
    margin: 10px 0;
  }
  .addBox {
    display: none;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #ffffff;
    z-index: 2018;
    .radioBox {
      margin: 30px 0;
    }
  }
}
</style>

