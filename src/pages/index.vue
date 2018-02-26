// 包含sidebar header contentbox
<template>
  <div>
    <m-header></m-header>
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/header/header_main'
import SubHeader from '@/components/header/header_sub'
export default {
  mounted() {
    this.$router.push('metromap')
  },
  components: {
    'm-header': Header,
    'm-subheader': SubHeader
  }
}
</script>
