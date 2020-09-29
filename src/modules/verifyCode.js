const fs = require('fs')
const path = require('path')

const { app } = require('electron')

const axios = require('axios')
axios.defaults.withCredentials = true

const { createWorker } = require('tesseract.js')


let File = {
	filePath: app.getPath('temp') + ', campus',
	delFile() {
		fs.rmdirSync(path.join(this.filePath, 'verifyImgs'), { recursive: true }, (res) => {
			console.log(res);
		})
	},
	mkdir() {
		try {
			fs.mkdirSync(path.join(this.filePath))
		} catch (err) {
			console.log('文件夹已存在');
		}
		try {
			fs.mkdirSync(path.join(this.filePath, 'verifyImgs'))
		} catch (err) {
			console.log('1文件夹已存在');
		}
	}
}


// 获取远端图片
exports.verifyCode = async function (callback, cookieCk) {
	File.delFile()
	File.mkdir()

	const worker = createWorker({
		langPath: path.join(__dirname, '..', 'static', 'lang-data'),
		cachePath: path.join(File.filePath)
	});

	const time = new Date().getTime()
	const imgPath = path.join(File.filePath, 'verifyImgs', `${time}.jpg`)

	let cookie = null
	return await axios({
		method: 'get',
		timeout: 5000,
		headers: {
			'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15",
		},
		url: "http://125.88.59.131:10001/common/image_code.jsp?time=" + time,
		responseType: 'stream'
	}).then(response => {

		cookieCk(response.headers['set-cookie'][0].split(' ')[0])
		response.data.pipe(fs.createWriteStream(imgPath))
	}, err => {
		return Promise.reject([500, 2])
	}).then(res => {
		async function code(res) {
			// 识别初始化
			await worker.load();
			await worker.loadLanguage('eng');
			await worker.initialize('eng');
			let { data: { text } } = await worker.recognize(res);
			// await worker.terminate();
			text = text.replace(/\s*/g, "")
			text = text.toLowerCase()
			return text
		}
		return Promise.resolve(code(imgPath))
	}, err => {
		return Promise.reject(err)
	})
}
