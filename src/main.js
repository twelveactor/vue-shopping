import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import VueParticles from 'vue-particles'
import axios from "axios";
import 'default-passive-events'
import moment from 'moment'
import TreeTable from 'vue-table-with-tree-grid'


// 配置网络请求根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
// 请求拦截
axios.interceptors.request.use(config => {
  // console.log(config) // 打印的config中并没有
  // 在请求拦截中授权限，为请求头对象，添加token验证的Authorization( 授权 )字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, error => {
  console.log(error)
})
// 响应拦截
axios.interceptors.response.use(res => {
  // 返回响应的数据
  return res
}, error => {
  console.log(error)
})

// 把axios请求加入原型链
Vue.prototype.$http = axios
// 把格式化时间moment插件加入原型链
Vue.prototype.$moment = moment
// 手动全局注册vue-table-with-tree-grid
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

// 安装login登录界面动态背景插件
Vue.use(VueParticles)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
