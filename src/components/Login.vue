<template>
  <div class="container">
    <img :src="imgSrc" width="100%" height="100%" alt="" />
    <div class="login_container">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="80px" class="login_box">
        <el-form-item label="用户名" prop="username">
          <el-input class="input" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input class="input" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginform">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', triggle: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', triggle: 'blur' }
        ]
      },
      imgSrc: require('../assets/images/1.jpg')
    }
  },
  methods: {
    // 重置表单
    resetLoginform () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      
      
      this.$refs.loginFormRef.validate(valid => {
        // console.log(valid)
        if (!valid) return
        window.sessionStorage.setItem('token', '123456')
        this.$router.push('/home')
        // this.$axios({
        //   method: 'post',
        //   url: '/url',
        //   data: {}
        // }).then((result) => {
        //   console.log(result)
          // this.$message.success('登录成功！')
          // window.sessionStorage.setItem('token', '123456')
          // this.$router.push('/home')
        // })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
}
.login_container {
  width: 450px;
  height: 300px;
  background-color: rgb(190, 194, 193);
  border-radius: 3px;
  position: absolute;
  top: 30%;
  left: 60%;
}
.login_box{
    margin-top: 20%;
}
.input{
    width: 90%;
}
</style>
