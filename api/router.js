import Router from 'koa-router'
import IndexController from './app/controller/index.js'

// 实例化
const router = new Router()

// 登录路由: GET
router.get('/login', async ctx => await new IndexController(ctx))
// 登录路由: POST
router.post('/login', async ctx => await new IndexController(ctx))

// 导出路由
export default router
