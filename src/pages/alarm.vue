<template>
  <div class="box">
    <div class="action">
      <mu-raised-button icon="add" mini class="demo-float-button" label="添加提醒" @click="open" />
    </div>
    <mu-list class="list">
      <mu-divider />
      <mu-list-item disableRipple @click="handleToggle('events')" title="事件和提醒">
        <mu-switch v-model="events" slot="right" />
      </mu-list-item>
      <mu-divider />
      <mu-list-item disableRipple @click="handleToggle('calls')" title="电话">
        <mu-switch v-model="calls" slot="right" />
      </mu-list-item>
      <mu-divider />
      <mu-list-item disableRipple @click="handleToggle('messages')" title="信息">
        <mu-switch v-model="messages" slot="right" />
      </mu-list-item>
      <mu-divider />
    </mu-list>

    <div class="addBox" id="add">
      <mu-appbar>
        <mu-flat-button slot="left" label="取消" color="white" @click="close" />
        <div style="text-align:center;font-size:18px;">添加提醒</div>
        <mu-flat-button slot="right" label="确定" color="white" />
      </mu-appbar>
      <mu-content-block>
        <div class="radioBox">
          <mu-radio label="按站点" name="group" v-model="radioValue[0]" uncheckIcon="radio_button_unchecked" checkedIcon="radio_button_checked" /> <br/>
          <mu-picker :slots="stationSlots" :visible-item-count="5" @change="stationChange" :values="stations" />
        </div>
        <div class="radioBox">
          <mu-radio label="按时间" name="group" v-model="radioValue[1]" class="demo-radio" uncheckIcon="radio_button_unchecked" checkedIcon="radio_button_checked" /> <br/>
          <mu-time-picker hintText="选择时间" v-model="time" /><br/>
        </div>
      </mu-content-block>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  data () {
    return {
      popup: false,
      radioValue: ['stat', 'time'],
      time: '',
      lines: {},
      stationSlots: [],
      stations: [],
      stationLine: '',
      stationName: '',
    }
  },
  mounted () {
  },
  methods: {
    open () {
      this.getLines()
    },
    close () {
      document.getElementById('add').style.display = 'none'
    },
    // 站点名称
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
    .radioBox{
      margin: 30px 0;
    }
  }
}
</style>

