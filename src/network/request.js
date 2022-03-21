import axios from 'axios'

// 封装一下请求的方法，config传入后台接口数据的路径名称
// export function request(config) {
//   // 1.创建axios的实例
//   const instance = axios.create({
//       baseURL: 'http://127.0.0.1:8888/api/private/v1',
//       timeout: 5000
//     }
//   )
//
//   // 2.axios的拦截器
//   // 请求拦截
//   // instance.interceptors.request.use(config => {
//   //   // 成功返回拦截的数据
//   //   return config
//   // }, error => {
//   //
//   // })
//   // // 响应拦截
//   // instance.interceptors.response.use(res => {
//   //   //  把响应的数据返回回去
//   //   return res.data
//   // }, error => {
//   //   console.log(error)
//   // })
//
//   // 放到原型链上
//   // Vue.prototype.$http = axios
//
//   // 拦截过滤了一波进行真正的网络请求
//   return instance(config)
// }
