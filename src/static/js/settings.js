// mdui JavaScript 工具库
let $ = mdui.$
// electron 通信模块
const ipc = require('electron').ipcRenderer

// 账户

$('.login').on('click', () => {
    ipc.send('readAccount')
    $('#progress').removeClass('mdui-invisible')
})

$('#dataSave').on('click', () => {
    $("#dataSave").prop('disabled', true)
    let account = {
        username: $('#username').prop('value'),
        password: $('#password').prop('value')
    }
    if (account.username != '' && account.password != '') {
        $('#progress').removeClass('mdui-invisible')
        ipc.send('writeAccount', account)
    } else {
        console.log("账户或密码不呢为空!");
    }
})

// 处理接收函数
ipc.on('readAccount', (event, res) => {
    $('#progress').addClass('mdui-invisible')
    if (res) {
        $('#login>div').addClass('mdui-textfield-not-empty')
        $('#username').prop('value', res.username);
        $('#password').prop('value', res.password);
    } else {
        console.log("空");
    }
})
ipc.on('writeAccount', (event, res) => {
    $('#progress').addClass('mdui-invisible')
    $("#dataSave").prop('disabled', false)
    if (res) {
        console.log("写入成功");
    } else {
        console.log("写入失败！");
    }
    console.log("writeAccount");
})

// 账户 End

// 设置

// 自启动
ipc.send('readSinceLaunch')
$('#setting').on('click', () => {
    ipc.send('readSinceLaunch')
})
$('#sinceLaunch').on('click', () => {
    ipc.send('writeSinceLaunch', $('#sinceLaunch').prop('checked') ? true : false)
})
ipc.on('readSinceLaunch', (e, res) => {
    if (res) $('#sinceLaunch').prop('checked', true)
    else $('#sinceLaunch').prop('checked', false)
})

// 设置 End
