import axios from 'axios'
import router from '../router'
// import { Notification, detailBox } from 'element-ui'
// import store from '../store'
import { getToken } from './auth'
import { Notify } from 'quasar'

// 创建axios实例
console.log('process.env.API_HOST')
console.log(process.env.API_HOST)
const service = axios.create({
  baseURL: process.env.API_HOST, // api 的 base_url
  timeout: 60000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers.Authorization = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers['Content-Type'] = 'application/json'
    if (config.data !== undefined) {
      if (config.data.excu !== undefined) {
        if (config.data.excu === 'tail_start') {
          config.timeout = 60000 * 20
        } else {
          config.timeout = 20000
        }
      }
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const code = response.status
    if (code < 200 || code > 300) {
      Notify.create({
        caption: '错误',
        message: response.detail,
        color: 'red'
      })

      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    let code = 0
    try {
      code = error.response.data.status
    } catch (e) {
      if (error.toString().indexOf('timeout')) {
        Notify.create({
          caption: '错误',
          message: '请求超时!',
          color: 'red'
        })
        return Promise.reject(error)
      }
    }
    if (code === 401) {
      // detailBox.confirm(
      //   '登录状态过期了哦，您可以继续留在该页面，或者重新登录',
      //   '系统提示',
      //   {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }
      // ).then(() => {
      //   store.dispatch('LogOut').then(() => {
      //     location.reload() // 为了重新实例化vue-router对象 避免bug
      //   })
      // })
    } else if (code === 403) {
      router.push({ path: '/401' })
    } else if (code === 502) {
      Notify.create({
        caption: '错误',
        message: '后端服务器连接失败!',
        color: 'red'
      })
    } else {
      const errorMsg = error.response.data.detail
      console.log(errorMsg)
      if (errorMsg !== undefined) {
        Notify.create({
          caption: '错误',
          message: JSON.stringify(errorMsg),
          color: 'red'
        })
      }
    }
    return Promise.reject(error)
  }
)
export default service
