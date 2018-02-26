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
        <mu-picker :slots="stationSlots" :visible-item-count="5" @change="stationChange" :values="station" />
      </mu-list>
    </mu-bottom-sheet>
  </div>
</template>

<script>
import StationList from '@/components/list/stationlist'
import { mapState, mapGetters } from 'vuex'
const station = {
  北京: ['北京'],
  广东: [
    '广州',
    '深圳',
    '珠海',
    '汕头',
    '韶关',
    '佛山',
    '江门',
    '湛江',
    '茂名',
    '肇庆',
    '惠州',
    '梅州',
    '汕尾',
    '河源',
    '阳江',
    '清远',
    '东莞',
    '中山',
    '潮州',
    '揭阳',
    '云浮'
  ],
  上海: ['上海']
}
export default {
  data() {
    return {
      open: false,
      docked: true,
      paths: this.$router.options.routes[0].children,
      hasTitie: false,

      bottomSheet: false,
      stationSlots: [
        {
          width: '100%',
          textAlign: 'right',
          values: Object.keys(station)
        },
        {
          width: '100%',
          textAlign: 'left',
          values: ['北京']
        }
      ],
      station: ['北京', '北京'],
      stationProvince: '北京',
      stationCity: '北京'
    }
  },
  mounted() {
    // console.log(this.getLines)
  },
  computed: {
    ...mapState({
      // 标题
      title: 'headerTitle'
    }),
    ...mapGetters({
      // 获取所有线路
      lines: 'getLines'
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

    closeBottomSheet() {
      this.bottomSheet = false
    },
    // 底部弹出选择线路
    openBottomSheet() {
      this.bottomSheet = true
      console.log(this.lines)
      // this.station=this.getLines
    },
    stationChange(value, index) {
      switch (index) {
        case 0:
          this.stationProvince = value
          const arr = station[value]
          this.stationSlots[1].values = arr
          this.stationCity = arr[0]
          break
        case 1:
          this.stationCity = value
          break
      }
      this.station = [this.stationProvince, this.stationCity]
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