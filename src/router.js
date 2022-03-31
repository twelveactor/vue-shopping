import Vue from 'vue'
import Router from 'vue-router'


const Login = () => import('components/login/Login')
const Home = () => import('components/home/Home')
const WelcomeMain = () => import('components/home/childCompts/WelcomeMain')
const UsersList = () => import('@/components/home/childCompts/userManage/UsersList')
const RoleList = () => import('@/components/home/childCompts/powerManage/RoleList')
const PowerList = () => import('@/components/home/childCompts/powerManage/PowerList')
const GoodsList = () => import('@/components/home/childCompts/goodsManage/GoodsList')
const GoodsAdd = () => import('@/components/home/childCompts/goodsManage/GoodsListInfo/GoodsAdd')
const ClassifyParament = () => import('@/components/home/childCompts/goodsManage/ClassifyParament')
const GoodsClassify = () => import('@/components/home/childCompts/goodsManage/GoodsClassify')
const indentList = () => import('@/components/home/childCompts/indentManage/IndentList')
const DataReport = () => import('@/components/home/childCompts/dataStatistics/DataReport')

// 安装插件
Vue.use(Router)

const routes = [
  {path: '/', redirect: '/login'},
  {path: '/login', component: Login},
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: WelcomeMain},
      {path: '/users', component: UsersList},
      {path: '/roles', component: RoleList},
      {path: '/rights', component: PowerList},
      {path: '/goods', component: GoodsList},
      {path: '/params', component: ClassifyParament},
      {path: '/categories', component: GoodsClassify},
      {path: '/orders', component: indentList},
      {path: '/reports', component: DataReport},
      {path: '/goods/add', component: GoodsAdd},
    ]
  }
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
