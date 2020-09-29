const { Notification } = require('electron')
// 创建通知
let notice = null

exports.init = () => {
    notice = new Notification({
        title: "",
        body: "",
    });
}

exports.open = (status, code, err) => {
    let statusInfo = {
        200: {
            title: "登录成功",
            1: {
                body: "校园网登录成功！"
            },
        },
        210: {
            title: "保存成功",
            1: {
                body: "账户信息保存成功"
            },

        },
        220: {
            title: '下线成功',
            1: {
                body: '已退出校园网'
            }
        },
        230: {
            title: '更新',
            2: {
                body: '正在检查更新……'
            },
            3: {
                body: '检测到新版本，正在下载……'
            },
            4: {
                body: '现在使用的就是最新版本，不用更新'
            },
            5: {
                body: '更新完成'
            }

        },
        240: {
            title: '设置成功',
            1: {
                body: '自启动设置成功'
            }
        },
        500: {
            title: "登录失败",
            1: {
                body: "验证码错误！请重试"
            },
            2: {
                body: "获取验证码失败！请检查网络"
            },
            3: {
                body: "连接失败！请检查网络"
            }
        },
        510: {
            title: "保存失败",
            1: {
                body: "账户信息保存成功"
            }
        },
        510: {
            title: "下线失败",
            1: {
                body: "无法登出校园网！请检查网络"
            }
        },
        520: {
            title: "请设置账户",
            1: {
                body: "第一次使用需要设置校园网账户"
            }
        },
        530: {
            title: '更新错误',
            1: {
                body: '检查更新出错',
            }
        },
    }
    if (err) {
        notice.title = "错误"
        notice.body = err
    } else {
        notice.title = statusInfo[status].title
        notice.body = statusInfo[status][code].body
    }
    notice.show()

}
