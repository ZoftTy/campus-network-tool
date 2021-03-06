// 请求
const { createWorker } = Tesseract

const worker = createWorker({
  workerPath: chrome.extension.getURL('js/tesseract/worker.min.js'),
  langPath: chrome.extension.getURL('lang-data'),
  corePath: chrome.extension.getURL('js/tesseract/tesseract-core.wasm.js'),
  logger: (m) => console.log(m)
});

// 初始化 ocr
(async () => {
  await worker.load()
  await worker.loadLanguage('eng')
  await worker.initialize('eng')
})()

// 识别函数
const ocr = async (img) => {
  let { data: { text } } = await worker.recognize(img)
  text = text.replace(/\s*/g, "")
  text = text.toLowerCase()
  text = text.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, "")
  return text
}

// 扩展向内容脚本发送消息
chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name == "campuscode")
  port.onMessage.addListener(async (img) => {
    let code = await ocr(img)
    port.postMessage({ code })
  })
})

// 重定向js文件
chrome.webRequest.onBeforeRequest.addListener(() => {
  return { redirectUrl: chrome.extension.getURL('js/login.js') }
}, { urls: ['http://125.88.59.131:10001/js/login.js?version=2017'] }, ["blocking"])