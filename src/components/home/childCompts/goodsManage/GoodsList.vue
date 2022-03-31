<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片-->
    <el-card>
      <!--栅格系统，排列方式 和 搜索框-->
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入用户名/ID"
                      class="input-with-select"
                      v-model="GoodsInfo.query"
                      clearable
                      @clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList">查询</el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addGoodsInfo">添加商品</el-button>
          </div>
        </el-col>
      </el-row>

      <!--内容主体，表单-->
      <el-table :data="GoodsList"
                border
                stripe
                highlight-current-row>
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" align="center"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" align="center"></el-table-column>
        <el-table-column prop="add_time"
                         label="创建时间"
                         align="center"
                         show-overflow-tooltip>
          <template v-slot="scope">
            <span>{{ dateFormat(scope.row.add_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <!--使用作用域插槽对当前行状态进行改变,通过插槽名称获取当前一行作用域里面的数据-->
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary"
                         icon="el-icon-edit"
                         circle size="small"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle size="small"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        @size-change="goodsSizeChange"
        @current-change="goodsCurrentChange"
        :current-page="GoodsInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="GoodsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!--添加商品对话框-->
    <!--    <el-dialog-->
    <!--      title="添加商品"-->
    <!--      :visible.sync="addGoodsDialog"-->
    <!--      width="50%"-->
    <!--      @close="CloseAddGsoodsForm"-->
    <!--    >-->
    <!--      &lt;!&ndash;内容主体区&ndash;&gt;-->
    <!--      <el-form :model="GoodsParams" :rules="FormRules" ref="EditDialog" label-width="100px" class="demo-ruleForm">-->

    <!--        <el-form-item label="商品名称" prop="goods_name">-->
    <!--          <el-input v-model="GoodsParams.goods_name"></el-input>-->
    <!--        </el-form-item>-->

    <!--        <el-form-item label="电话" prop="mobile">-->
    <!--          <el-input v-model="GoodsParams.mobile"></el-input>-->
    <!--        </el-form-item>-->

    <!--        <el-form-item label="邮箱" prop="email">-->
    <!--          <el-input v-model="GoodsParams.email"></el-input>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->

    <!--      <span slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="addGoodsDialog = false">取 消</el-button>-->
    <!--        <el-button type="primary" @click="confirmAddGoodsSub">确 定</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
export default {
  name: "GoodsList",
  data() {
    return {
      // 请求的分页参数
      GoodsInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 存储商品的所有数据列表
      GoodsList: [],
      // 分页显示所有商品数据的总数
      total: 0,
      //  显示隐藏添加商品对话框
      addGoodsDialog: false,
      //  获取当前的商品对象
      GoodsParams: {}
    }
  },
  created() {
    // 组件创建获取数据
    this.getGoodsList()
  },
  methods: {
    getGoodsList() {
      this.$http.get('goods', {
        params: this.GoodsInfo
      }).then(result => {
        const {data: res} = result
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        console.log(res)
        // 把拉取的数据赋值给商品数据列表
        this.GoodsList = res.data.goods
        this.total = res.data.total
        this.$message.success(res.meta.msg)
      })
    },
    // 监控每页显示条数的改变
    goodsSizeChange(newSize) {
      // console.log('条数')
      this.GoodsInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监控当前页数的改变
    goodsCurrentChange(newNum) {
      // console.log('页数')
      this.GoodsInfo.pagenum = newNum
      this.getGoodsList()
    },
    //  时间格式化
    dateFormat: function (rowTime) {
      // 时间戳时间毫秒改为秒需要*1000
      return this.$moment(rowTime * 1000).format("YYYY-MM-DD HH:mm:ss")
    },
    // 添加商品按钮
    addGoodsInfo() {
      // this.addGoodsDialog = true
      // 跳转添加商品页面
      this.$router.push('/goods/add')
    },
    // 关闭添加商品对话框清空表单数据
    CloseAddGsoodsForm() {

    },
    // 添加对话框确认按钮
    confirmAddGoodsSub() {
    }
  }
}
</script>

<style scoped>

</style>
