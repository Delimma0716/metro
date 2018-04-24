<template>
  <div>
    <h1>{{userName}}</h1>
    <mu-raised-button label="退出" fullWidth secondary @click="logout" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      userName: localStorage.getItem('userName')
    }
  },
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

<style lang="less" scoped>
h1{
  text-align: center;
  margin-bottom: 500px;
}
</style>
