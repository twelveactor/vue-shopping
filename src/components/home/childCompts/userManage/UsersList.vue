<!--用户列表栏目-->
<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card>
      <!--栅格系统，排列方式 和 搜索框-->
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入用户名/ID" class="input-with-select">
              <el-button slot="append" icon="el-icon-search">查询</el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="primary">添加用户</el-button>
          </div>
        </el-col>
      </el-row>
      <h1>User List Component</h1>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "UsersList",
  data() {
    return {
      UserInfo: {
        query: null,
        pagenum: 2,
        pagesize: 10
      }
    }
  },
  created() {
    //  组件创建就拉取用户数据
    this.getUserList()
  },
  methods: {
    /**
     * @description 拉取用户数据
     */
    async getUserList() {
      const {data: res} = await this.$http.get('users', {
          params: this.UserInfo
        }
      )
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
