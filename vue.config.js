module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views'
        // 'router': '@/router', router是不需要配置的，因为调用的少，只需要在main.js里面注册就行
        // 'store': '@/store', 仓库也是不需要配置别名，在哪里使用都是直接 $this.router 调用的方式
      }
    }
  }
}

