<template>
  <div id="main-wrap">
    内容aaaa
    <router-view></router-view>
  </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss">
@import '@/styles/config.scss';
#main-wrap {
  position: fixed;
  left: $navMenu;
  top: 75px;
  right: 0;
  bottom: 0;
  -webkit-box-sizing: border-box;
  border: 30px solid #f7f7f7;
  border-bottom: none;
  background-color: #fff;
}
</style>