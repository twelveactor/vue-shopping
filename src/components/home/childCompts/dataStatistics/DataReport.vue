<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片-->
    <el-card>
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 600px;height:400px;"></div>

    </el-card>
  </div>
</template>

<script>
// 导入echarts
import * as echarts from 'echarts';
// 深拷贝包
import _ from 'lodash'

export default {
  name: "DataReport",
  data() {
    return {
      // 需要合并的展示数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {
  },
  // 页面元素已经被渲染到了页面
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));

    // 发起get请求获取数据
    this.$http.get('reports/type/1').then(result => {
      const {data: res} = result
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 指定图表的配置项和数据 , merge 合并两个对象的方法
      const optionsData = _.merge(res.data, this.options)

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(optionsData);
    })


  },
  methods: {}
}
</script>

<style scoped>

</style>
