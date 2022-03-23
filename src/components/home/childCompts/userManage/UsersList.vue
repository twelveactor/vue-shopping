<!--用户列表栏目-->
<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片-->
    <el-card>
      <!--栅格系统，排列方式 和 搜索框-->
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入用户名/ID"
                      class="input-with-select"
                      v-model="UserInfo.query"
                      clearable
                      @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList">查询</el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </div>
        </el-col>
      </el-row>

      <!--用户列表-->
      <el-table :data="userList"
                border
                stripe
                highlight-current-row>
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="create_time"
                         label="时间"
                         align="center"
                         show-overflow-tooltip>
          <template v-slot="scope">
            <span>{{ dateFormat(scope.row.create_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="role_name" label="角色" align="center"></el-table-column>
        <el-table-column prop="mobile" label="电话" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mg_state" label="状态" align="center">
          <!--使用作用域插槽对当前行状态进行改变,通过插槽名称获取当前一行作用域里面的数据-->
          <template v-slot="scope">
            <!--使用一个开关，通过开关绑定 插槽作用域中的 scope.row.mg_state 当前状态为true还是false-->
            <!--另外switch有一个事件绑定的公共，点击事件修改数据库-->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#989898"
              @change="userStatusChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <!--使用作用域插槽对当前行状态进行改变,通过插槽名称获取当前一行作用域里面的数据-->
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary"
                         icon="el-icon-edit"
                         circle size="small"
                         @click="DialogEditUser = true"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" circle size="small"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle size="small"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="UserInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="UserInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      
    </el-card>

    <!--添加用户的对话框-->
    <!--需要设置visible属性，它接收Boolean，当为true时显示 Dialog。-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose">

      <!--内容主体区-->
      <el-form :model="addForm"
               ref="ruleForm"
               label-width="70px"
               :rules="addFormRules">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="addForm.username"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
        </el-form-item>
      </el-form>

      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑按钮-->
    <el-dialog
      title="编辑用户"
      :visible.sync="DialogEditUser"
      width="50%"
      @close="CloseForm"
    >
      <!--内容主体区-->
      <el-form :model="editUser" :rules="FormRules" ref="EditDialog" label-width="100px" class="demo-ruleForm">

        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUser.username"></el-input>
        </el-form-item>

        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogEditUser = false">取 消</el-button>
        <el-button type="primary" @click="setEditClose">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>


export default {
  name: "UsersList",
  components: {},
  data() {
    return {
      UserInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 添加用户出现一个对话框
      addDialogVisible: false,
      DialogEditUser: false,
      // 编辑用户对话框弹窗的表单对象
      editUser: {
        username: '',
        mobile: '',
        email: ''
      },
      // 添加用户弹窗的表单对象
      addForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      // 表单验证规则
      addFormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 1, max: 18, message: '长度在 1 到 18 个字符', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ]
      },
      FormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur',
          },
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur'},
        ],
        email: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'],
          },
        ],
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
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      //  把数据保存
      this.userList = res.data.users

      this.total = res.data.total
    },
    // 监听 pagesize 每页显示条数
    handleSizeChange(newPageSize) {
      // 把当前显示的想显示的条数赋值参数
      this.UserInfo.pagesize = newPageSize
      // 重新拉取一页显示的数据
      this.getUserList()
    },
    // 监听当前页码变化
    handleCurrentChange(newPageNum) {
      // 把当前点击的页码赋值给需要拉取数据的页
      this.UserInfo.pagenum = newPageNum
      // 当前页改变，重新拉取数据
      this.getUserList()
    },
    /**
     * @description 改变状态修改数据库，回调返回一个新数据
     * @param {Object} UserInfo 携带的参数
     */
    async userStatusChange(UserInfo) {
      const {data: res} = await this.$http.put(`users/${UserInfo.id}/state/${UserInfo.mg_state}`)
      if (res.meta.status !== 200) {
        // 更新失败保持状态不变
        UserInfo.mg_state = !UserInfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      // console.log(res)
    },
    // 重置，关闭 添加用户 就重置表单
    addDialogClose() {
      this.$refs.ruleForm.resetFields()
    },
    // 重置，关闭 编辑用户 就重置表单
    CloseForm() {
      this.$refs.EditDialog.resetFields()
    },
    // 添加用户确认按钮表单数据预验证
    addUser() {
      // 获取表单实例
      this.$refs.ruleForm.validate(async valid => {
        // 判断是否合法
        if (!valid) {
          return this.$message.error('请把内容填写完整')
        }
        // 添加用户到数据库
        await this.$http.post('users', this.addForm).then(res => {
          const result = res.data
          if (result.meta.status !== 201) {
            return this.$message.error(result.meta.msg)
          }
          // console.log(result)
          this.$message.success('用户添加成功')
          this.addDialogVisible = false  // 用户添加成功就把弹窗关闭
          // 重新获取用户列表
          this.getUserList()
        })
      })
    },
    //  时间格式化
    dateFormat: function (rowTime) {
      // 时间戳时间毫秒改为秒需要*1000
      return this.$moment(rowTime * 1000).format("YYYY-MM-DD HH:mm:ss")
    },
    // 通过用this.$refs.（ref值） 获取到的是组件实例，可以使用组件的所有方法
    // EditDialog() {
    //   // 获取子组件的show方法，显示Dialog
    //   this.$refs.EditChildren.show()
    // },
    // 接受子组件传递过来的需要修改的表单数据
    // EditChildren(EditUser) {
    //   console.log(EditUser)
    // }
    setEditClose() {
      console.log(this.editUser)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
