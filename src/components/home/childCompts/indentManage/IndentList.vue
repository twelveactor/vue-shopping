<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片-->
    <el-card>
      <!--栅格系统，排列方式 和 搜索框-->
      <!--栅格系统，排列方式 和 搜索框-->
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入用户名/ID"
                      class="input-with-select"
                      v-model="orders.query"
                      clearable>
              <el-button slot="append" icon="el-icon-search" @click="getOrdersList">查询</el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>

      <!--内容主体，表单-->
      <el-table :data="ordersList"
                border
                stripe
                highlight-current-row>
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" align="center"></el-table-column>
        <el-table-column prop="order_price" label="订单价格(元)" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" align="center"></el-table-column>
        <el-table-column prop="is_send" label="是否发货" align="center"></el-table-column>
        <el-table-column prop="create_time"
                         label="下单时间"
                         align="center"
                         show-overflow-tooltip>
          <template v-slot="scope">
            <span>{{ dateFormat(scope.row.create_time) }}</span>
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
        @size-change="OrdersSizeChange"
        @current-change="OrdersCurrentChange"
        :current-page="orders.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="orders.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "indentList",
  data() {
    return {
      ordersList: [],
      orders: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    getOrdersList() {
      this.$http.get('orders', {
        params: this.orders
      }).then(result => {
        const {data: res} = result
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.ordersList = res.data.goods
        this.total = res.data.total

      })
    },
    //  时间格式化
    dateFormat: function (rowTime) {
      // 时间戳时间毫秒改为秒需要*1000
      return this.$moment(rowTime * 1000).format("YYYY-MM-DD HH:mm:ss")
    },
    OrdersSizeChange(newSize) {
      this.orders.pagesize = newSize
      this.getOrdersList()
    },
    OrdersCurrentChange(newNum) {
      this.orders.pagenum = newNum
      this.getOrdersList()
    }
  }
}
</script>

<style scoped>

</style>
