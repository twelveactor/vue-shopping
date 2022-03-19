<template>
  <div class="home_box">
    <h1>Welcome to Home</h1>

    <el-button type="info" @click="btnHomeOut">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    // 退出
    btnHomeOut() {
      window.sessionStorage.removeItem('token')
      // 清除之后要重定向一下页面
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.home_box {

}
</style>
