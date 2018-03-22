<template>
  <div class="login">
    <mu-paper class="loginpaper" :zDepth="1">
      <mu-text-field hintText="用户名" v-model="name" /><br/>
      <mu-text-field type="password" hintText="密码" v-model="pwd" /><br/>
      <mu-raised-button label="登录" class="demo-raised-button" @click="login" />
      <mu-raised-button label="直接注册" class="demo-raised-button" primary @click="reg" />
    </mu-paper>
    <mu-dialog :open="dialog" @close="close">
      <span v-bind="hintmsg"></span>
      <mu-flat-button slot="actions" primary @click="close" label="确定" />
    </mu-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      pwd: '',
      dialog: false,
      hintmsg: []
    }
  },
  methods: {
    // 登录
    login () {
      console.log('dl')
    },
    // 注册
    reg () {
      if (this.name && this.pwd) {
        if (this.pwd.length < 6) {
          this.hintmsg = '密码不能小于6位'
          this.open()
        }
        console.log('zc')
      } else {
        this.hintmsg = '用户名或密码不能为空'
        this.open()
      }
    },
    open () {
      this.dialog = true
    },
    close () {
      this.dialog = false
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  .loginpaper {
    width: 80%;
    height: 200px;
    margin: 0 auto;
    margin-top: 10%;
    padding: 20px;
  }
}
.alert {
  text-align: center;
}
</style>
