import Axios from 'axios'
import querystring from 'querystring'

import config from '../../config/index.js'
import { RSAKeyPair, encryptedString } from './RSA.js'

// 密钥
let key = new RSAKeyPair(...config.key)

// 实例化 axios
const axios = Axios.create({
  baseURL: config.baseURL,
  method: config.login.method,
  headers: config.login.headers
})

/**
 * @param {string} wlanuserip  用户登录的IP地址
 * @param {object} user 用户数据
 * @param {string} cookie 验证码cookie
 * @returns {Promise} 返回异步对象
 */
export default (wlanuserip, useData, cookie) => {
  // 加密数据
  let loginKey = encryptedString(key, JSON.stringify(useData))

  // 数据
  const data = {
    wlanuserip,
    wlanacip: config.wlanacip,
    loginKey
  }

  // 发送请求
  return axios({
    url: config.login.path,
    headers: {
      Cookie: cookie
    },
    data: querystring.stringify(data)
  })
}
