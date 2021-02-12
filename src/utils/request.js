import axios from 'axios'
import { Message } from 'element-ui'

const BASEURL = process.env.NODE_ENV === "production" ? "" : "/api"

// 创建axios实例
const service = axios.create({
  baseURL: BASEURL,
  timeout: 15000
})

// 添加请求拦截器
service.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use((response) => {
  var data = response.data
  if (data.resCode !== 0) {
    Message.error(data.message)
    return Promise.reject(data)
  } else {
    // return response
    return Promise.resolve(response)
  }
}, (error) => {
  return Promise.reject(error)
})

export default service