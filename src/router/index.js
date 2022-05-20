import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Music from '../components/music/Music.vue'
import Songsheet from '../components/song_sheet/Songsheet.vue'
import Toplist from '../components/Toplist.vue'
import MV from '../components/mv/Mv.vue'
import DataDisplay from '../components/DataDisplay.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/dataDisplay',
      children: [
        {path: '/welcome', component: Welcome},
        {path: '/users', component: Users},
        {path: '/music', component: Music},
        {path: '/playlist', component: Songsheet},
        {path: '/toplist', component: Toplist},
        {path: '/mv', component: MV},
        {path: '/dataDisplay', component: DataDisplay}
      ]
    }
  ]
})

// 挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作 next('/login')强制跳转login
router.beforeEach((to, from, next) => {
  // 访问登录页，放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token, 强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
