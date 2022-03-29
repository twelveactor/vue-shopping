<!--商品分类-->
<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片-->
    <el-card>
      <!--栅格系统，排列方式 和 搜索框-->
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addGoodsBoxbtn">添加用户</el-button>
          </div>
        </el-col>
      </el-row>

      <!--表格-->
      <tree-table :data="GoodsList"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  border
                  :show-row-hover="false"
                  show-index
                  class="tree-table">
        <!--是否有效-->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted === false"
             style="color: #90ee90;"></i>
          <i class="el-icon-error"
             v-else
             style="color: #ff0000;"></i>
        </template>
        <!--排序-->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <!--操作-->
        <template slot="ope" slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">-->
            <el-button type="primary"
                       icon="el-icon-edit"
                       circle size="small"
                       @click="editGoodsSub(scope.row,scope.row.cat_id)">
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" circle size="small"
                       @click="deleteGoodsSub(scope.row.cat_id)"></el-button>
          </el-tooltip>
        </template>
      </tree-table>

      <!--分页-->
      <el-pagination
        @size-change="GoodsSizeChange"
        @current-change="GoodsCurrentChange"
        :current-page="paging.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="paging.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--添加商品对话框-->
    <el-dialog
      title="添加商品"
      :visible.sync="addGoodsBox"
      width="50%"
      @close="addSubFormDialogClose">

      <el-form :model="addGoodsForm"
               ref="goodsFormRole"
               label-width="100px"
               :rules="addGoodsFormRules">
        <el-form-item label="商品名称"
                      prop="cat_name">
          <el-input v-model="addGoodsForm.cat_name"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="商品类别" prop="cat_level">
          <!--:options为当前级联选择器的数据源-->
          <!--Props 为配置选项-->
          <el-cascader
            expandTrigger="hover"
            v-model="selectKeys"
            :options="ParentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            change-on-select></el-cascader>
        </el-form-item>
      </el-form>

      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addGoodsBox = false">取 消</el-button>
    <el-button type="primary" @click="addGoodsFormSub">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑商品对话框-->
    <el-dialog
      title="编辑商品"
      :visible.sync="editGoodsBox"
      width="50%"
      @close="editSubFormDialogClose">

      <el-form :model="addGoodsForm"
               ref="editGoodsFormRef"
               label-width="100px"
               :rules="addGoodsFormRules">
        <el-form-item label="商品名称"
                      prop="cat_name">
          <el-input v-model="addGoodsForm.cat_name"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
        </el-form-item>

      </el-form>

      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="editGoodsBox = false">取 消</el-button>
    <el-button type="primary" @click="updateGoodsFormSub">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "GoodsClassify",
  data() {
    return {
      GoodsList: [],
      //  添加商品对话框
      addGoodsBox: false,
      // 编辑商品对话框
      editGoodsBox: false,
      addGoodsForm: {
        cat_id: '',
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      addGoodsFormRules: {
        cat_name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ]
      },
      // 请求body
      paging: {
        type: '',
        pagenum: 1,
        pagesize: 5
      },
      // 商品总数
      total: 0,
      // 树型控件属性绑定
      treeProps: {
        label: 'cat_name',
        children: 'children'
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          align: 'center',
          headerAlign: "center"
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isOk',
          align: 'center',
          headerAlign: "center"
        },
        {
          label: '排序',
          // 表示将当前列定义为模板
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order',
          align: 'center',
          headerAlign: "center"
        },
        {
          label: '操作',
          // 表示将当前列定义为模板
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'ope',
          align: 'center',
          headerAlign: "center"
        }
      ],
      // 父级分类列表
      ParentCateList: [],
      // 级联选择器的Props
      cascaderProps: {
        // 点击选择的名称
        label: 'cat_name',
        // 指定具体选择的值属性
        value: 'cat_id',
        // 父子嵌套
        children: 'children'
      },
      // 级联选择器双向绑定的数据存储
      selectKeys: []
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //  获取商品数据
    getGoodsList() {
      this.$http.get('categories', {
        params: this.paging
      }).then(result => {
        // console.log(result)
        const {data: res} = result
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类列表数据失败')
        }
        console.log(res)
        this.GoodsList = res.data.result
        // 给总数赋值
        this.total = res.data.total
      })
    },
    // 选择每页显示条数改变时会触发
    GoodsSizeChange(newSize) {
      this.paging.pagesize = newSize
      this.getGoodsList()
    },
    // 当前页改变时会触发
    GoodsCurrentChange(newNum) {
      this.paging.pagenum = newNum
      this.getGoodsList()
    },
    //  添加商品按钮
    addGoodsBoxbtn() {
      // 获取父级分类列表数据
      this.getParentCateList()
      this.addGoodsBox = true
    },
    // 添加商品确认提交按钮
    addGoodsFormSub() {
      this.$refs.goodsFormRole.validate(async valid => {
        // console.log(this.addGoodsForm)
        //  判断表单是否填写完，没有填写完整不能进行修改后端数据库
        if (!valid) {
          return this.$message.error('请把内容填写完整')
        }
        await this.$http.post('categories', this.addGoodsForm).then(result => {
          const {data: res} = result
          if (res.meta.status !== 201) {
            console.log(res)
            return this.$message.error(res.meta.msg)
          }
          console.log(res)
          this.$message.success('用户添加成功')
          this.addGoodsBox = false  // 用户添加成功就把弹窗关闭
          // 重新获取用户列表
          this.getGoodsList()
        })
      })
    },
    // 关闭重置数据
    addSubFormDialogClose() {
      this.$refs.goodsFormRole.resetFields()
      this.selectKeys = []
      this.addGoodsForm.cat_pid = 0
      this.addGoodsForm.cat_level = 0
    },
    //  获取父级分类的数据列表
    async getParentCateList() {
      await this.$http.get('categories', {
        params: {type: 2}
      }).then(result => {
        // console.log(result)
        const {data: res} = result
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类列表数据失败')
        }
        // console.log(res)
        this.ParentCateList = res.data
      })
    },
    // 级联选择器发生变化
    parentCateChange() {
      console.log(this.selectKeys)
      //  如果 selectKeys 数组长度 > 0 说明已经父级分类选择了一个类别，就需要把要添加的分类加入父级分类项中
      //  反之就说明没有选中任何父级，那他就是一级
      if (this.selectKeys.length > 0) {
        // 把表单中pid 替换为 选中的父级类别中的数组中的最后一个数字id
        this.addGoodsForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        //  为当前添加的商品等级赋值
        this.addGoodsForm.cat_level = this.selectKeys.length
        return
      } else {
        //  反之不为0添加的商品本身就是一级
        this.addGoodsForm.cat_pid = 0
        //  为当前添加的商品等级赋值
        this.addGoodsForm.cat_level = 0
      }
    },
    // 编辑按钮
    editGoodsSub(row, id) {
      this.editGoodsBox = true
      this.$http.get('categories/' + id).then(result => {
        const {data: res} = result
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        // console.log(res)
        this.addGoodsForm.cat_id = id
        this.addGoodsForm.cat_name = row.cat_name
      })
    },
    // 关闭编辑对话框
    editSubFormDialogClose() {
      this.$refs.editGoodsFormRef.resetFields()
    },
    // 确认编辑对话框按钮
    updateGoodsFormSub() {
      this.$refs.editGoodsFormRef.validate(async valid => {
        // console.log(this.addGoodsForm)
        //  判断表单是否填写完，没有填写完整不能进行修改后端数据库
        if (!valid) {
          return this.$message.error('内容不为空')
        }
        await this.$http.put('categories/' + this.addGoodsForm.cat_id, {cat_name: this.addGoodsForm.cat_name}).then(result => {
          const {data: res} = result
          if (res.meta.status !== 200) {
            // console.log(res)
            return this.$message.error(res.meta.msg)
          }
          console.log(res)
          this.$message.success('商品名称更新成功')
          this.editGoodsBox = false  // 用户添加成功就把弹窗关闭
          // 重新获取用户列表
          this.getGoodsList()
        })
      })
    },
    // 删除按钮
    async deleteGoodsSub(id) {
      await this.$confirm('此操作将永久删除该用户, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('categories/' + id).then(result => {
          const {data: res} = result
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success('商品名称删除成功')
          // 重新获取用户列表
          this.getGoodsList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style lang="less" scoped>

.tree-table {
  margin-top: 20px;
}

.el-cascader {
  width: 100%;
}

.el-tag {
  margin: 10px 10px;
}
</style>
