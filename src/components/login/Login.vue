<template>
  <div class="login_container">
    <!--组件背景插件-->
    <Login_back/>

    <!--登录内容盒子-->
    <div class="login_box">
      <!--头像-->
      <div class="avatar_box">
        <img src="~assets/img/login/login_logo.png"/>
      </div>
      <!--登陆文字-->
      <div class="login_text">请登录</div>

      <!--登录表单-->
      <el-form
        ref="loginFormRef"
        :model="LoginForm"
        label-width="0px"
        class="login_form"
        :rules="rules"
      >
        <!--用户名-->
        <el-form-item prop="username">
          <el-input
            type="text"
            prefix-icon="iconfont icon-user"
            v-model="LoginForm.username"
            placeholder="请输入账号"
            v-focus
            onkeyup="this.value=this.value.replace(/[, ]/g,'')"
          ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-lock_fill"
            v-model="LoginForm.password"
            placeholder="请输入密码"
            onkeyup="this.value=this.value.replace(/[, ]/g,'')"
          ></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btn">
          <el-button @click="login" type="primary" round>登录</el-button>
          <el-button @click="resetLoginForm('loginFormRef')" type="info" round
          >重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Login_back from '@/components/login/childCompts/Login_back'

export default {
  name: 'Login',
  components: {
    Login_back
  },
  data() {
    return {
      LoginForm: {
        // 表单数据绑定内容
        username: 'admin',
        password: '123456',
      },
      // Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
      rules: {
        username: [
          {required: true, message: '请输入账号名称', trigger: 'blur'},
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {
            min: 6,
            max: 18,
            message: '长度在 6 到 18 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  // 自定义指令集，官方案例可以看一下，解决对一些普通元素的底层操作，比如自动聚焦
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        // 聚焦元素
        el.querySelector('input').focus()
      },
    },
  },
  methods: {
    // 获取ref对象实例,对整个表单规则进行重置，将所有字段值重置为初始值并移除校验结果
    resetLoginForm(formName) {
      this.$refs[formName].resetFields()
      // 内容也重置为空
      // this.LoginForm.username = ''
      // this.LoginForm.password = ''
    },
    // 表单点击登录之后的预验证
    // validate对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，传两参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
    login() {
      // 获取ref表单实例对象
      this.$refs.loginFormRef.validate(async (valid) => {
        // 表单规则合法为true,反之为false
        if (!valid) return
        // 到这一步说明预验证是合法的，可以进行登录密码账号匹配了
        // 返回的数据是一个Promise异步请求的数据是无法立即使用的，需要进行async 和 await 简化操作
        // Promise 对象用于表示一个异步操作的最终完成 (或失败)及其结果值
        // async和await关键字让我们可以用一种更简洁的方式写出基于Promise的异步行为，而无需刻意地链式调用promise
        // {data: result} 解构返回的数据中的data数据，我们只要data的数据
        const {data: res} = await this.$http.post('login', this.LoginForm)
        let messAge = res.meta.msg
        if (res.meta.status !== 200) return this.$message.error(messAge)
        this.$message.success(messAge)
        // 登录成功之后，需要将后台返回的token保存到客户端 sessionStorage 中，操作完毕之后，需要跳转到主页/home
        console.log(res)
        //sessionStorage 属性允许你访问一个，对应当前源的 session Storage 对象。
        // 它与 localStorage 相似，不同之处在于 localStorage 里面存储的数据没有过期时间设置，而存储在 sessionStorage 里面的数据在页面会话结束时会被清除。
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push("/home")

      })
    }
  }
}
</script>

<style lang="less" scoped>
// 组件盒子
.login_container {
  // center是距离页面左边的定位，0px是距离页面上面的定位
  background: url('~assets/img/login/Back_b.jpg') no-repeat center/100% 0;
  //min-height: 100vh;
  height: 100%;
  //把背景图像扩展至足够大，以使背景图像完全覆盖背景区域。背景图像的某些部分也许无法显示在背景定位区域中；
  background-size: cover;
}

.login_box {
  width: 450px;
  height: 300px;
  //opacity: 0.3; //会改变所有子元素透明度
  /* RGBa, 透明度0.6 */
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  // 盒子居中，需要偏移才能居中
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /* 阴影向右偏移10px、向下偏移10px、模糊距离为20px*/
  box-shadow: 1px 2px 10px rgba(85, 80, 100, 0.9);
}

.avatar_box {
  opacity: 10;
  height: 50px;
  width: 50px;
  border: 1px solid #c4c4c4;
  border-radius: 50%;
  padding: 5px;
  position: absolute;
  left: 50%;
  top: 13%;
  transform: translate(-50%, -50%);
  //background: rgba(0, 0, 0, 0.3);
  // 盒子里的图片设置
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.login_text {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);

  font-size: 14px; //字体120像素
  color: white; //字体颜色：白
  //text-shadow: 0 0 10px #ababab, 0 0 20px #ffffff, 0 0 30px #c0c0c0, 0 0 40px #c2c2c2; //设置发光效果
  text-shadow: 0 0 10px #ababab; //设置发光效果
  letter-spacing: 5px; // 字间距
}

// 表单
.login_form {
  width: 100%;
  position: absolute;
  // 表单离底部的位置
  bottom: 0;
  padding: 0 20px;
  //为元素指定的任何内边距和边框都将在已设定的宽度和高度内进行绘制
  box-sizing: border-box;
}

// 表单内的item
.el-form-item {
  margin-bottom: 20px;
}

.btn {
  display: flex;
  justify-content: space-around;
}

// 表单item内的input输入框设置为圆角透明
/deep/ .el-input__inner {
  /*或者 .s2>>>.el-input__inner  */
  background: rgba(0, 0, 0, 0.2); /*调整inner的背景色，透明*/
  border-radius: 100px; /*输入框圆角值*/
  color: #f6f6f6;
}
</style>
