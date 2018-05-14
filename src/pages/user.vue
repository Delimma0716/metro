<template>
  <div class="box">
    <div class="list">
      <mu-list @itemClick="setAddr">
        <mu-sub-header>常用地址</mu-sub-header>
        <mu-divider />
        <mu-list-item title="家">
          <span>{{addrs['家']}}</span>
          <mu-icon slot="left" value="home" />
          <mu-icon slot="right" value="keyboard_arrow_right" />
        </mu-list-item>
        <mu-divider />
        <mu-list-item title="公司">
          <span>{{addrs['公司']}}</span>
          <mu-icon slot="left" value="business_center" />
          <mu-icon slot="right" value="keyboard_arrow_right" />
        </mu-list-item>
        <mu-divider />
        <mu-list-item title="学校">
          <span>{{addrs['学校']}}</span>
          <mu-icon slot="left" value="school" />
          <mu-icon slot="right" value="keyboard_arrow_right" />
        </mu-list-item>
        <mu-divider />
      </mu-list>
    </div>
    <!-- 选择站点 -->
    <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
      <mu-picker :slots="stationSlots" :visible-item-count="5" @change="stationChange" :values="stations" />
    </mu-bottom-sheet>

    <mu-raised-button label="退出" fullWidth primary @click="logout" />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      userName: localStorage.getItem('userName'),
      addrs: {
        '家': '',
        '公司': '',
        '学校': ''
      },
      addr: '',
      // 弹出框数据
      bottomSheet: false,
      lines: {},
      stationSlots: [],
      stations: [],
      stationLine: '',
      stationName: ''
    }
  },
  mounted () {
    this.getAddrs()
  },
  methods: {
    // 用户注销
    logout () {
      localStorage.removeItem('userName')
      this.$router.push('/')
      console.log(localStorage.getItem('userName'))
    },
    // 设置常用地址
    setAddr (item) {
      this.addr = item.$options.propsData.title
      this.openBottomSheet(this.addr)
    },
    // 底部弹出选择线路
    openBottomSheet () {
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
              width: '100%',
              textAlign: 'left',
              values: Object.keys(this.lines)
            },
            {
              width: '100%',
              textAlign: 'left',
              values: this.lines[Object.keys(this.lines)[0]]
            }
          ]
          this.stations = [
            Object.keys(this.lines)[0],
            this.lines[Object.keys(this.lines)[0]][0]
          ]
          this.stationLine = this.stations[0]
          this.stationName = this.stations[1]
          this.bottomSheet = true
          this.addrs[this.addr] = this.stationName
          this.saveAddr(this.addr, this.stationName)
        })
    },

    // 底部关闭选择线路
    closeBottomSheet () {
      this.bottomSheet = false
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
      this.addrs[this.addr] = this.stationName
      this.saveAddr(this.addr, this.stationName)
    },
    // 获取常用地址
    getAddrs () {
      axios.post('/user/getaddrs', {
        username: localStorage.getItem('userName')
      }).then(res => {
        this.addrs['家'] = res.data.msg[0].userHome
        this.addrs['公司'] = res.data.msg[0].userCompany
        this.addrs['学校'] = res.data.msg[0].userSchool
      }).catch(err => {
        console.log(err)
      })
    },
    // 保存常用地址
    saveAddr (addr, stat) {
      axios.post('/user/setaddr', {
        username: localStorage.getItem('userName'),
        addr: addr,
        stat: stat
      }).then(res => {
        console.log(res.data)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  .list {
    margin: 30px 0;
  }
}
</style>
