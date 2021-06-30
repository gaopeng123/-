<template>
	<view class="">
		<!-- 提示 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<view class="example-body">
			<uni-nav-bar left-icon="arrowleft" right-text="" left-text="" title="重置密码" @clickLeft="back"
				@clickRight="" />
		</view>
		<view class="contentTitle">
			<view>要货通系统</view>
			<view style="font-weight: 300;color: #999;font-size: 14px;margin-top: 20rpx;">找回密码</view>
		</view>
		<u-form style="padding: 40rpx;margin-top: 20rpx;" :model="model" :rules="rules" ref="uForm" :errorType="toast">
			<u-form-item :label-position="labelPosition" prop="name" :leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="phone">
				<u-input :border="border" type="input" v-model="model.name" placeholder="请输入注册时的手机号"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" prop="code" :leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="checkmark-circle">
				<u-input :border="border" placeholder="图形验证码" v-model="model.imgtext" type="text"></u-input>
				<u-image class="logoimg" width="260rpx" height="76rpx" @click="imgData" :src="model.img"></u-image>
			</u-form-item>
			<u-form-item :label-position="labelPosition" prop="password" :leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="lock-open">
				<u-input :password-icon="true" :border="border" type="password" v-model="model.password" placeholder="请输入密码"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" prop="newPassword" :leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="lock-open">
				<u-input :password-icon="true" :border="border" type="password" v-model="model.newPassword" placeholder="请输入确认密码"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" prop="code" :leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="checkmark-circle">
				<u-input :border="border" placeholder="验证码" v-model="model.code" type="text"></u-input>
				<u-button slot="right" type="success" size="mini" :disabled="disabledCode" @click="getCode">{{codeTips}}</u-button>
			</u-form-item>
			<!-- <view class="" style="width: 100%;height: 80rpx;margin-top: 20rpx;">
				<view style="float: right;color: #029789;">忘记密码?</view>
			</view> -->
			<view style="margin-top: 100rpx;">
				<u-button @click="submit" type="primary">重置新密码</u-button>
			</view>
		</u-form>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				model:{
					name:'',
					password:'',
					code:'',
					newPassword:'',
					imgtext:'',
					img:'http://192.168.18.101:8893/rest/store/captcha',
				},
				disabledCode:false,
				dateTime :new Date().getTime(),
				labelPosition: 'left',
				border: false,
				toast: ['toast'],
				rules: {
					name: [
						{
							required: true,
							message: '请输入手机号',
							trigger: 'blur' ,
						}, {
						validator: (rule, value, callback) => {
							// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
							return this.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ['change', 'blur'],
					}
					],
					password:[
						{
							required: true,
							message: '请输入确认密码',
							trigger: ['change','blur'],
						}
					],
					newPassword:[
						{
							required: true,
							message: '请输入新密码',
							trigger: ['change','blur'],
						}
					],
					code:[
						{
							required: true,
							message: '请输入密码',
							trigger: ['change','blur'],
						}
					],
				},
				codeTips: '获取验证码',
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods:{
			back() {
				//返回
				uni.navigateBack({
					delta: 1
				})
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.$u.get('rest/store/forget', {
							phone:this.model.phone,
							password:this.model.password,
							repass:this.model.newPassword,
							smscode:this.model.code,
							code:_this.model.imgtext
						}).then(res => {
							console.log(res)
							if (res.code == 200) {
								
							}else{
								
							}
						})
					} else {
						console.log('验证失败');
					}
				});
			},
			//验证码
			getCode(){
				let _this = this
				console.log(_this.dateTime)
				if(_this.$u.test.mobile(_this.model.name)){
					_this.$u.get('rest/store/new/forgetSmsVerifyCode', {
						phone:_this.model.name,
						code:_this.model.imgtext,
						uid:_this.dateTime
					}).then(res => {
						console.log(res)
						if (res.code == 1001) {
							_this.$refs.uToast.show({
								title: res.message
							})
							_this.disabledCode = true
							let time = 6
							console.log(time)
							let timeOut = setInterval(function(){
								time -- 
								_this.codeTips = time+'获取验证码'
								console.log(time)
								if(time == 0){
									clearInterval(timeOut)
									_this.codeTips = '获取验证码'
									_this.disabledCode = false
								}
							},1000)
						}else{
							console.log(321)
						}
					})
				}else{
					this.$refs.uToast.show({
						title: '手机号有误！'
					})
				}
			},
			//获取图片验证码
			imgData(){
				let _this = this
				let images = _this.$store.state.$baseUrl+'/rest/store/captcha?uid='+_this.dateTime+'&t='+new Date().getTime()
				_this.model.img = images
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		// background: #f9f9f9;
	}
	.contentTitle{
		margin-top: 100rpx;
		width: 100%;
		text-align: center;
		margin-bottom: 10px;
		font-weight: 300;
		font-size: 30px;
		color: #000;
	}
</style>
