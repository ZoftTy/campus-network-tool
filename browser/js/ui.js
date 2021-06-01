let script = [
  '/js/jquery.js',
  '/js/base64.js',
  '/js/login.js?version=2017',
  '/js/Barrett.js',
  '/js/BigInt.js',
  '/js/RSA.js'
]

document.querySelector('html').remove()
document.appendChild(document.createElement('html'))

fetch(chrome.extension.getURL('/view/index.html'))
  .then(response => response.text())
  .then(response => {
    document.querySelector('html').innerHTML = response

    script.forEach(function (item) {
      var script = document.createElement('script')
      script.setAttribute('src', item)
      document.body.appendChild(script)
    })
  })
