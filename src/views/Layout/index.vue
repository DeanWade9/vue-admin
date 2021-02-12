<template>
  <div>
    <layout-header/>
    <LayoutNav/>
    <LayoutMain/>
  </div>
</template>
<script>
import LayoutHeader from './Components/Header'
import LayoutNav from './Components/Nav'
import LayoutMain from './Components/Main'
export default {
  name: 'layout',
  components: {
    LayoutHeader,
    LayoutNav,
    LayoutMain
  },
  setup() {

  }
}
</script>
<style lang="scss">
</style>