import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('components/login/Login')
const Home = () => import('components/home/Home')

// 安装插件
Vue.use(Router)

const routes = [
  {path: '/', redirect: '/login'},
  {path: '/login', component: Login},
  {path: '/home', component: Home}
]

const router = new Router({
    routes,
    mode: 'history'
  }
)

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // 表示如果你要访问login页面直接放行
  if (to.path === '/login') return next()
  // 获取token，判断是否有 token对访问页面是否放行
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    // 如果没有tokenStr就对页面进行强制跳转回登录页重新登录
    return next('/login')
  }
  // 存在就直接放行
  next()
})

export default router
