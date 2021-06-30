<template>
	<view class="contentPage">
		<!-- 提示 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<view class="login-wrap">
			<view style="text-align: center;">
				<u-image class="logoimg" width="120rpx" height="120rpx" :src="src"></u-image>
			</view>
			
			<u-form style="margin-top: 80rpx" :model="model" :rules="rules" ref="uForm" :errorType="toast">
				<u-form-item :label-position="labelPosition" label="用户名" label-width="150" prop="name"
					:leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="phone">
					<u-input :border="border" type="input" v-model="model.name" placeholder="请输入手机号"></u-input>
				</u-form-item>
				<u-form-item :label-position="labelPosition" label="密码" label-width="150" prop="password"
					:leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="lock-open">
					<u-input :password-icon="true" :border="border" type="password" v-model="model.password"
						placeholder="请输入密码"></u-input>
				</u-form-item>
				<!-- <u-form-item :label-position="labelPosition" label="验证码" prop="code" label-width="150"
					:leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="checkmark-circle">
					<u-input :border="border" placeholder="请输入验证码" v-model="model.code" type="text"></u-input>
					<u-button slot="right" type="success" size="mini" @click="getCode">{{codeTips}}</u-button>
				</u-form-item> -->
				<view class="" style="width: 100%;height: 80rpx;margin-top: 20rpx;">
					<view style="float: right;color: #029789;" @click="passwordPage">忘记密码?</view>
				</view>
				<view>
					<u-button @click="submit" type="error">登录</u-button>
				</view>
			</u-form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src:'../../static/uview/example/enquiryimg.png',
				labelPosition: 'left',
				border: false,
				toast: ['toast'],
				model: {
					name: '',
					password: '',
					code: '',

				},
				rules: {
					name: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur',
					}, {
						validator: (rule, value, callback) => {
							// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
							return this.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ['change', 'blur'],
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: ['change', 'blur'],
					}],
					// code: [{
					// 	required: true,
					// 	message: '请输入密码',
					// 	trigger: ['change', 'blur'],
					// }],
				},
				codeTips: '获取验证码',
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			submit() {
				let _this = this
				_this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log(valid, '验证通过');
						_this.$u.get('/rest/login', {
							phone: _this.model.name,
							// phone: '17558411113',
							pwd: _this.model.password,
						}).then(res => {
							console.log(res)
							if (res.flag == 1) {
								console.log(res);
								uni.setStorageSync('token',res.data.token);
								_this.$refs.uToast.show({
									title: res.message
								})

								uni.switchTab({
									url: './home'
								})
							}else{
								_this.$refs.uToast.show({
									title: res.message
								})
							}
						}).catch(res => {
							console.log(res,)
						});
					} else {
						console.log('验证失败');
					}
				});
			},
			passwordPage() {
				uni.navigateTo({
					url: './loginPassword'
				});
			}
		},
	}
</script>

<style>
	page {
		height: 100%;
	}
	.logoimg{
		text-align: center;
		display: block;
		margin: 0 auto;
		margin-top: 20rpx;
	}
	.contentPage {
		width: 100%;
		height: 100%;
		background-image: url(http://store.yunqixinxi.com/static/start/layui/images/loginBgImg.png);
	}

	.login-wrap {
		width: 85%;
		height: 400px;
		background: url(http://store.yunqixinxi.com/static/start/layui/images/login-bg.jpg);
		padding: 0 20px;
		background-position: 50% -50%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
