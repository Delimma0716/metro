<template>
  <div class="login">
    <mu-paper class="paper" :zDepth="1" v-show="showLog">
      <mu-text-field hintText="用户名" v-model="name" /><br/>
      <mu-text-field type="password" hintText="密码" v-model="pwd" /><br/>
      <mu-raised-button label="登录" class="demo-raised-button" @click="login" />
      <mu-raised-button label="去注册" class="demo-raised-button" primary @click="change" />
    </mu-paper>
    <mu-paper class="paper" :zDepth="1" v-show="!showLog">
      <mu-text-field hintText="用户名" v-model="name" /><br/>
      <mu-text-field type="password" hintText="密码" v-model="pwd" /><br/>
      <mu-text-field type="password" hintText="再次输入密码" v-model="pwd2" /><br/>
      <mu-raised-button label="注册" class="demo-raised-button" @click="reg" />
      <mu-raised-button label="去登录" class="demo-raised-button" primary @click="change" />
    </mu-paper>
    <mu-dialog :open="dialog" @close="close">
      <span>{{hintmsg}}</span>
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
      pwd2: '',
      dialog: false,
      hintmsg: '',
      showLog: true
    }
  },
  methods: {
    // 清空数据
    clear () {
      this.name = ''
      this.pwd = ''
      this.pwd2 = ''
      this.hintmsg = ''
    },
    // 登录
    login () {
      if (this.name === '' || this.pwd === '') {
        this.hintmsg = '用户名或密码未填写完整'
        this.open()
      } else {

      }
    },
    // 注册
    reg () {
      if (this.name && this.pwd) {
        if (this.pwd !== this.pwd2) {
          this.hintmsg = '两次密码不一致'
          this.open()
        } else {

        }
      } else {
        this.hintmsg = '用户名或密码未填写完整'
        this.open()
      }
    },
    change () {
      this.clear()
      this.showLog = !this.showLog
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
  .paper {
    width: 80%;
    margin: 0 auto;
    margin-top: 10%;
    padding: 20px;
  }
}
.alert {
  text-align: center;
}
</style>
