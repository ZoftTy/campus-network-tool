const fs = require('fs')

const querystring = require('querystring');

const axios = require('axios')
axios.defaults.withCredentials = true

const Store = require('electron-store')
const store = new Store()

// 验证码模块
const verifyCode = require('./verifyCode')


exports.login = function (data, callback) {
	// 不能为空
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			if (data[key] == '') {
				callback(key + "不能为空！")
			}
		}
	}

	function cookieRes(res) {
		store.set('session', res)
	}
	verifyCode.verifyCode(callback, cookieRes).then(res => {
		data.code = res
		axios({
			url: 'http://125.88.59.131:10001/ajax/login',
			method: 'post',
			headers: {
				'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15",
				Cookie: store.get('session')
			},
			data: querystring.stringify(data),
		}).then(res => {
			if (res.headers['set-cookie'] != undefined) {
				store.set('signature', res.headers['set-cookie'][0].split(' ')[0])
				store.set('loginUser', res.headers['set-cookie'][1].split(' ')[0])
			}
			callback(res.data)
		}, err => {
			callback([500, 3])
		})
	}, err => {
		return Promise.reject(err)
	}).catch(err => {
		callback(err)
	})
}

exports.logout = (data, callback) => {
	axios({
		url: 'http://125.88.59.131:10001/ajax/logout',
		method: 'POST',
		headers: {
			'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15",
			Cookie: store.get('signature') + store.get('loginUser') + store.get('session')
		},
		data: querystring.stringify(data),
	}).then(res => {
		if (res.data.resultCode == 0) callback([220, 1])
		else callback([510, 1])
	})
}
