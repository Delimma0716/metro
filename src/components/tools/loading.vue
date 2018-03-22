<template>
  <div class="loadbox">
    <mu-circular-progress :size="60" />
    <p>正在加载，请稍后</p>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.loadbox {
  text-align: center;
  padding: 50% 0;
}
</style>
