import Koa from 'koa'
import KoaBody from 'koa-body'
import KoaLogger from 'koa-logger'
import KoaCors from 'koa2-cors'

import config from './config/index.js'
import errorsHandler from './app/utils/errorsHandler.js'
import router from './router.js'

// 初始化 Koa
const app = new Koa()

// 添加日志模块
app.use(KoaLogger())

// 跨域
app.use(KoaCors())

// 添加 Body 内容处理模块
app.use(KoaBody())

// 路由错误捕获
app.use(errorsHandler)

// 注册路由
app.use(router.routes()).use(router.allowedMethods())

// 监听端口
app.listen(config.port, () => {
  console.log('\x1B[36m%s\x1B[0m', `[INFO]:`, `端口: ${config.port}`)
})
