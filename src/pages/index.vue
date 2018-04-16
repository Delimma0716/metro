<template>
  <div>
    <m-header :isSub="isSub"></m-header>
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/header/header_main'
import SubHeader from '@/components/header/header_sub'
export default {
  data () {
    return {
      isSub: false
    }
  },
  mounted () {
    this.setHeader()
  },
  components: {
    'm-header': Header,
    'm-subheader': SubHeader
  },
  watch: {
    $route: 'setHeader'
  },
  methods: {
    // 设置导航栏标题
    setHeader () {
      this.$store.commit('setHeaderTitle', this.$route.name)
      // 判断是否为二级标题
      this.isSub = this.$route.path.split('/').length > 2 ? true : false
    }
  }
}
</script>
