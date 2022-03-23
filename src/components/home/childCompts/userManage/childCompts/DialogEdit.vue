<!-- 遗留问题，这个独立弹窗表单数据无法存储的问题 -->
<template>
  <div>
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
  name: 'DialogEdit',
  // props: {
  //   User: Object,
  //   default() {
  //     return {
  //       username: '',
  //       mobile: '',
  //       email: ''
  //     }
  //   }
  // },
  data() {
    return {
      DialogEditUser: false,
      editUser: {
        username: '',
        mobile: '',
        email: ''
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
      },
    }
  },
  methods: {
    // 显示组件Dialog让父组件通过$refs来操作显示，不用父传子的方式了
    show() {
      this.DialogEditUser = true
    },
    CloseForm() {
      this.$refs.EditDialog.resetFields()
    },
    // 传递表单数据发射给父组件
    setEditClose() {
      console.log(this.editUser)
      console.log(this.User)

      // debugger
      // 发送表单数据之前先进行预验证数据
      this.$refs.EditDialog.validate((valid) => {
        // 判断数据是否合法，不为true就输出警示
        if (!valid) {
          return this.$message.error('*数据为必填项')
        }
        // 到这一步说明数据验证成功，发送给父组件,把要修改的数据对象传递给父组件
        this.$emit('EditChildren', this.editUser)

        //  关闭对话框
        this.DialogEditUser = false
      })
    },
  },
}
</script>

<style scoped></style>
