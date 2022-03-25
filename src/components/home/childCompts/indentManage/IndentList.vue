<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "indentList"
}
</script>

<style scoped>
.el-header {
  background-color: red;
}

.el-aside {
  background-color: #b3b3b3;
}

.el-main {
  background-color: antiquewhite;
}
</style>
