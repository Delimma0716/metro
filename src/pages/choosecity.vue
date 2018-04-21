<template>
  <div class="clist">
    <mu-list @itemClick="choose">
      <mu-list-item v-for="city in cities" :title="city[1].name" :value="city[0]" :describeText="city[1].city" class="clist-item">
        <mu-icon v-if="city[0]===$store.state.currentCityInfo.code" slot="right" value="done" />
      </mu-list-item>
    </mu-list>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  mounted() { },
  methods: {
    // 更改当前城市
    choose(item) {
      this.cityInfo.code = item.$options.propsData.value
      this.cityInfo.name = item.$options.propsData.title
      this.cityInfo.city = item.$options.propsData.describeText
      // 设置当前城市信息
      this.$store.commit('setCurrentCityInfo', this.cityInfo)
      // 返回首页
      this.$router.push('metromap')
    }
  },
  data() {
    return {
      cityInfo: {
        code: '',
        name: '',
        city: ''
      }
    }
  },
  computed: mapGetters({
    // 获取所有地铁城市
    cities: 'getCities'
  })
}
</script>

<style lang="less" scoped>
.clist {
  position: absolute;
  top: 56px;
  padding: 0 10px;
  width: 100%;
  .clist-item {
    border-bottom: 1px solid #eeeeee;
  }
}
</style>
