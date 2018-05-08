<template>
  <div class="box">
    <div class="list">
      <mu-list>
        <mu-divider />
        <mu-list-item title="常用地址">
          <mu-icon slot="right" value="keyboard_arrow_right" />
        </mu-list-item>
        <mu-divider />
      </mu-list>
    </div>
    <mu-raised-button label="退出" fullWidth primary @click="logout" />
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
.box {
  .list {
    margin: 30px 0;
  }
}
</style>
