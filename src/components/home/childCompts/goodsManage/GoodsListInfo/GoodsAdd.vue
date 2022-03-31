<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片-->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false">
      </el-alert>
      <!--步骤条-->
      <el-steps :active="activeIndex - 0" finish-status="success" style="margin-top: 30px;" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!--Tabs 标签页-->
      <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsForm" label-width="100px"
               class="demo-ruleForm" label-position="top">
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClick">
          <!--基本信息-->
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!--:options为当前级联选择器的数据源-->
              <!--Props 为配置选项-->
              <el-cascader
                expandTrigger="hover"
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="cateChange"
                clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数">
            <!--渲染表单的item项-->
            <el-form-item v-for="item in manyTabData" :label="item.attr_name" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <!--渲染表单的item项-->
            <el-form-item v-for="item in onlyTabData" :label="item.attr_name" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <!--action 表示图片要上传的api地址-->
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <!-- bidirectional data binding（双向数据绑定） -->
            <quill-editor v-model="addGoodsForm.goods_introduce"
                          ref="myQuillEditor">
            </quill-editor>
            <el-button type="primary" style="margin-top: 10px;" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!--上传图片预览对话框-->
    <el-dialog
      title="预览"
      :visible.sync="previewVisible"
      width="50%">

      <img :src="previewPath" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
// 导入 lodash 包
import _ from 'lodash'

export default {
  name: "GoodsAdd",
  data() {
    return {
      // 控制步骤条的进度
      activeIndex: '0',
      // 添加商品的表单数据对象
      addGoodsForm: {
        goods_name: '',
        goods_price: undefined,
        goods_weight: undefined,
        goods_number: undefined,
        //  所属分类数组
        goods_cat: [],
        // 上传的图片临时路径（对象）
        pics: [],
        //  商品的详情描述
        goods_introduce: '',
        // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
        attrs: []
      },
      // 表单验证
      addGoodsRules: {
        goods_name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        goods_price: [
          {required: true, message: '请输入商品价格', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        goods_weight: [
          {required: true, message: '请输入商品重量', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        goods_number: [
          {required: true, message: '请输入商品数量', trigger: 'blur'},
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ]
      },
      // 商品分类列表所有数据
      cateList: [],
      // 级联选择器的Props
      cateProps: {
        // 点击选择的名称
        label: 'cat_name',
        // 指定具体选择的值属性
        value: 'cat_id',
        // 父子嵌套
        children: 'children'
      },
      // 动态参数列表
      manyTabData: [],
      onlyTabData: [],
      // 图片上传的url地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传图片的权限请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 存储预览图片的url路径
      previewPath: '',
      // 预览对话框的显示隐藏
      previewVisible: false,

    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      await this.$http.get('categories').then(result => {
        // console.log(result)
        const {data: res} = result
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类列表数据失败')
        }
        // console.log(res)
        this.cateList = res.data
      })
    },
    // 级联选择器选中数据变化
    cateChange() {
      // 判断，如果当前选中的不是第三级的分类，就把绑定的数据清空，让只能选择第三级
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
        return
      }
    },
    // 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('*为必填项，请把内容填写完整')
        return false
      }
    },
    // tab 被选中时触发
    tabClick() {
      // 获取当前激活的按钮name是哪个
      // console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'many'}}).then(result => {
          const {data: res} = result
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          res.data.forEach(item => {
            // 对attr_vals 数组通过空格进行分割
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })

          this.manyTabData = res.data
          // console.log(this.manyTabData)
        })
      } else if (this.activeIndex === '2') {
        this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: 'only'}}).then(result => {
          const {data: res} = result
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          res.data.forEach(item => {
            // 对attr_vals 数组通过空格进行分割
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })

          this.onlyTabData = res.data
          // console.log(this.manyTabData)
        })
      }
    },
    // 处理上传图片的预览
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 上传图片的删除
    handleRemove(file) {
      // 1、获取图片的临时路径
      // console.log(file)
      const filePath = file.response.data.tmp_path
      // 2、从pics数组中，找到对应图片的索引值
      const index = this.addGoodsForm.pics.findIndex(find => {
        return find.pic === filePath
      })
      // 3、调用数组的splice方法，进行移除
      this.addGoodsForm.pics.splice(index, 1)
      console.log(this.addGoodsForm)
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // console.log(response)
      //  1、拼接得到图片信息对象
      const picInfo = {pic: response.data.tmp_path}
      //  2、将图片信息对象，push到pics数组中
      this.addGoodsForm.pics.push(picInfo)
      console.log(this.addGoodsForm)

    },
    // 添加页面添加按钮
    add() {
      this.$refs.addGoodsForm.validate(valid => {
        if (!valid) {
          return this.$message.error('请把步骤内容填写完整')
        }
        //  执行添加的业务逻辑
        // lodash cloneDeep(obj) 深拷贝
        // 先对goods_cat做一些深拷贝
        const goodsFrom = _.cloneDeep(this.addGoodsForm)
        goodsFrom.goods_cat = goodsFrom.goods_cat.join(',')

        //  处理动态参数
        this.manyTabData.forEach(item => {
          const newInfo = {
            "attr_id": item.attr_id,
            "attr_value": item.attr_vals.join(' ')
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        //  处理静态参数
        this.onlyTabData.forEach(item => {
          const newInfo = {
            "attr_id": item.attr_id,
            "attr_value": item.attr_vals
          }
          this.addGoodsForm.attrs.push(newInfo)
        })

        goodsFrom.attrs = this.addGoodsForm.attrs
        // console.log(goodsFrom)

        // 发起请求添加商品，商品的名称必须是唯一的
        this.$http.post('goods', goodsFrom).then(result => {
          const {data: res} = result
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }

          this.$message.success('商品添加成功')
          this.$router.push('/goods')
        })
      })
    }
  },
  computed: {
    // 获取商品ID的计算方法
    cateId() {
      // 判断选中的是否是三级商品，如果是直接返回最后一个商品的id,反之就是没有选中第三级id,返回空
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }

  }
}
</script>

<style lang="less" scoped>
.el-tabs {
  margin-top: 40px;
}

.el-checkbox {
  margin: 0px 5px 0px 0px !important;
}

.previewImg {
  width: 100%;
}
</style>
