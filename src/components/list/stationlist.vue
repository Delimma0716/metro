<template>
  <mu-list class="slist">
    <mu-list-item v-for="line in lines" :title="line.name" toggleNested>
      <mu-icon slot="left" value="inbox" />
      <mu-list-item slot="nested" title="Starred">
        <mu-icon slot="left" value="grade" />
      </mu-list-item>
    </mu-list-item>
  </mu-list>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>

</style>
