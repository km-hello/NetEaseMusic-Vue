<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header
      ><div>
        <img src="../assets/logo.png" alt />
        <span>音乐后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="rgb(19, 54, 151)"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router="true"
        >
        <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id" >
          <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName}}</span>
            </template>
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/users">
              <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>用户列表</span>
                </template></el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>歌单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="toplist">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>排行榜</span>
                </template>
              </el-menu-item>
              <el-menu-item-group>
              <el-menu-item index="playlist">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>歌单列表</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span>歌曲管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="music">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>歌曲列表</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-help"></i>
              <span>MV管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="mv">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>MV列表</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-s-flag"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="dataDisplay">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>数据展示</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu> -->
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view ></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [
        {
          id: 101,
          authName: '数据统计',
          path: '',
          children: [{
            id: 201,
            authName: '数据展示',
            path: 'dataDisplay'
          }]
        },
        {
          id: 102,
          authName: '歌单管理',
          path: '',
          children: [{
            id: 202,
            authName: '排行榜',
            path: 'toplist'
          },
          {
            id: 203,
            authName: '歌单列表',
            path: 'playlist'
          }]
        },
        {
          id: 103,
          authName: '歌曲管理',
          path: '',
          children: [{
            id: 204,
            authName: '歌曲列表',
            path: 'music'
          }]
        },
        {
          id: 104,
          authName: 'MV管理',
          path: '',
          children: [{
            id: 205,
            authName: 'MV列表',
            path: 'mv'
          }]
        },
        {
          id: 105,
          authName: '用户管理',
          path: '',
          children: [{
            id: 206,
            authName: '用户列表',
            path: 'users'
          }]
        }
      ],
      iconObj: {
        '101': 'el-icon-s-flag',
        '102': 'el-icon-s-order',
        '103': 'el-icon-star-on',
        '104': 'el-icon-s-help',
        '105': 'el-icon-user-solid'
      },
      activePath: ''
    }
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: rgb(4, 32, 109);
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      height: 40px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: rgb(19, 54, 151);
  .el-menu{
      border-right: none;
  }
}
// .el-main {
// }
// .el-menu-item{
//   margin-left: 15px;
// }
</style>
