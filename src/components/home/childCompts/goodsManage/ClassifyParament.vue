<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片-->
    <el-card>
      <!--Alert 警告-->
      <el-alert title="注意:只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>

      <!--Cascader 级联选择器-->
      <div class="block">
        <span>选择商品分类：</span>
        <!--:options为当前级联选择器的数据源-->
        <!--Props 为配置选项-->
        <el-cascader
          expandTrigger="hover"
          v-model="selectClassifyKeys"
          :options="ParentClassifyList"
          :props="cascaderProps"
          @change="parentClassifyChange"
          clearable></el-cascader>
      </div>

      <!--Tabs 标签页-->
      <template>
        <el-tabs v-model="activeName" @tab-click="handleTabsClick">
          <el-tab-pane label="动态参数" name="many">
            <!--添加参数按钮-->
            <el-button type="primary" :disabled="isBtnDisabled" @click="addVisible=true">添加参数</el-button>

            <!--动态参数表单数据-->
            <el-table :data="manyORonlyData"
                      border
                      stripe
                      highlight-current-row>
              <!--展开列-->
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-tag
                    :key="index"
                    v-for="(item,index) in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(index,scope.row)">
                    {{ item }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column prop="attr_name" label="参数名称" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" align="center">
                <!--使用作用域插槽对当前行状态进行改变,通过插槽名称获取当前一行作用域里面的数据-->
                <template v-slot="scope">
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                    <el-button type="primary"
                               icon="el-icon-edit"
                               circle size="small" @click="editFormBtn(scope.row.attr_id)"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" circle size="small"
                               @click="deleteClassify(scope.row.attr_id)"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>

          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" :disabled="isBtnDisabled" @click="addVisible=true">添加属性</el-button>

            <!--静态参数表单数据-->
            <el-table :data="manyORonlyData"
                      border
                      stripe
                      highlight-current-row>
              <!--展开列-->
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-tag
                    :key="index"
                    v-for="(item,index) in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(index,scope.row)">
                    {{ item }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="序号" align="center"></el-table-column>
              <el-table-column prop="attr_name" label="属性名称" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" align="center">
                <!--使用作用域插槽对当前行状态进行改变,通过插槽名称获取当前一行作用域里面的数据-->
                <template v-slot="scope">
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                    <el-button type="primary"
                               icon="el-icon-edit"
                               circle size="small" @click="editFormBtn(scope.row.attr_id)"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" circle size="small"
                               @click="deleteClassify(scope.row.attr_id)"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>

    <!--Dialog对话框,添加动态参数和静态参数-->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addVisible"
      width="50%"
      @close="addFormClassifyClose">

      <el-form :model="addFormClassify"
               ref="addFormRef"
               label-width="100px"
               :rules="addFormClassifyRules">
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="addFormClassify.attr_name"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
        </el-form-item>
      </el-form>

      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addVisible = false">取 消</el-button>
    <el-button type="primary" @click="addFormClassifySub">确 定</el-button>
      </span>
    </el-dialog>
    <!--Dialog对话框,修改动态参数和静态参数-->
    <el-dialog
      :title="'编辑'+titleText"
      :visible.sync="editVisible"
      width="50%"
      @close="editFormClassifyClose">

      <el-form :model="editFormClassify"
               ref="editFormRef"
               label-width="100px"
               :rules="editFormClassifyRules">
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="editFormClassify.attr_name"
                    onkeyup="this.value=this.value.replace(/[, ]/g,'')"></el-input>
        </el-form-item>
      </el-form>

      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="editVisible = false">取 消</el-button>
    <el-button type="primary" @click="editFormClassifySub">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ClassifyParament",
  data() {
    return {
      // 级联选择器分类列表
      ParentClassifyList: [],
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
      selectClassifyKeys: [],
      //  Tabs 标签页绑定的对象页面
      activeName: 'many',
      // 动态数据存储
      manyTableData: [],
      // 静态数据存储
      onlyTableData: [],
      // 控制显示隐藏对话框
      addVisible: false,
      addFormClassifyRules: {
        attr_name: [
          {required: true, message: '请输入参数内容', trigger: 'blur'},
          {min: 1, max: 18, message: '长度在 1 到 18 个字符', trigger: 'blur'}
        ]
      },
      addFormClassify: {},
      editVisible: false,
      editFormClassify: {},
      editFormClassifyRules: {
        attr_name: [
          {required: true, message: '请输入参数内容', trigger: 'blur'},
          {min: 1, max: 18, message: '长度在 1 到 18 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getParentClassifyList()
  },
  methods: {
    async getParentClassifyList() {
      await this.$http.get('categories').then(result => {
        // console.log(result)
        const {data: res} = result
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类列表数据失败')
        }
        // console.log(res)
        this.ParentClassifyList = res.data
        console.log(this.ParentClassifyList)
      })
    },
    // 当级联标签绑定值变化时触发的事件
    parentClassifyChange() {
      this.getParamsDate()
    },
    // 当Tabs标签页改变的时候的事件操作
    handleTabsClick() {
      this.getParamsDate()
    },
    // 获取动态和静态参数的方法
    async getParamsDate() {
      // 判断，如果当前选中的不是第三级的分类，就把绑定的数据清空，让只能选择第三级
      if (this.selectClassifyKeys.length !== 3) {
        this.selectClassifyKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      console.log(this.selectClassifyKeys)
      //  根据所选分类id发起请求
      await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      }).then(result => {
        const {data: res} = result
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        // console.log(res.data)
        //获取展开列标签数据
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        console.log(res.data)
        // 判断是动态数据还是静态数据，分别存储
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      })
    },
    addFormClassifyClose() {
      this.$refs.addFormRef.resetFields()
    },
    editFormClassifyClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 确认按钮提交数据
    addFormClassifySub() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('清把内容填写完整')
        }
        this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addFormClassify.attr_name,
          attr_sel: this.activeName
        }).then(result => {
          const {data: res} = result
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success('添加成功')
          this.addVisible = false
          this.getParamsDate()
        })
      })
    },
    editFormClassifySub() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('清把内容填写完整')
        }
        this.$http.put(`categories/${this.cateId}/attributes/${this.editFormClassify.attr_id}`, {
          attr_name: this.editFormClassify.attr_name,
          attr_sel: this.activeName
        }).then(result => {
          const {data: res} = result
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success('更新成功')
          this.editVisible = false
          this.getParamsDate()
        })
      })
    },
    editFormBtn(id) {
      this.editVisible = true
      this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        attr_name: this.editFormClassify.attr_name,
        attr_sel: this.activeName
      }).then(result => {
        const {data: res} = result
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.editFormClassify = res.data

      })
    },
    deleteClassify(id) {
      this.$http.delete(`categories/${this.cateId}/attributes/${id}`).then(result => {
        const {data: res} = result
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('删除成功')
        this.getParamsDate()
      })
    },
    // 添加标签文本框失去焦点和enter确认之后的事件
    handleInputConfirm(row) {
      row.inputVisible = false
      // 当输入框中有数据时就向标签中添加新的数据
      if (row.inputValue.length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue)
      //  当内容已经添加，就需要重置这个输入框了
      row.inputValue = ''
      // 发起axios请求
      this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }).then(result => {
        const {data: res} = result
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('更新成功')
        // this.getParamsDate()
      })
    },
    // 点击添加标签文本按钮，展示输入框
    showInput(row) {
      row.inputVisible = true
      // 让文本获得焦点
      // $nextTick 方法的作用就是当页面元素重新渲染之后进行回调
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除标签
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.closeSaveAttrVals(row)
    },
    closeSaveAttrVals(row) {
      // 发起axios请求
      this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }).then(result => {
        const {data: res} = result
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('删除成功')
        // this.getParamsDate()
      })
    }
  },
  // 计算数属性
  computed: {
    // 用于计算控制按钮显示与禁用
    isBtnDisabled() {
      if (this.selectClassifyKeys.length !== 3) {
        return true
      }
      return false
    },
    //  获取当前级联选择器当中的选中的分类id
    cateId() {
      if (this.selectClassifyKeys.length === 3) {
        // 返回数组最后一个值
        return this.selectClassifyKeys[this.selectClassifyKeys.length - 1]
      }
      return null
    },
    // 动态对话框标题
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
    //  渲染表格，判断是静态数据还是动态数据,返回对应的数据
    manyORonlyData() {
      if (this.activeName === 'many') {
        return this.manyTableData
      } else {
        return this.onlyTableData
      }
    }
  }
}
</script>

<style lang="less" scoped>
.block {
  margin-top: 20px;

  .el-cascader {
    width: 50%;
  }
}

.el-tabs {
  margin-top: 20px;
}

.el-tag {
  margin: 0px 10px;
}

.el-input {
  width: 100px !important;
}
</style>
