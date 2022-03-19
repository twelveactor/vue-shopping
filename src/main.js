import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import VueParticles from 'vue-particles'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 放到原型链上
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 安装login登录界面动态背景插件
Vue.use(VueParticles)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
