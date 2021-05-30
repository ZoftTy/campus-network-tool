// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu, MenuItem, Tray, nativeImage } = require('electron')
const os = require('os')
const path = require('path')
const Store = require('electron-store')

// 自动更新
const { autoUpdater } = require("electron-updater")

// 自定义网络设备模块
const device = require('./modules/device')
// 自定义登录模块
const login = require('./modules/login')
// 自定义通知模块
const Notice = require('./modules/notice')

const store = new Store()
let appTray = null
let trayMenuTemplate = null
let isLogin = false
let contextMenu = null

// 清除菜单栏
Menu.setApplicationMenu(null)

// 系统托盘图标
function check_mode(username, password) {
  // 用户数据
  const userData = {
    wlanuserip: null,
    wlanacip: '219.135.165.26',
    username,
    password: null,
    rand: '',
    code: '0'
  }
  // 判断密码是否为空，为空不加密
  if (password != null) {
    userData.password = Buffer.from(password).toString('base64')

  }

  // 列表数组
  trayMenuTemplate = [
    {
      label: '账户:' + username,
      type: 'normal',
      enabled: false
    },
    { label: 'separator', type: 'separator' },
    { label: '网卡:', submenu: [] },
    { label: 'separator', type: 'separator' },

    {
      label: '登录',
      type: 'normal',
      enabled: true,
      click(menu) {
        // 是否登录
        menu = menu.menu.items[2].submenu.items
        // for (const iterator of menu) {
        //   if (iterator.checked) {
        //     userData.wlanuserip = iterator.ip
        //   }
        // }
        userData.wlanuserip = store.get('active')

        reloadMenu(4, {
          enabled: false
        })

        // 登录
        if (isLogin) {
          login.logout(userData, (res) => {
            if (res[0] == 220) {
              isLogin = false
              reloadMenu(4, {
                enabled: true,
                label: "登录"
              })
            } else {
              reloadMenu(4, {
                enabled: true,
              })
            }
            Notice.open(res[0], res[1], false)
          })
        } else {
          login.login(userData, (res) => {
            if (res.hasOwnProperty("resultCode")) {
              if (res.resultCode == 0 | res.resultCode == 13002000) {
                // 显示通知！
                Notice.open(200, 1, false)
                console.log('登录成功');
                // 已登录
                isLogin = true
                reloadMenu(4, {
                  enabled: true,
                  label: "断开"
                })
              } else if (res.resultCode == 11063000) {
                // 显示通知！
                Notice.open(500, 1, false)
                console.log('验证码错误');
                reloadMenu(4, {
                  enabled: true,
                  label: "登录"
                })
              } else {
                reloadMenu(4, {
                  enabled: true,
                  label: "登录"
                })
                // 显示通知！
                Notice.open(null, null, res.resultInfo)
              }
            } else if (res[0] == 500) {
              // 显示通知！
              Notice.open(res[0], res[1], false)
              reloadMenu(4, {
                enabled: true,
                label: "登录"
              })
            } else {
              console.log(res);
              // Notice.open(null, null, res)
            }
          });
        }
      }

    },
    { label: 'separator', type: 'separator' },
    {
      label: '设置',
      click: function () {
        // 打开设置
        settingPage()

      }
    },
    {
      label: '检查更新',
      click() {
        autoUpdater.checkForUpdates()
      }
    },
    {
      label: '关于',
      role: 'about'
    },
    {
      label: '退出',
      role: 'quit'
    }
  ]

  // 处理托盘菜单
  trayMenuTemplate[2].submenu = device.getNetworkCard(null)[0]
  contextMenu = Menu.buildFromTemplate(trayMenuTemplate)

  // 判断有没有创建托盘图标
  if (appTray == null) {
    let image = nativeImage.createFromPath(path.join(__dirname, 'static', 'icons', 'campus-tray.png'))
    image.setTemplateImage(true)
    appTray = new Tray(image)
  }

  // 生成托盘菜单
  appTray.setContextMenu(contextMenu);

  // 判断密码是否为空，为空禁止登录
  if (password == null) {
    reloadMenu(4, {
      enabled: false
    })
  }

  app.dock.hide()
}

function reloadMenu(id, data) {
  for (const value in data) {
    if (data.hasOwnProperty(value)) {
      trayMenuTemplate[id][value] = data[value]
      contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
      appTray.setContextMenu(contextMenu)
    }
  }
}

// 设置页面
function settingPage() {
  // 建立窗口
  const settingWindow = new BrowserWindow({
    width: 300,
    height: 415,
    resizable: false,
    title: "设置",
    frame: true,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  // and load the index.html of the app.
  settingWindow.loadFile(path.join(__dirname, 'index.html'))

  // Open the DevTools.
  // settingWindow.webContents.openDevTools()

  // 设置页通信
  // 获取用户数据
  ipcMain.on('readAccount', (event) => {
    let result = {
      username: store.get('username'),
      password: store.get('password')
    }
    if (result.username != undefined || result.password != undefined) {
      event.sender.send('readAccount', result)
    } else {
      event.sender.send('readAccount', false)
    }
  })
  // 写入用户数据
  ipcMain.on('writeAccount', (event, res) => {
    if (res.username != "" || res.password != "") {
      store.set('username', res.username)
      store.set('password', res.password)
      check_mode(store.get('username'), store.get('password'))
      // 显示通知
      Notice.open(210, 1, false)
      event.sender.send('writeAccount', true)
    } else {
      event.sender.send('writeAccount', false)
    }
  })
  // 设置自启动

  ipcMain.on('readSinceLaunch', (event) => {
    event.sender.send('readSinceLaunch', store.get('sinceLaunch'))
  })
  ipcMain.on('writeSinceLaunch', (event, res) => {
    store.set('sinceLaunch', res)
    Notice.open(240, 1)
    app.setLoginItemSettings({
      openAtLogin: res
    })
  })
}
// 检测更新，在你想要检查更新的时候执行
function updateHandle() {
  let uploadUrl = 'https://software-1258101461.cos.ap-guangzhou.myqcloud.com/uploads/software/campus/'
  autoUpdater.setFeedURL(uploadUrl);
  autoUpdater.on('error', function (error) {
    Notice.open(503, 1)
  })
  autoUpdater.on('checking-for-update', function () {
    Notice.open(230, 2)
  })
  autoUpdater.on('update-available', function (info) {
    Notice.open(230, 3)
  })
  autoUpdater.on('update-not-available', function (info) {
    Notice.open(230, 4)
  })

  autoUpdater.on('download-progress', function (progressObj) {
    if (progressObj.percent == 100) Notice.open(230, 5)
  })

}

// 准备好时
app.whenReady().then(() => {
  // 初始化通知对象
  Notice.init()

  // 判断用户初始化
  if (store.get('username') == undefined | store.get('password') == undefined) {
    settingPage()
    Notice.open(520, 1, false)
    check_mode('请设置账户', null)
  } else {
    check_mode(store.get('username'), store.get('password'))
  }

  // 监听托盘图标单击事件
  appTray.on('mouse-down', () => {
    // 处理托盘菜单
    let res = device.getNetworkCard(store.get('active'))
    trayMenuTemplate[2].submenu = res[0]
    if (!res[1]) {
      reloadMenu(4, {
        enabled: true,
        label: "登录"
      })
      isLogin = false
    }
    contextMenu = Menu.buildFromTemplate(trayMenuTemplate)

    appTray.setContextMenu(contextMenu);

  })

  updateHandle()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
