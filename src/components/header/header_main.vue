<template>
  <div class="header">
    <mu-appbar>
      <mu-icon-button icon="menu" slot="left" @click="toggle(true)" />
      <mu-text-field v-if="title === '首页'" icon="search" class="appbar-search-field" slot="right" hintText="搜索站点" @focus="openBottomSheet" />
      <mu-flat-button v-if="title === '首页'" color="white" label="取消" slot="right" />
      <span v-if="title !== '首页'" class="title">{{title}}</span>
    </mu-appbar>
    <mu-drawer :open="open" :docked="docked" @close="toggle()">
      <mu-list @itemClick="docked ? '' : toggle()">
        <mu-list-item v-for="path in paths" :title="path.name" @click="go(path.name)" />
      </mu-list>
    </mu-drawer>
    <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
      <mu-list @itemClick="closeBottomSheet">
        <mu-picker :slots="stationSlots" :visible-item-count="5" @change="stationChange" :values="stations" />
      </mu-list>
    </mu-bottom-sheet>
  </div>
</template>

<script>
import StationList from '@/components/list/stationlist'
import { mapState, mapGetters } from 'vuex'
import axios from 'axios'

export default {
  data() {
    return {
      open: false,
      docked: true,
      paths: this.$router.options.routes[0].children,
      hasTitie: false,

      // 弹出框数据
      bottomSheet: false,
      lines: {},
      stationSlots: [],
      stations: [],
      stationProvince: '',
      stationCity: ''
    }
  },

  mounted() {
    // 获取所有线路
  },

  computed: {
    ...mapState({
      // 标题
      title: 'headerTitle'
    })
  },

  methods: {
    // 打开侧边菜单
    toggle(flag) {
      this.open = !this.open
      this.docked = !flag
    },

    // 选择页面
    go(path) {
      this.$router.push({ name: path })
      // 更改标题
      this.$store.commit('setHeaderTitle', this.$route.name)
    },

    // 底部关闭选择线路
    closeBottomSheet() {
      this.bottomSheet = false
    },

    // 底部弹出选择线路
    openBottomSheet() {
      // 获取所有线路
      axios
        .post('http://127.0.0.1:3000', {
          code: this.$store.state.currentCityInfo.code,
          city: this.$store.state.currentCityInfo.city
        })
        .then(res => {
          let linelist = res.data.data.l
          console.log(res.data.data.l)
          linelist.forEach(line => {
            // 渲染数据
            let linename = (line.ln + ' ' + line.la).trim()
            this.lines[linename] = []
            line.st.forEach(stat => {
              this.lines[linename].push(stat.n)
            })
          })
          console.log(this.lines)
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
          this.stationProvince = '北京'
          this.stationCity = '北京'

          this.bottomSheet = true
        })
      // 渲染数据
    },

    // 选择站点
    stationChange(value, index) {
      switch (index) {
        case 0:
          this.stationProvince = value
          const arr = this.lines[value]
          this.stationSlots[1].values = arr
          this.stationCity = arr[0]
          break
        case 1:
          this.stationCity = value
          break
      }
      this.stations = [this.stationProvince, this.stationCity]
    }
  }
}
</script>

<style lang="less" scoped>
.appbar-search-field {
  color: #fff;
  margin-bottom: 0;
  width: 80%;
  under &.focus-state {
    color: #fff;
  }
  .mu-text-field-hint {
    color: fade(#fff, 54%);
  }
  .mu-text-field-input {
    color: #fff;
  }
  .mu-text-field-focus-line {
    background-color: #fff;
  }
}
.header {
  color: #fff;
  width: 100%;
  .mu-appbar {
    // position: absolute;
  }
  .title {
    color: #fff;
    font-size: 18px;
    display: block;
    text-align: center;
    margin-right: 48px;
  }
}
</style>