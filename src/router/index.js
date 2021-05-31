import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [ // 静态路由--没有权限管理控制
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [ // 动态路由--有权限管理控制--通过roles[]的设置，可以决定哪些角色看到这个路由
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    alwaysShow: true,
    // redirect: '/user/list', // 这个父类重定向可去掉
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'lock',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'users',
        component: () => import('@/views/permission/user'),
        name: 'user',
        meta: { title: '用户管理', icon: 'el-icon-s-custom', roles: ['admin'] }
      },
      {
        path: 'permission',
        component: () => import('@/views/permission/permission'),
        name: 'PermissionList',
        meta: { title: '权限管理', icon: 'el-icon-lock', roles: ['admin'] }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: { title: '角色管理', icon: 'el-icon-user-solid', roles: ['admin'] }
      }
      // {
      //   path: 'menus',
      //   component: () => import('@/views/permission/menu'),
      //   name: 'Menu',
      //   meta: { title: '菜单管理', icon: 'el-icon-menu', roles: ['admin'] }
      // }
    ]
  },
  {
    path: '/student',
    component: Layout,
    alwaysShow: true,
    name: 'Student',
    meta: {
      title: '学员管理',
      icon: 'el-icon-user-solid',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/student/index'),
        name: 'studentlist',
        meta: { title: '学员管理', icon: 'el-icon-s-custom', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/subject',
    component: Layout,
    alwaysShow: true,
    name: 'Subject',
    meta: {
      title: '科目管理',
      icon: 'el-icon-menu',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/subject/index'),
        name: 'subjectlist',
        meta: { title: '科目管理', icon: 'el-icon-s-order', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/achievement',
    component: Layout,
    alwaysShow: true,
    name: 'Achievement',
    meta: {
      title: '成绩管理',
      icon: 'el-icon-document-copy',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/achievement/index'),
        name: 'achievementlist',
        meta: { title: '成绩管理', icon: 'el-icon-s-claim', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/traningroom',
    component: Layout,
    alwaysShow: true,
    name: 'Traningroom',
    meta: {
      title: '舱室管理',
      icon: 'el-icon-s-help',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/traningroom/index'),
        name: 'traningroomlist',
        meta: { title: '舱室管理', icon: 'el-icon-help', roles: ['admin'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
