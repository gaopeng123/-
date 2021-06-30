// let wx = require('jweixin-module')  


import Moment from 'moment'


/**
 * 判断是否为合法手机号
 * @param {Object} phoneNumber 手机号
 */
function checkPhone(phoneNumber) {
	if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phoneNumber))) {

		return false;
	}
	return true
}
// 时间转换
function dataTime(fmt) { //author: meizz   
	let momentInstacne = new Moment(new Date(fmt)).format('YYYY-MM-DD HH:mm:ss')
	return momentInstacne;
}

/**
 * 判断值是否为空
 * @param {Object} value
 */
function isEmpty(value) {
	return value == null || value == undefined || (value + '').length == 0
}


/**
 * 微信公众号 微信内调起微信支付
 * @param {Object} params 支付参数
 */
function wechatPay(params) {

	return new Promise((resolve, reject) => {
		WeixinJSBridge.invoke(
			'getBrandWCPayRequest', params,
			function(res) {
				if (res.err_msg == "get_brand_wcpay_request:ok") {
					resolve()
				} else {
					reject(res.err_msg)
				}
			});
	})

}
/**
 * @param {Object} params js-api发起微信支付
 */
function wechatPayForH5(params) {

	return new Promise((resolve, reject) => {
		wx.chooseWXPay({
			timestamp: 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
			nonceStr: '', // 支付签名随机串，不长于 32 位
			package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
			signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
			paySign: '', // 支付签名
			success: function(res) {
				resolve(res)
			}
		});
	})
}



function wechatJsApiInit(params) {
	console.log('wechat params...')
	console.log(params)
	return new Promise((resolve, reject) => {
		wx.config({
			// debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			// appId: '', // 必填，公众号的唯一标识
			// timestamp: '', // 必填，生成签名的时间戳
			// nonceStr: '', // 必填，生成签名的随机串
			// signature: '',// 必填，签名
			...params,
			jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'closeWindow',
				'showMenuItems', 'hideMenuItems'
			] // 必填，需要使用的JS接口列表
		});

		wx.ready(function() {
			resolve()
			// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		});
		wx.error(function(res) {
			reject(res)
			// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
		});

	})
}

function closeWindow() {
	wx.closeWindow();

}

function hideMenuItems(menuList) {
	wx.hideMenuItems({
		menuList, // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
		success: function() {
			console.log('隐藏菜单成功')
		},
		fail: function(err) {
			console.log(err)
			console.log('隐藏菜单失败')
		}
	})
}

function showMenuItems(menuList) {
	wx.showMenuItems({
		menuList, // 要显示的菜单项，所有menu项见附录3
		success: function() {
			console.log('展示菜单成功')
		},
		fail: function(err) {
			console.log(err)
			console.log('展示菜单失败')
		}
	});
}


function getParamsFormUrl(urlInfo) {
	let queryUrl = urlInfo.split('?')[1]
	let params = {}
	try {
		let queryListUrl = queryUrl.split('&')
		for (let item of queryListUrl) {
			let queryMap = item.split("=")
			params[queryMap[0]] = queryMap[1]
		}
		// format data

		return params
	} catch (e) {

		return params
	}
}

function formatData(objectInfo) {
	Object.keys(objectInfo).forEach(keyItem => {
		objectInfo[keyItem] = objectInfo[keyItem].split('#')[0]
	})
}

function onWechatBrowser() {
	let ua = navigator.userAgent.toLowerCase();
	let isWeixin = ua.indexOf('micromessenger') != -1;
	if (isWeixin) {
		return true;
	} else {
		return false;
	}
}

function updateAppMessageShareData(params) {
	console.log('设置分享参数!')
	console.log(params)
	return new Promise((resolve, reject) => {
		wx.updateAppMessageShareData({
			// title: '', // 分享标题
			// desc: '', // 分享描述
			// link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			// imgUrl: '', // 分享图标
			...params,
			success: function() {
				// 设置成功
				resolve('success')
			},
			fail: function(err) {
				reject(err)
			}
		})
	})
}

function updateTimelineShareData(params) {
	console.log('设置朋友圈分享参数')
	console.log(params)
	return new Promise((resolve, reject) => {
		wx.updateTimelineShareData({
			// title: '', // 分享标题
			// link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			// imgUrl: '', // 分享图标
			...params,
			success: function() {
				// 设置成功
				resolve('success')
			},
			fail: function(err) {
				reject(err)
			}
		})
	})
}





export default {
	checkPhone,
	onWechatBrowser,
	getParamsFormUrl,
	wechatPay,
	wechatJsApiInit,
	updateAppMessageShareData,
	updateTimelineShareData,
	closeWindow,
	hideMenuItems,
	showMenuItems,
	isEmpty,
	dataTime

}
