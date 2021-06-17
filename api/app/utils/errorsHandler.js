const handler = async (ctx, next) => {
  try {
    await next()

    // 判断 404
    if (!ctx.body) {
      ctx.response.body = {
        code: 404,
        message: '404 not found'
      }
      // 状态码
      ctx.response.status = 404
    }
  } catch (err) {
    // 输出错误
    console.log('\x1B[31m%s\x1B[0m', `[ERROR]:`, err)

    // 警告错误
    if (err.code == 'WARN') {
      // 错误消息
      ctx.response.body = {
        code: err.code,
        message: err.message
      }
      // 状态码
      ctx.response.status = err.status || 200

      return false
    }

    // 未知错误
    ctx.response.body = {
      code: 500,
      message: err.message || '未知错误'
    }
    // 状态码
    ctx.response.status = 500
  }
}

export default handler
