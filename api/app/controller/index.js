import getCodeImg from '../utils/getCodeImg.js'
import identifyCode from '../utils/identifyCode.js'
import login from '../utils/login.js'

class Index {
  /**
   * @constructor
   * @param {object} ctx koa-router的ctx
   */
  constructor(ctx) {
    // 赋值给当前对象
    this.ctx = ctx

    // 检查参数是否正确
    this.param()

    // 返回异步函数
    return this.index()
  }

  param() {
    // 获取请求方法
    const requestMethod = this.ctx.request.method

    // 判断如果是GET
    if (requestMethod == 'GET') {
      // 获取GET方法的params
      this.data = this.ctx.request.query

      // 如果是POST
    } else if (requestMethod == 'POST') {
      // 获取POST方法的body
      this.data = this.ctx.request.body
    }

    // 赋值
    const data = this.data

    // 遍历查看参数是否错误
    const isParam = Object.keys(data).map(key => !!data[key])

    // 判断参数错误
    if (isParam.indexOf(false) != -1) {
      throw {
        code: 'WARN',
        message: '参数错误'
      }
    }
  }

  async code() {
    // 获取base64的验证码和cookie
    let { codeImage, cookie } = await getCodeImg()
    return {
      // 识别验证码
      code: await identifyCode(codeImage),
      // 返回cookie
      cookie
    }
  }

  async index() {
    // 登录状态
    let isLogin = false
    // 验证码失败次数
    let errorCount = 0

    // 用户数据
    let userData = {
      userName: this.data.name,
      password: this.data.password,
      rand: undefined
    }

    // 返回值
    let resultCode = 0
    let resultMessage = null

    // 循环防止验证码错误
    while (!isLogin) {
      let { code, cookie } = await this.code()

      // 添加验证码
      userData.rand = code

      // 开始登录
      let { data } = await login(this.data.wlanuserip, userData, cookie)

      // 解构返回值
      resultCode = data.resultCode
      resultMessage = data.resultInfo

      // 判断不是验证码错误或者登录成功，或者验证码失败次数到达五次，跳出循环
      if (resultCode != '11063000' || resultCode == '0' || errorCount >= 5) {
        isLogin = true
      }

      // 增加验证码失败次数
      errorCount++

      // log 失败日志
      console.log(
        '\x1B[36m%s\x1B[0m',
        `[INFO]:`,
        `${userData.userName}失败: 验证码失败次数${errorCount}`
      )
    }

    // 返回值
    this.ctx.body = {
      code: resultCode == '0' ? 'SUCCESS' : 'ERROR',
      message: resultMessage
    }
  }
}

export default Index
