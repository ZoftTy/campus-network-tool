// 配置文件
export default {
  // 运行端口
  port: 1234,
  // 超时时间
  timeout: 3000,
  // wlanacip
  wlanacip: '219.135.165.26',
  // 加密密钥
  key: [
    '10001',
    '',
    'b2867727e19e1163cc084ea57b9fa8406a910c6703413fa7df96c1acdca7b983a262e005af35f9485d92cd4c622eca4a14d6fd818adca5cae73d9d228b4ef05d732b41fb85f80af578a150ebd9a2eb5ececb853372ca4731ca1c8686892987409be3247f9b26cae8e787d8c135fc0652ec0678a5eda0c3d95cc1741517c0c9c3'
  ],
  // 基础URL
  baseURL: 'http://125.88.59.131:10001',
  // 登录配置
  login: {
    // 请求地址
    path: '/ajax/login',
    // 请求方法
    method: 'POST',
    // 请求头部
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  // 验证码配置
  code: {
    // 请求地址
    path: '/common/image_code.jsp',
    // 请求方法
    method: 'GET'
  }
}
