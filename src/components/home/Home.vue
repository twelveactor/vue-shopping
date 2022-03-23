<template>

  <el-container class="home_container">
    <!--头部区域-->
    <el-header>
      <!--logo-->
      <div class="header-logo">
        <img src="~assets/img/login/login_logo.png"/>
        <span>Vue后台管理系统</span>
      </div>
      <!--退出个人信息-->
      <el-button type="info" @click="btnHomeOut">退出</el-button>
    </el-header>

    <!--内容主题区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ?64+'px' : 200+'px'">
        <!--控制侧边栏缩放-->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--侧边栏菜单-->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath">
          <!--一级菜单-->
          <el-submenu :index="item.id + ''"
                      v-for="item in MenuList"
                      :key="item.id">
            <!--一级菜单模板区-->
            <template slot="title">
              <!--图标-->
              <i :class="iconfontList[item.id]"></i>
              <!--文本-->
              <span>{{ item.authName }}</span>
            </template>
            <!--二级菜单选项区-->
            <el-menu-item :index="'/'+menuItem.path"
                          v-for="menuItem in item.children"
                          :key="menuItem.id"
                          @click="saveNavStatus('/'+menuItem.path)">
              <template>
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>{{ menuItem.authName }} </span>
              </template>
            </el-menu-item>

          </el-submenu>

        </el-menu>
      </el-aside>

      <!--右侧主题内容显示-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>

    </el-container>
  </el-container>

</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      MenuList: [],
      iconfontList: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-3702mima',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      // 当前被激活的页面
      activePath: ''
    }
  },
  created() {
    // 组件创建就拉取菜单
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出
    btnHomeOut() {
      window.sessionStorage.clear()
      // 清除之后要重定向一下页面,因为重定向之后会检查token，没有需要重新登录
      this.$router.push('/')
    },
    // 获取左侧所有菜单
    async getMenuList() {
      const {data: res} = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.MenuList = res.data

    },
    // 点击收缩折菜单侧边栏
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存当前点击的标签高亮
    saveNavStatus(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  width: 100%;
  height: 100%;
}

.el-header {
  height: 150px !important;
  display: flex;
  background: url("~assets/img/home/B.gif") no-repeat center 0px;
  background-size: cover;
  justify-content: space-between;
  align-items: center;

  > div {
    height: 80px;
    width: 400px;
    //position: absolute;
    //left: 5%;
    //top: 5%;
    //transform: translate(-50%, -50%);
    display: flex;
    line-height: 80px;
    margin-left: 20px;
    justify-content: space-around;

    img {
      width: 80px;
      height: 100%;
    }

    span {
      width: 300px;
      font-size: 24px;
      font-family: 'tinymce-small', Arial;
      letter-spacing: 2px;
      font-weight: 450;
      display: inline-block
    }
  }
}

.el-aside {
  background-color: #545c64;
  //width: 200px !important;

  .el-menu {
    // 取消菜单项展开的多余的边框线
    border-right: 0;
  }
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #3f4144;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  color: #f6f6f6;
  letter-spacing: 1px;
  cursor: pointer;
}


.el-main {
  background-color: #f6f6f6;
}

</style>
