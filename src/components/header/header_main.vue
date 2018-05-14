<template>
  <div class="header">
    <!-- 搜索栏 -->
    <mu-appbar>
      <mu-icon-button v-if="isSub" icon="keyboard_arrow_left" slot="left" @click="back" />
      <mu-icon-button v-else icon="menu" slot="left" @click="toggle(true)" />
      <mu-text-field v-if="title === '首页'" inputClass="white" class="appbar-search-field" slot="right" hintText="所有站点" @focus="openBottomSheet" v-model="stationName" />
      <mu-flat-button v-if="title === '首页'" icon="search" color="white" label="搜索" slot="right" :to="stationName === '' ? '/linelist' : 'stationdetail/'+stationCode+'/'+stationName" />
      <span v-if="title !== '首页'" class="title">{{title}}</span>
    </mu-appbar>
    <!-- 侧边菜单 -->
    <mu-drawer :open="open" :docked="docked" @show="getUserName" @close="toggle()">
      <mu-list @itemClick="docked ? '' : toggle()">
        <mu-list-item :title="userName===null?'登录':userName" @click="login">
          <mu-avatar src="@/assets/images/logo.jpg" slot="leftAvatar" />
        </mu-list-item>
        <mu-list-item v-for="path in paths" :title="path.name" @click="go(path.name)" />
      </mu-list>
    </mu-drawer>
    <!-- 选择站点 -->
    <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
      <!-- 标签 -->
      <div class="chipBox">
        <mu-chip class="chip" :to="'stationdetail/'+ addrs['家']">
          <mu-avatar :size="28" icon="home" /> 家
        </mu-chip>
        <mu-chip class="chip" :to="'stationdetail/'+ addrs['公司']">
          <mu-avatar :size="28" icon="business_center" /> 公司
        </mu-chip>
        <mu-chip class="chip" :to="'stationdetail/'+ addrs['学校']">
          <mu-avatar :size="28" icon="school" /> 学校
        </mu-chip>
      </div>
      <mu-picker :slots="stationSlots" :visible-item-count="5" @change="stationChange" :values="stations" />
    </mu-bottom-sheet>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  props: ['isSub'],
  data () {
    return {
      open: false,
      docked: true,
      paths: this.$router.options.routes[0].children.slice(0, 6),
      hasTitie: false,
      userName: '',
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

  mounted () {
  },

  computed: {
    ...mapState({
      // 标题
      title: 'headerTitle'
    })
  },

  methods: {
    // 打开侧边菜单
    toggle (flag) {
      this.open = !this.open
      this.docked = !flag
    },
    // 获取用户名
    getUserName () {
      this.userName = localStorage.getItem('userName')
    },
    // 选择页面
    go (path) {
      this.$router.push({ name: path })
    },

    // 返回上一页面
    back () {
      this.$router.go(-1)
    },

    // 底部弹出选择线路
    openBottomSheet () {
      this.getAddrs()
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
          // console.log(this.statMapping)
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
    },

    // 登录
    login () {
      // 已登录则进入用户中心
      if (this.userName) {
        this.$router.push('settings/user')
      } else {
        this.$router.push('login')
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
    }
  }
}
</script>

<style lang="less" scoped>
.appbar-search-field {
  margin-bottom: 0;
  width: 80%;
}

.header {
  color: #fff;
  width: 100%;
  .title {
    color: #fff;
    font-size: 18px;
    display: block;
    text-align: center;
    margin-right: 48px;
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
