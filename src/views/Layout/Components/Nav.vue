<template>
  <div id="nav-wrap">
    左侧导航
  </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss">
@import '@/styles/config.scss';
#nav-wrap{
  position: fixed;
  top: 0;
  left: 0;
  width: $navMenu;
  height: 100vh;
  background-color: #344a5f;
}
</style>