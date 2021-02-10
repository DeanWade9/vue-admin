import axios from 'axios'

const BASEURL = process.env.NODE_ENV === "production" ? "" : "/api"

// 创建axios实例
const service = axios.create({
  baseURL: BASEURL,
  timeout: 1000
})

// 添加请求拦截器
service.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})

export default service