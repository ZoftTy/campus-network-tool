function imgToBase64(src) {

  function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png");  // 可选其他值 image/jpeg
    return dataURL;
  }

  return new Promise(resolve => {
    var image = new Image();
    image.src = src + '?v=' + Math.random(); // 处理缓存
    image.crossOrigin = "*";  // 支持跨域图片
    image.onload = function () {
      var base64 = getBase64Image(image);
      resolve(base64)
    }
  })

}

var port = chrome.runtime.connect({ name: "campuscode" })

port.onMessage.addListener(function (msg) {
  if (msg.length >= 5) {
    port.postMessage({})
    return false
  }

  code.innerHTML = msg.code
  code.value = msg.code
})

// const cacheCode = document.querySelector('#changeCode')
const cacheCode = document.querySelector('#image_code')

cacheCode.onclick = async () => {
  let img = await imgToBase64('http://125.88.59.131:10001/common/image_code.jsp')
  cacheCode.src = img
  port.postMessage(img)
}

window.onload = async () => {
  let img = await imgToBase64('http://125.88.59.131:10001/common/image_code.jsp')
  cacheCode.src = img
  port.postMessage(img)
}
