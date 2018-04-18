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
    <!-- 对话框 -->
    <mu-dialog :open="dialog" @close="close">
      <span>{{hintmsg}}</span>
      <mu-flat-button slot="actions" primary @click="close" label="确定" />
    </mu-dialog>
  </div>
</template>

<script>
import axios from 'axios'
// 加密模块
import crypto from 'crypto'

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
        // 密码md5加密
        let md5Pwd = crypto.createHash('md5').update(this.pwd).digest('hex')
        axios
          .post('/user/login', {
            username: this.name,
            password: md5Pwd
          })
          .then(response => {
            if (response.data.retCode === 1) {
              localStorage.setItem('userName', this.name)
              this.$router.push('/')
            } else {
              this.hintmsg = response.data.msg
              this.open()
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    // 注册
    reg () {
      if (this.name && this.pwd) {
        if (this.pwd !== this.pwd2) {
          this.hintmsg = '两次密码不一致'
          this.open()
        } else {
          // 密码md5加密
          let md5Pwd = crypto.createHash('md5').update(this.pwd).digest('hex')
          axios
            .post('/user/register', {
              username: this.name,
              password: md5Pwd
            })
            .then(response => {
              this.hintmsg = response.data.msg
              this.open()
              if (response.data.retCode === 1) {
                localStorage.setItem('userName', this.name)
                setTimeout(() => {
                  this.$router.push('/')
                }, 2000)
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      } else {
        this.hintmsg = '用户名或密码未填写完整'
        this.open()
      }
    },
    // 登录注册切换
    change () {
      this.clear()
      this.showLog = !this.showLog
    },
    // 对话框开关
    open () {
      this.dialog = true
    },
    close () {
      this.dialog = false
    },
    // 提示框开关
    showToast () {
      this.toast = true
      if (this.toastTimer) { clearTimeout(this.toastTimer) }
      this.toastTimer = setTimeout(() => { this.toast = false }, 2000)
    },
    hideToast () {
      this.toast = false
      if (this.toastTimer) { clearTimeout(this.toastTimer) }
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
