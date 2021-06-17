import Axios from 'axios'
import config from '../../config/index.js'

const axios = Axios.create({
  baseURL: config.baseURL,
  method: config.code.method
})

export default async () => {
  return axios({
    url: config.code.path,
    responseType: 'arraybuffer'
  }).then(({ data, headers }) => {
    const instance = Buffer.from(data)
    const base64 = instance.toString('base64')
    return {
      codeImage: 'data:image/png;base64,' + base64,
      cookie: headers['set-cookie'][0].split(' ')[0]
    }
  })
}
