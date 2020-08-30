import Vue from 'vue'
import VueRouter from 'vue-router'

// import constantRouterMap from './routes'

Vue.use(VueRouter)

export const constantRouterMap = [
  { path: '/', component: () => import('pages/login.vue') },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/index', component: () => import('pages/Index.vue') },
      // { path: '/dashboard', component: () => import('pages/dashboard.vue') },
      { path: '/dashboard_v2', component: () => import('pages/dashboard_v2.vue') }
      // { path: '/dashboard_v3', component: () => import('pages/dashboard_v3.vue') },
      // { path: '/customer_management', component: () => import('pages/customer_management.vue') },
      // { path: '/change_request', component: () => import('pages/change_request.vue') },
      // { path: '/my_profile', component: () => import('pages/my_profile.vue') },
      // { path: '/sales_invoices', component: () => import('pages/sales_invoices.vue') },
      // { path: '/quotes', component: () => import('pages/quotes.vue') },
      // { path: '/transactions', component: () => import('pages/transactions.vue') },
      // { path: '/employee_salary_list', component: () => import('pages/employee_salary_list.vue') },
      // { path: '/calendar', component: () => import('pages/calendar.vue') },
      // { path: '/department', component: () => import('pages/department.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]
// export default constantRouterMap

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

// export default function (/* { store, ssrContext } */) {
export default new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes: constantRouterMap,

  // Leave these as they are and change in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE
})

//   return Router
// }

// export default new Router({
//   mode: 'history',
//   scrollBehavior: () => ({ y: 0 }),
//   routes: constantRouterMap
// })
