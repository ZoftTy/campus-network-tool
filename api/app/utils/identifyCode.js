import { createWorker } from 'tesseract.js'
import { join } from 'path'

const { pathname } = new URL('../../', import.meta.url)

const worker = createWorker({
  langPath: join(pathname, 'data'),
  cachePath: join(pathname, 'cache')
})

// OCR 初始化
await worker.load()
await worker.loadLanguage('eng')
await worker.initialize('eng')

// 识别函数
export default async codeImage => {
  let {
    data: { text }
  } = await worker.recognize(codeImage)
  // 处理验证码
  // 去除空格
  text = text.replace(/\s*/g, '')
  // 转英文小写
  text = text.toLowerCase()
  // 去除特殊字符串
  text = text.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, '')
  // 返回
  return text
}
