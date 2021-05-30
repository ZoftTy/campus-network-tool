// 加载os模块
const os = require('os')
const Store = require('electron-store')
const store = new Store()


// 验证ip地址的函数
function isValidIP(ip) {
	var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
	return reg.test(ip);
}

exports.getNetworkCard = (active) => {

	const networkUntreated = os.networkInterfaces()
	delete networkUntreated.lo0
	let networkCard = []
	let isExist = false

	Object.keys(networkUntreated).forEach((index, numIndex) => {
		networkUntreated[index].forEach((value) => {
			if (isValidIP(value.address)) {
				let returnValue = {
					label: index + ": " + value.address,
					ip: value.address,
					type: 'radio',
					click() {
						store.set('active', value.address)
					}
				}
				if (active == null && value.address.startsWith('172.')) {
					store.set('active', returnValue.ip)
					returnValue.checked = true
				} else if (active != null && active == returnValue.ip) {
					returnValue.checked = true
					isExist = true
				}
				networkCard.push(returnValue)
			}
		})
	})

	if (networkCard.length == 0) {
		return [{
			label: "无在线网卡",
			enabled: false
		}]
	}

	return [networkCard, isExist]
}
