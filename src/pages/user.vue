<template>
    <div>
        <mu-raised-button label="退出" fullWidth default @click="logout" />
    </div>
</template>

<script>
export default {
  mounted () {
  },
  methods: {
    // 用户注销
    logout () {
      localStorage.removeItem('userName')
      this.$router.push('/')
      console.log(localStorage.getItem('userName'))
    }
  }
}
</script>
