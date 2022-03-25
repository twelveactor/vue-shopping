<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片-->
    <el-card>
      <!--栅格系统，排列方式 和 搜索框-->
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addRoleUserButton = true">添加用户</el-button>
          </div>
        </el-col>
      </el-row>

      <!--用户列表-->
      <el-table :data="roleList"
                border
                stripe
                highlight-current-row>
        <!--展开列-->
        <el-table-column type="expand">
          <template v-slot="scope">
            <!--通过三元表达式，判断当前下标元素是否是0，如果是第一个元素加一个 top border-->
            <el-row v-for="(itemRow,index) in scope.row.children"
                    :key="itemRow.id"
                    :class="['bdbotton',index === 0 ?'bdtop':'','vcerter']">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable
                        @close="tagCloseById(scope.row,itemRow.id)">{{ itemRow.authName }}
                </el-tag>
                <i class="el-icon-caret-right"/>
              </el-col>

              <!--渲染二级和三级权限权限-->
              <el-col :span="19">
                <el-row v-for="(itemRow2,index) in itemRow.children" :key="itemRow2.id" :class="['vcerter']">
                  <el-col :span="6">
                    <el-tag type="success"
                            closable
                            @close="tagCloseById(scope.row,itemRow2.id)">{{ itemRow2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"/>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning"
                            v-for="(item,index) in itemRow2.children"
                            :key="item.id"
                            closable
                            @close="tagCloseById(scope.row,item.id)">
                      {{ item.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center">
          <!--使用作用域插槽对当前行状态进行改变,通过插槽名称获取当前一行作用域里面的数据-->
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary"
                         icon="el-icon-edit"
                         circle size="small"
                         @click="editRoleBtn(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改权限" placement="top" :enterable="false">
              <el-button type="warning"
                         icon="el-icon-setting"
                         circle size="small"
                         @click="showSetRightDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle size="small"
                         @click="deleteRoleBtn(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--添加角色的对话框-->
    <!--需要设置visible属性，它接收Boolean，当为true时显示 Dialog。-->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleUserButton"
      width="50%"
      @close="roleClose">

      <el-form :model="addRoleUser"
               ref="ruleFormRole"
               label-width="100px"
               :rules="addFormRoleRules">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="addRoleUser.roleName"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleUser.roleDesc"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
        </el-form-item>
      </el-form>

      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addRoleUserButton = false">取 消</el-button>
    <el-button type="primary" @click="addRoleUserClick">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑角色对话框-->
    <el-dialog
      title="编辑角色"
      :visible.sync="updateRoleButton"
      width="50%"
      @close="editRoleClose">

      <el-form :model="addRoleUser"
               ref="editRuleFormRole"
               label-width="100px"
               :rules="addFormRoleRules">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="addRoleUser.roleName"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleUser.roleDesc"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
        </el-form-item>
      </el-form>

      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="updateRoleButton = false">取 消</el-button>
    <el-button type="primary" @click="updataRoleUserClick">确 定</el-button>
      </span>
    </el-dialog>
    <!--分配权限对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="showRightDialog"
      width="50%"
      @close="roleRightClose">
      <!--树形控件-->
      <el-tree :data="rightTreeList"
               :props="treeProps"
               show-checkbox
               node-key="id"
               :default-expand-all="true"
               :default-checked-keys="defKeys"
               ref="treeRef"></el-tree>
      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="showRightDialog = false">取 消</el-button>
    <el-button type="primary" @click="allRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "RoleList",
  data() {
    return {
      roleList: [],
      // 添加角色框
      addRoleUserButton: false,
      // 编辑角色框
      updateRoleButton: false,
      // 分配权限框
      showRightDialog: false,
      // 页面权限列表
      addRoleUser: {},
      // 权限编辑列表tree
      rightTreeList: [],
      // 勾选该角色本来就有的默认权限
      defKeys: [],
      // 当前对话框即将分配角色的id
      roleId: '',
      // 树型控件属性绑定
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      addFormRoleRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
          {min: 1, max: 18, message: '长度在 1 到 18 个字符', trigger: 'blur'}
        ],
        roleDesc: [
          {required: true, message: '请输入角色描述', trigger: 'blur'},
          {min: 1, max: 18, message: '长度在 1 到 18 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      await this.$http.get('roles').then(result => {
          const {data: res} = result
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.roleList = res.data
          // console.log(res)
          // this.$message.success(res.meta.msg)
        }
      )
    },
    // 关闭添加重置表单
    roleClose() {
      this.$refs.ruleFormRole.resetFields()
    },
    // 关闭编辑重置表单
    editRoleClose() {
      this.$refs.editRuleFormRole.resetFields()
    },
    //  发送添加用户的请求
    async addRoleUserClick() {
      await this.$http.post('roles', this.addRoleUser).then(result => {
        const {data: res} = result
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.getRoleList()
        this.addRoleUserButton = false
      })
    },
    //  根据id删除角色
    async deleteRoleBtn(id) {
      await this.$confirm('此操作将永久删除该角色, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('roles/' + id).then(result => {
          const {data: res} = result
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // console.log(res)
          this.$message.success(res.meta.msg)
          // 刷新
          this.getRoleList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 点击编辑按钮弹出表单
    async editRoleBtn(id) {
      this.updateRoleButton = true
      await this.$http.get('roles/' + id).then(result => {
        const {data: res} = result
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.addRoleUser = res.data
        console.log(this.addRoleUser)
        // console.log(res)
      })
    },
    // 编辑提交
    updataRoleUserClick() {
      console.log(this.addRoleUser)
      this.$http.put('roles/' + this.addRoleUser.roleId, {
        roleName: this.addRoleUser.roleName,
        roleDesc: this.addRoleUser.roleDesc
      }).then(result => {
        const {data: res} = result
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        // 刷新和打印修改成功的通知
        this.$message.success(res.meta.msg)
        this.getRoleList()
        this.updateRoleButton = false
      })
    },
    // tag 权限标签删除
    async tagCloseById(role, tagId) {
      await this.$confirm('此操作将永久删除该权限, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`roles/${role.id}/rights/${tagId}`).then(result => {
          const {data: res} = result
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 删除成功，重新拉取数据
          this.$message.success(res.meta.msg)
          // this.getRoleList()
          // 不建议在重新拉取数据，建议直接再给权限赋新值

          role.children = res.data
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 显示分配权限的对话框
    showSetRightDialog(role) {
      this.showRightDialog = true
      //  拉取所有权限数据，并以树的形式显示
      this.$http.get('rights/tree').then(result => {
        const {data: res} = result
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.rightTreeList = res.data

        //  递归获取三级节点的id
        this.getLeafKeys(role, this.defKeys)
        this.roleId = role.id
      })
    },
    // 通过递归的形式，获取角色下所有三级权限的id,并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      //  判断，如果递归的数组中没有children属性说明就是最后一层的三级节点了
      if (!node.children) {
        return arr.push(node.id)
      }

      // 判断，没有children进行遍历，每循环一项获得一个item,在根据item遍历该数组是否有children
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 关闭清空tree树中存储的权限
    roleRightClose() {
      this.defKeys = []
    },
    // 确认按钮，对该角色想分配的权限的子节点和对应的父节点的数据进行获取
    async allRights() {
      // keys 临时存储目前被选中的节点的 key 所组成的数组 和 目前半选中的节点的 key 所组成的数组的id值
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      // 对keys数组存储的key值，通过 ， 号进行拼接
      const idStr = keys.join(',')
      // console.log(idStr)
      await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr}).then(result => {
        const {data: res} = result
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        // 刷新打印成功
        this.$message.success('权限添加成功')
        this.getRoleList()
      })
      this.showRightDialog = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin-bottom: 10px;
  margin-top: 10px;
  margin-right: 10px;
}

.vcerter {
  display: flex;
  align-items: center;
}

.bdtop {
  border-top: 1px solid #eee8d5;
}

.bdbotton {
  border-bottom: 1px solid #eee8d5;
}
</style>
