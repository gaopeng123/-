<template>
	<view>
		<!-- 提示 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<u-modal :content="content" @confirm="modelBtn" @cancel="modelreturnBtn" ref="uModal" title="修改密码" :show-cancel-button="true" :async-close="true" v-model="show">
			<view v-if="mode == 'center'" style="height: 400rpx;padding: 30px 15px;">
				<view class="close-btn">
					<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
						<u-form-item :label-position="labelPosition" label="旧密码" label-width="150" prop="oldpassword">
							<u-input :border="border" type="password" v-model="model.oldpassword" placeholder="请确认密码"></u-input>
						</u-form-item>
						<u-form-item :label-position="labelPosition" label="密码" label-width="150" prop="password">
							<u-input :password-icon="true" :border="border" type="password" v-model="model.password" placeholder="请输入密码"></u-input>
						</u-form-item>
						<u-form-item :label-position="labelPosition" label="确认密码" label-width="150" prop="rePassword">
							<u-input :border="border" type="password" v-model="model.rePassword" placeholder="请确认密码"></u-input>
						</u-form-item>
					</u-form>
				</view>
			</view>
			<!-- <view class="close-btn" v-if="mode != 'center'">
				<u-button size="medium" @click="show = false;">关闭弹窗</u-button>
			</view> -->
		</u-modal>
		<u-modal v-model="materialModal" title="我的资料" confirm-text="关闭" :content="content">
			<u-form :model="material" :rules="rules" ref="materialForm" :errorType="errorType">
				<u-form-item style="padding: 5px 10px;" :label-position="labelPosition" label="名称:" label-width="150">
					<u-input :border="border" type="input" disabled v-model="material.name" placeholder=""></u-input>
				</u-form-item>
				<u-form-item style="padding: 5px 10px;" :label-position="labelPosition" label="电话:" label-width="150">
					<u-input :border="border" type="input" disabled v-model="material.phone" placeholder=""></u-input>
				</u-form-item>
			</u-form>
		</u-modal>
		<view class="hearder">
			<view class="u-flex u-row-right u-p-t-15" style="width: 100%;">
				<view class="camera u-flex u-row-center">
					<u-icon name="setting-fill" @click="setName" color="#fff" size="45"></u-icon>
				</view>
			</view>
			<view class="u-flex user-box u-p-l-40 u-p-r-20 u-p-b-20">
				<view class="u-m-r-30">
					<u-avatar size="140"></u-avatar>
				</view>
				<view class="u-flex-1">
					<view class="u-font-18 u-p-b-10">{{material.name}}</view>
					<view class="u-font-14">{{material.phone}}</view>
				</view>
			</view>
			<view class="ordertext">
				<view class='ordertextlist'>
					<view class='ordertextlisttext'>在途订单数</view>
					<view class='ordertextlistnum'>{{orderTitleList.shipped}}</view>
				</view>
				<view class='ordertextlist' style="border-left: 1px solid #949494;">
					<view class='ordertextlisttext'>待发货数量</view>
					<view class='ordertextlistnum'>{{orderTitleList.unshipped}}</view>
				</view>
			</view>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item title="订单管理" @click="orderLise">
					<image slot="icon" class="u-cell-icon" src="../../static/uview/example/orderIcon.png" mode="widthFix"></image>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item title="批量下单" @click="orderPlace">
					<image slot="icon" class="u-cell-icon" src="../../static/uview/example/orderIcon.png" mode="widthFix"></image>
				</u-cell-item>
			</u-cell-group>
			<u-cell-group>
				<u-cell-item title="已购商品" @click="orderPlace">
					<image slot="icon" class="u-cell-icon" src="../../static/uview/example/batchIcon.png" mode="widthFix"></image>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item title="地址管理" @click="locationPage">
					<image slot="icon" class="u-cell-icon" src="../../static/uview/example/locationIcon.png" mode="widthFix"></image>
				</u-cell-item>
			</u-cell-group>
			<u-cell-group>
				<u-cell-item title="基本资料" @click='basicsData'>
					<image slot="icon" class="u-cell-icon" src="../../static/uview/example/basicsIcon.png" mode="widthFix"></image>
				</u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					oldpassword:'',
					password: '',
					rePassword: ''
				},
				material:{
					name:'',
					phone:'',
				},
				orderTitleList:{
					shipped:'',
					unshipped:''
				},
				materialModal:false,
				content: '',
				border:false,
				labelPosition: 'left',
				num: 0,
				show: false,
				mode: 'center',
				mask: true, // 是否显示遮罩
				closeable: true,
				closeIconPos: 'top-right',
				errorType: ['message'],
				rules: {
					oldpassword:[
						{
							required: true,
							message: '请输入旧密码',
							trigger: ['change','blur'],
						},
					],
					password: [
						{
							required: true,
							message: '请输入密码',
							trigger: ['change','blur'],
						},
						// {
						// 	// 正则不能含有两边的引号
						// 	pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+\S{5,12}$/,
						// 	message: '需同时含有字母和数字，长度在6-12之间',
						// 	trigger: ['change','blur'],
						// }
					],
					rePassword: [
						{
							required: true,
							message: '请重新输入密码',
							trigger: ['change','blur'],
						},
						{
							validator: (rule, value, callback) => {
								return value === this.model.password;
							},
							message: '两次输入的密码不相等',
							trigger: ['change','blur'],
						}
					],
				}
			};
		},
		onShow() {
			this.userList()
		},
		methods: {
			setName() {
				//设置
				this.show = true
			},
			modelBtn(){
				///确定
				let _this = this
				if(_this.model.oldpassword == ''){
					_this.$refs.uToast.show({
						title: '旧密码不能为空！',
					})
					setTimeout(function(){
						_this.$refs.uModal.clearLoading();
					},1000)
					return
				}
				if(_this.model.password == ''){
					_this.$refs.uToast.show({
						title: '密码不能为空！',
					})
					setTimeout(function(){
						_this.$refs.uModal.clearLoading();
					},1000)
					return
				}
				if(_this.model.password == _this.model.rePassword){
					_this.show = false
					_this.$u.get('rest/editPwd', {
						oldPassword:_this.model.oldpassword,
						password:_this.model.password,
						repassword:_this.model.rePassword
					}).then(res => {
						console.log(res)
						if (res.code == 200) {
							_this.$refs.uToast.show({
								title: '修改成功！',
							})
						}else{
							_this.$refs.uToast.show({
								title: res.message,
							})
						}
					})
					_this.clearFrom()
				}else{
					_this.$refs.uToast.show({
						title: '两次密码不一致！',
						// 如果不传此type参数，默认为default，也可以手动写上 type: 'default'
						// type: 'success', 
						// 如果不需要图标，请设置为false
						// icon: false
					})
					setTimeout(function(){
						_this.$refs.uModal.clearLoading();
					},1000)
				}
			},
			modelreturnBtn(){
				///取消
				this.clearFrom()
				// this.$refs.uForm.setRules(this.rules);
			},
			clearFrom(){
				this.$refs['uForm'].resetFields()//清空form里面的值
			},
			orderLise(){
				//通知
				uni.navigateTo({
					url: './order'
				});
			},
			orderPlace(){
				//批量
				uni.switchTab({
					url: 'classify'
				});
			},
			basicsData(){
				//基本资料
				this.materialModal = true
			},
			locationPage(){
				// 地址管理
				uni.navigateTo({
					url: './location'
				});
			},
			userList(){
				let _this = this
				_this.$u.get('store-api/v1/basic/storeUser/findById', {
					
				}).then(res => {
					console.log(res)
					if (res.code == 200) {
						_this.material.name = res.data.userLoginName
						_this.material.phone = res.data.userPhone
					}else{
						
					}
				})
				_this.$u.get('chain-api/v1/ishop/info/order/query/number', {
					typeStatus:0
				}).then(res => {
					console.log(res)
					if (res.code == 200) {
						_this.orderTitleList.unshipped = res.data
					}else{
						
					}
				})
				_this.$u.get('chain-api/v1/ishop/info/order/query/number', {
					typeStatus:1
				}).then(res => {
					console.log(res)
					if (res.code == 200) {
						_this.orderTitleList.shipped = res.data
					}else{
						
					}
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #f9f9f9;
	}

	.u-flex-1 {
		color: #fff;
	}

	.hearder {
		height: 150px;
		background-color: #888585;
	}

	.u-navbar-fixed {
		background: #303133 !important
	}

	.camera {
		width: 40px;
		/* height: 24px; */

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		/* background-color: #fff; */
	}

	.ordertext {
		width: 100%;
		height: 90rpx;
		background: #7a7777;
	}

	.ordertextlist {
		width: 49%;
		height: 90rpx;
		line-height: 90rpx;
		color: #fff;
		font-size: 14px;
		float: left;
	}

	.ordertextlisttext {
		float: left;
		margin-left: 30rpx;
	}

	.ordertextlistnum {
		float: right;
		margin-right: 30rpx;
	}
	.wrap {
		padding: 30rpx;
	}
	
	.agreement {
		display: flex;
		align-items: center;
		margin: 40rpx 0;
	
		.agreement-text {
			padding-left: 8rpx;
			color: $u-tips-color;
		}
	}
	.u-cell-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 8rpx;
	}
</style>
