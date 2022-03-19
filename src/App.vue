<template>
  <div id="app">
    <!--    路由占位符-->
    <RouterView></RouterView>
    <!--    <login/>-->
    <!--    <home/>-->
  </div>
</template>

<script>
import Login from "@/components/login/Login";
import Home from "@/components/home/Home";

export default {
  name: 'app',
  components: {
    Login,
    Home
  }
}
</script>

<style>
/*// 导入字体图标*/
@import 'assets/fonts/iconfont.css';
/*// 导入全局样式表*/
@import 'assets/css/global.css';

</style>
