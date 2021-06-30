<template>
	<view>
		<!-- 提示 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<view class="example-body">
			<uni-nav-bar left-icon="arrowleft" right-text="新增" left-text="" title="收货地址" @clickLeft="back"
				@clickRight="toAddSite">
			</uni-nav-bar>
		</view>
		<view>
			<view class="page-box" v-if="locationData">
				<view>
					<view class="centre">
						<image src="https://cdn.uviewui.com/uview/template/taobao-order.png" mode=""></image>
						<view class="explain">
							暂无收货地址
							<view class="tips">点击右上方添加地址</view>
						</view>
						<!-- <view class="btn" @click="goShopping">去逛逛</view> -->
					</view>
				</view>
			</view>
			<view v-else>
				<view class="item" v-for="(res, index) in siteList" :key="res.id" @click="confirmOrderPage(index)">
					<view class="top">
						<view class="name">{{ res.username }}</view>
						<view class="phone">{{ res.phoneNumber }}</view>
						<view class="tag" v-if="res.defaultStatus">
							<text style="background: red;">默认</text>
						</view>
					</view>
					<view class="bottom">
						<text>{{res.address}}</text>
						<view>
							<u-icon name="edit-pen" @click="editlocation(index)" :size="40" color="#2979ff"
								style="margin-right: 15rpx;"></u-icon>
							<u-icon name="trash-fill" @click="dellocation(index)" :size="40" color="#ff5c5c"></u-icon>
						</view>
					</view>
				</view>

			</view>
			<u-modal v-model="locationModal" title="编辑地址" @confirm="locationModalconfirm" @cancel="locationModalcancel"
				:show-cancel-button='true' :content="content">
				<u-form :model="location" ref="edituForm">
					<u-form-item style="padding: 5px 10px;">
						<view class="u-config-item">
							<u-input :border="border" type="input" disabled v-model="location.city"
								@click="defaultRegionChange" placeholder="选择城市"></u-input>
							<!-- <u-subsection :list="['广东-深圳-宝安', '海南-三亚-海棠']" @change="defaultRegionChange"></u-subsection> -->
						</view>
					</u-form-item>
					<u-form-item style="padding: 5px 10px;" :label-position="labelPosition" label="">
						<u-input :border="border" type="input" v-model="location.name" placeholder="名称"></u-input>
					</u-form-item>
					<u-form-item style="padding: 5px 10px;" :label-position="labelPosition" label="">
						<u-input :border="border" type="input" v-model="location.phone" placeholder="手机号"></u-input>
					</u-form-item>
					<u-form-item style="padding: 5px 10px;" :label-position="labelPosition" label="">
						<u-input :border="border" type="input" v-model="location.location" placeholder="地址"></u-input>
					</u-form-item>
					<u-form-item style="padding: 5px 10px;" :label-position="labelPosition" label="默认地址" prop="remember"
						label-width="150">
						<u-switch v-model="location.remember" slot="right"></u-switch>
					</u-form-item>
				</u-form>
				<u-picker mode="region" v-model="pickershow" :defaultRegion="defaultRegion" @confirm="confirmlocation"
					:range-key="rangKey"></u-picker>
			</u-modal>
			<u-modal v-model="addlocationModal" title="新增地址" @confirm="addlocationModalconfirm"
				@cancel="addlocationModalcancel" :show-cancel-button='true' :content="content">
				<u-form :model="addlocation" ref="adduForm">
					<u-form-item style="padding: 5px 10px;">
						<view class="u-config-item">
							<u-input :border="border" type="input" disabled v-model="addlocation.city"
								@click="adddefaultRegionChange" placeholder="选择城市"></u-input>
							<!-- <u-subsection :list="['广东-深圳-宝安', '海南-三亚-海棠']" @change="defaultRegionChange"></u-subsection> -->
						</view>
					</u-form-item>
					<u-form-item style="padding: 5px 10px;" :label-position="labelPosition" label="">
						<u-input :border="border" type="input" v-model="addlocation.name" placeholder="联系人"></u-input>
					</u-form-item>
					<u-form-item style="padding: 5px 10px;" :label-position="labelPosition" label="">
						<u-input :border="border" type="input" v-model="addlocation.phone" placeholder="联系电话"></u-input>
					</u-form-item>
					<u-form-item style="padding: 5px 10px;" :label-position="labelPosition" label="">
						<u-input :border="border" type="input" v-model="addlocation.location" placeholder="详细地址">
						</u-input>
					</u-form-item>
					<u-form-item style="padding: 5px 10px;" :label-position="labelPosition" label="默认地址" prop="remember"
						label-width="150">
						<u-switch v-model="addlocation.remember" slot="right"></u-switch>
					</u-form-item>
				</u-form>
				<u-picker mode="region" v-model="addpickershow" :defaultRegion="adddefaultRegion"
					@confirm="addconfirmlocation" :range-key="rangKey"></u-picker>
			</u-modal>
		</view>
	</view>
</template>

<script>
	import commonUtils from '../../common/common.js'
	export default {
		data() {
			return {
				locationData: false,
				siteList: [],
				locationModal: false,
				pickershow: false,
				addlocationModal: false,
				addpickershow: false,
				rangKey: 'name',
				defaultRegion: ['广东省', '深圳市', '宝安区'],
				adddefaultRegion: ['广东省', '深圳市', '宝安区'],
				labelPosition: 'left',
				location: {
					name: '',
					phone: '',
					location: '',
					city: '',
					remember: false,
					id: ''
				},
				addlocation: {
					name: '',
					phone: '',
					location: '',
					city: '',
					remember: false
				},
				content: '',
				border: false,
				navigatorStatus: false
			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			if (option.flag) {
				this.navigatorStatus = true
			}
			this.getData();
		},
		methods: {
			back() {
				//返回
				uni.navigateBack({
					delta: 1
				})
			},
			editlocation(index) {
				//编辑
				this.locationModal = true
				this.defaultRegion = this.siteList[index].address.split(' ')[0].split('-')
				let citys = this.siteList[index].address.split(' ')[0].split('-')
				this.location.city = citys[0] + '-' + citys[1] + '-' + citys[2]
				this.location.name = this.siteList[index].username
				this.location.phone = this.siteList[index].phoneNumber
				this.location.id = this.siteList[index].id
				this.location.location = this.siteList[index].address.split(' ')[1]
				let remember = false
				if (this.siteList[index].defaultStatus == 1) {
					remember = true
				} else {
					remember = false
				}
				this.location.remember = remember
			},
			dellocation(index) {
				// 删除
				let _this = this
				if (confirm('确定要删除吗？') == true) {
					_this.$u.get('store-api/v1/store/address/delete', {
						id: _this.siteList[index].id
					}).then(res => {
						console.log(res)
						if (res.code == 200) {
							console.log(res);
							_this.$refs.uToast.show({
								title: '删除成功'
							})
							_this.getData();
						} else {
							_this.$refs.uToast.show({
								title: res.message
							})
						}
					})
					return true;
				} else {
					return false;
				}
			},
			locationModalconfirm() {
				//确定
				let _this = this
				_this.locationModal = true //打开模态框
				if (_this.location.city == '') {
					_this.$refs.uToast.show({
						title: '请选择城市'
					})
					return
				}
				if (_this.location.name == '') {
					_this.$refs.uToast.show({
						title: '请输入联系人'
					})
					return
				}
				if (_this.location.phone == '') {
					_this.$refs.uToast.show({
						title: '请输入手机号'
					})
					return
				}
				let phoneCheckResult = commonUtils.checkPhone(_this.location.phone)
				if (!phoneCheckResult) {
					_this.$refs.uToast.show({
						title: '请输入合法手机号'
					})
					return
				}
				if (_this.location.location == '') {
					_this.$refs.uToast.show({
						title: '请输入详细地址'
					})
					return
				}
				let location = 0
				if (_this.location.remember) {
					location = 1
				} else {
					location = 0
				}
				_this.$u.post('store-api/v1/store/address/save', {
					address: _this.location.city + ' ' + _this.location.location,
					username: _this.location.name,
					phoneNumber: _this.location.phone,
					id: _this.location.id,
					defaultStatus: location
				}).then(res => {
					console.log(res)
					if (res.code == 200) {
						console.log(res);
						_this.$refs.uToast.show({
							title: '编辑成功'
						})
						this.locationModal = false //打开模态框
						_this.getData();
					} else {
						_this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			},
			addlocationModalconfirm() {
				//新增确定
				let _this = this
				_this.addlocationModal = true //打开模态框
				if (_this.addlocation.city == '') {
					_this.$refs.uToast.show({
						title: '请选择城市'
					})
					return
				}
				if (_this.addlocation.name == '') {
					_this.$refs.uToast.show({
						title: '请输入联系人'
					})
					return
				}
				if (_this.addlocation.phone == '') {
					_this.$refs.uToast.show({
						title: '请输入手机号'
					})
					return
				}
				let phoneCheckResult = commonUtils.checkPhone(_this.addlocation.phone)
				if (!phoneCheckResult) {
					_this.$refs.uToast.show({
						title: '请输入合法手机号'
					})
					return
				}
				if (_this.addlocation.location == '') {
					_this.$refs.uToast.show({
						title: '请输入详细地址'
					})
					return
				}
				let addlocation = 0
				if (_this.addlocation.remember) {
					addlocation = 1
				} else {
					addlocation = 0
				}
				_this.$u.post('store-api/v1/store/address/save', {
					address: _this.addlocation.city + ' ' + _this.addlocation.location,
					username: _this.addlocation.name,
					phoneNumber: _this.addlocation.phone,
					defaultStatus: addlocation
				}).then(res => {
					console.log(res)
					if (res.code == 200) {
						console.log(res);
						_this.$refs.uToast.show({
							title: '新增成功'
						})
						this.addlocationModal = false //关闭模态框
						_this.getData();
						_this.addlocation.name = ''
						_this.addlocation.phone = ''
						_this.addlocation.location = ''
						_this.addlocation.city = ''
						_this.addlocation.remember = false
					} else {
						_this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			},
			locationModalcancel() {
				//取消
			},
			addlocationModalcancel() {
				//新增取消
			},
			defaultRegionChange(index) {
				// this.defaultRegion = index == 0 ? ['广东省', '深圳市', '宝安区'] : ['海南省', '三亚市', '海棠区'];
				this.pickershow = true;
			},
			adddefaultRegionChange() {
				this.addpickershow = true;
			},
			confirmlocation(e) {
				this.location.city = e.province.label + '-' + e.city.label + '-' + e.area.label
				this.defaultRegion = this.location.city.split('-')
			},
			addconfirmlocation(e) {
				this.addlocation.city = e.province.label + '-' + e.city.label + '-' + e.area.label
				this.adddefaultRegion = this.addlocation.city.split('-')
			},
			getData() {
				let _this = this
				_this.$u.get('store-api/v1/store/address/list', {

				}).then(res => {
					console.log(res, 'store-api/v1/store/add')
					if (res.code == 200) {
						console.log(res);
						_this.siteList = res.data
						if (res.data == '') {
							_this.locationData = true
						} else {
							_this.locationData = false
						}
					} else {
						_this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			},
			toAddSite() {
				// uni.navigateTo({
				// 	url: './locationAddPage'
				// });
				this.addlocationModal = true
			},
			confirmOrderPage(index) {
				if (this.navigatorStatus) {
					this.$store.commit('updateAddressInfo', this.siteList[index])
					uni.navigateBack({
						delta: 1
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		background: #fff;
	}

	.item {
		padding: 40rpx 20rpx;

		.top {
			display: flex;
			font-weight: bold;
			font-size: 34rpx;

			.phone {
				margin-left: 60rpx;
			}

			.tag {
				display: flex;
				font-weight: normal;
				align-items: center;

				text {
					display: block;
					width: 60rpx;
					height: 34rpx;
					line-height: 34rpx;
					color: #ffffff;
					font-size: 20rpx;
					border-radius: 6rpx;
					text-align: center;
					margin-left: 30rpx;
					background-color: rgb(49, 145, 253);
				}

				.red {
					background-color: red
				}
			}
		}

		.bottom {
			display: flex;
			margin-top: 20rpx;
			font-size: 28rpx;
			justify-content: space-between;
			color: #999999;
		}
	}

	.addSite {
		display: flex;
		justify-content: space-around;
		width: 600rpx;
		line-height: 100rpx;
		position: absolute;
		bottom: 30rpx;
		left: 80rpx;
		background-color: red;
		border-radius: 60rpx;
		font-size: 30rpx;

		.add {
			display: flex;
			align-items: center;
			color: #ffffff;

			.icon {
				margin-right: 10rpx;
			}
		}
	}

	.centre {
		text-align: center;
		padding: 200rpx 0;
		font-size: 32rpx;

		image {
			width: 164rpx;
			height: 164rpx;
			border-radius: 50%;
			margin-bottom: 20rpx;
		}

		.tips {
			font-size: 24rpx;
			color: #999999;
			margin-top: 20rpx;
		}

		.btn {
			margin: 80rpx auto;
			width: 200rpx;
			border-radius: 32rpx;
			line-height: 64rpx;
			color: #ffffff;
			font-size: 26rpx;
			background: linear-gradient(270deg, rgba(249, 116, 90, 1) 0%, rgba(255, 158, 1, 1) 100%);
		}
	}
</style>
