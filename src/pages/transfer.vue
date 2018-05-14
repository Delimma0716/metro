<template>
  <div class="transfer-box">
    <mu-text-field hintText="选择起点" fullWidth @focus="openBottomSheet(1)" v-model="startName" />
    <mu-icon class="icon" value="swap_vert" :size="36" />
    <mu-text-field hintText="选择终点" fullWidth @focus="openBottomSheet(2)" v-model="endName" />
    <!-- 选择站点 -->
    <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
      <!-- 标签 -->
      <div class="chipBox">
        <mu-chip class="chip" v-if="addrs['家']" @click="setAddr(addrs['家'])">
          <mu-avatar :size="28" icon="home" /> 家
        </mu-chip>
        <mu-chip class="chip" v-if="addrs['公司']" @click="setAddr(addrs['公司'])">
          <mu-avatar :size="28" icon="business_center" /> 公司
        </mu-chip>
        <mu-chip class="chip" v-if="addrs['学校']" @click="setAddr(addrs['学校'])">
          <mu-avatar :size="28" icon="school" /> 学校
        </mu-chip>
      </div>
      <mu-picker :slots="stationSlots" :visible-item-count="5" @change="stationChange" :values="stations" />
    </mu-bottom-sheet>

    <mu-raised-button label="确定" class="button-confirm" primary fullWidth @click="confirm" />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      startName: '',
      endName: '',
      startCode: '',
      endCode: '',
      tag: '',
      // 弹出框数据
      bottomSheet: false,
      lines: {},
      stationSlots: [],
      stations: [],
      stationLine: '',
      stationName: '',
      // 对应的站点中文和编码
      statMapping: {},
      stationCode: '',
      addrs: {
        '家': '',
        '公司': '',
        '学校': ''
      },
      addr: ''
    }
  },
  methods: {
    // 底部弹出选择线路
    openBottomSheet (tag) {
      this.getAddrs()
      this.tag = tag
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
            this.statMapping[linename] = []
            line.st.forEach(stat => {
              // 同时需要名称和编码，以冒号分隔
              this.lines[linename].push(stat.n)
              this.statMapping[linename].push({ statName: stat.n, statCode: stat.si })
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
            this.lines[Object.keys(this.lines)[0]][0].split(':')[0]
          ]
          this.stationLine = this.stations[0]
          this.stationName = this.stations[1]
          this.stationCode = this.statMapping[this.stationLine][0].statCode
          this.bottomSheet = true
          if (tag === 1) {
            this.startName = this.stationName
            this.$store.commit('setStartCode', this.stationName)
          } else {
            this.endName = this.stationName
            this.$store.commit('setEndCode', this.stationName)
          }
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
      // 拿到对应的code
      this.statMapping[this.stationLine].forEach(e => {
        if (e.statName === this.stationName) {
          this.stationCode = e.statCode
        }
      })
      this.stations = [this.stationLine, this.stationName]
      if (this.tag === 1) {
        this.startName = this.stationName
        this.$store.commit('setStartCode', this.stationName)
      } else {
        this.endName = this.stationName
        this.$store.commit('setEndCode', this.stationName)
      }
    },
    // 确定规划路线
    confirm () {
      if (this.$store.state.startCode !== '' && this.$store.state.endCode !== '') {
        this.$router.push('/metromap')
      }
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
    // 点击常用地址
    setAddr (addr) {
      this.closeBottomSheet()
      let sn = addr.split(',')[0]
      // let sc = addr.split(',')[1]
      if (this.tag === 1) {
        this.startName = sn
        this.$store.commit('setStartCode', this.startName)
      } else {
        this.endName = sn
        this.$store.commit('setEndCode', this.endName)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.transfer-box {
  padding: 36px 5%;
  .icon {
    margin: 0 auto;
    display: block;
  }
  .button-confirm {
    margin-top: 20px;
  }
}

.mu-bottom-sheet {
  .chipBox {
    padding: 20px 0 5% 5%;
  }
  .chip {
    margin-right: 5%;
  }
}
</style>
