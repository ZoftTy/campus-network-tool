import { RSAKeyPair, encryptedString, setMaxDigits } from '../app/utils/RSA.js'
import Axios from 'axios'
import querystring from 'querystring'

setMaxDigits(200)
var key = new RSAKeyPair(
  '10001',
  '',
  'b2867727e19e1163cc084ea57b9fa8406a910c6703413fa7df96c1acdca7b983a262e005af35f9485d92cd4c622eca4a14d6fd818adca5cae73d9d228b4ef05d732b41fb85f80af578a150ebd9a2eb5ececb853372ca4731ca1c8686892987409be3247f9b26cae8e787d8c135fc0652ec0678a5eda0c3d95cc1741517c0c9c3'
)
var loginKey = encryptedString(key, '{"userName":"' + '20171891' + '","password":"' + '518915..' + '","rand":"' + 'arfc' + '"}')

const data = {
  wlanuserip: '172.28.234.141',
  wlanacip: '219.135.165.26',
  loginKey: loginKey
}

const axios = Axios.create()

axios({
  url: 'http://125.88.59.131:10001/ajax/login',
  method: 'post',

  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
    Cookie: 'JSESSIONID=LP8Yo-1SXlsMcXSu-AF2imE-EuDzz7UNbKwj5osJOg7NQLIje_Tp!-1653338595',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data: querystring.stringify(data)
}).then(res => {
  console.log(res.data)
})
