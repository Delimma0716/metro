<template>
    <div class="box">
        <div class="list" v-if="isLog">
            <mu-list>
                <mu-divider />
                <mu-list-item title="个人中心" to="settings/user">
                    <mu-icon slot="right" value="keyboard_arrow_right" />
                </mu-list-item>
                <mu-divider />
            </mu-list>
        </div>
        <div class="list">
            <mu-list>
                <mu-divider />
                <mu-list-item title="语言设置">
                    <mu-icon slot="right" value="keyboard_arrow_right" />
                </mu-list-item>
                <mu-divider />
                <mu-list-item title="意见反馈">
                    <mu-icon slot="right" value="keyboard_arrow_right" />
                </mu-list-item>
                <mu-divider />
                <mu-list-item title="清除缓存">
                    <mu-icon slot="right" value="keyboard_arrow_right" />
                </mu-list-item>
                <mu-divider />
            </mu-list>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      isLog: false
    }
  },
  mounted () {
    if (localStorage.getItem('userName')) {
      this.isLog = true
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  .list {
    margin-top: 30px;
  }
}
</style>
