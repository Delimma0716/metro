<template>
  <div class="header">
    <mu-appbar>
      <mu-icon-button icon="menu" slot="left" @click="toggle(true)" />
      <mu-text-field icon="search" class="appbar-search-field" slot="right" hintText="搜索站点" />
      <mu-flat-button color="white" label="取消" slot="right" />
    </mu-appbar>
    <mu-drawer :open="open" :docked="docked" @close="toggle()">
      <mu-list @itemClick="docked ? '' : toggle()">
        <mu-list-item v-for="path in paths" :title="path.name" @click="go(path.name)" />
      </mu-list>
    </mu-drawer>
    <!-- <m-list></m-list> -->
  </div>
</template>

<script>
import StationList from '@/components/list/stationlist'
export default {
  data () {
    return {
      open: false,
      docked: true,
      paths: this.$router.options.routes[0].children
    }
  },
  mounted () {
    // console.log(this.paths)
  },
  methods: {
    toggle (flag) {
      this.open = !this.open
      this.docked = !flag
    },
    go (path) {
      this.$router.push({ name: path })
    }
  },
  components: {
    // 'm-list': StationListstate
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
}
</style>
