<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-main>
      <el-card>
        <!--权限列表-->
        <el-table
          :data="rightsList"
          border
          stripe
          style="width: 100%;">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column
            prop="authName"
            label="权限名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="path"
            label="路径"
            align="center">
          </el-table-column>
          <el-table-column
            prop="level"
            label="权限等级"
            align="center"
            show-overflow-tooltip>
            <template v-slot="scope">
              <el-tag v-if="scope.row.level === '0'">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
              <el-tag type="warning" v-else-if="scope.row.level === '2'">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
        
      </el-card>
    </el-main>
  </div>
</template>

<script>
export default {
  name: "PowerList",
  data() {
    return {
      // 所有权限数据
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 发起获取权限的数据
    async getRightsList() {
      await this.$http.get('rights/list').then(res => {
        console.log(res)
        const result = res.data
        if (result.meta.status !== 200) {
          return this.$message.error(result.meta.msg)
        }
        console.log(result)
        this.$message.success(result.meta.msg)
        this.rightsList = result.data
      })
    }
  }
}
</script>

<style scoped>

</style>
