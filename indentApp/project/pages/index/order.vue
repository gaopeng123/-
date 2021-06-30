<template>
	<view>
		<!-- 提示 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<u-popup v-model="show" mode="right" length="85%" :mask-close-able='false'>
			<view style="background: #f9f9f9;height: 100%;">
				<view class="popupConter" style="background: #fff;">
					<view @click="cancelTopBtn">取消</view>
					<view style="font-size: 16px;color: rgb(88,88,88);">取消</view>
					<view @click="confirmTopBtn">确定</view>
				</view>
				<view>
					<u-cell-group>
						<u-cell-item style="padding: 10px;" @click="showpopup = true" title="批量下单"></u-cell-item>
					</u-cell-group>
				</view>
				<view class="u-m-t-20">
					<u-cell-group>
						<u-cell-item style="padding: 10px;" @click="beginshowTime = true" title="开始时间">{{beginshowTimeVal}}</u-cell-item>
					</u-cell-group>
					<u-cell-group>
						<u-cell-item style="padding: 10px;" @click="endshowTime = true" title="结束时间">{{endshowTimeVal}}</u-cell-item>
					</u-cell-group>
					<u-picker v-model="beginshowTime" mode="time" @confirm="beginShowTime"></u-picker>
					<u-picker v-model="endshowTime" mode="time" @confirm="endShowTime"></u-picker>
				</view>
				<u-popup v-model="showpopup" mode="right" length="100%" :closeable='false' :mask-close-able='false'>
					<view class="popupConter" style="background: #fff;">
						<view @click="showpopup = false"><u-icon name="arrow-left" size="18px"></u-icon></view>
						<view style="font-size: 16px;color: rgb(88,88,88);">订单状态</view>
						<view></view>
					</view>
					<view class="showpopupList">
						<view @click="showpopupListBtn('')">全部</view>
						<view @click="showpopupListBtn(1)">已发货</view>
						<view @click="showpopupListBtn(0)">未发货</view>
					</view>
					
				</u-popup>
			</view>
		</u-popup>
		<view class="wrap">
			<view class="example-body">
				<uni-nav-bar left-icon="arrowleft" right-text="筛选" left-text="" title="全部订单" @clickLeft="back"
					@clickRight="rightlist" />
			</view>
			<!-- :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" -->
			<swiper class="swiper-box">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page-box" v-if="orderListData">
							<view>
								<view class="centre">
									<image src="https://cdn.uviewui.com/uview/template/taobao-order.png" mode=""></image>
									<view class="explain">
										购物车空荡荡的
										<view class="tips">再忙，也要挑点宝贝哦</view>
									</view>
									<view class="btn" @click="goShopping">去逛逛</view>
								</view>
							</view>
						</view>
						<view class="page-box" v-else>
							<view class="order" @click="orderListPage(index)" v-for="(res, index) in orderList" :key="index">
								<view class="top">
									<view class="left">
										<u-icon name="home" :size="30" color="rgb(94,94,94)"></u-icon>
										<view class="store">{{ res.buserFullName }}</view>
										<u-icon name="arrow-right" color="rgb(203,203,203)" :size="26"></u-icon>
									</view>
									<view class="right">{{res.orderStatus == 0 ? '未发货':'已发货'}}</view>
								</view>
								<view class="item">
									<view class="content">
										<!-- <view>
											配送方式：<text>{{res.addressInfo}}</text>
										</view>
										<view>
											付款方式：<text>{{res.addressInfo}}</text>
										</view> -->
										<view>
											下单时间：<text>{{$dataTime(res.createTime)}}</text>
										</view>
									</view>
								</view>
								<u-line class="u-line"></u-line>
								<view class="total">
									订单金额:
									<text class="total-price">
										<!-- ￥{{ priceInt(totalPrice(res.goodsList)) }}.
										<text class="decimal">{{ priceDecimal(totalPrice(res.goodsList)) }}</text> -->
										￥{{res.inputName}}.
										<text class="decimal">{{res.orderTotalPrice}}</text>
									</text>
								</view>
								<view class="bottom">
									<!-- <view class="more">
										<u-icon name="more-dot-fill" color="rgb(203,203,203)"></u-icon>
									</view>
									<view class="logistics btn">查看物流</view>
									<view class="exchange btn">卖了换钱</view> -->
									<view class="" style="margin-left: -10rpx;">运费:<text>0</text></view>
									<view class="evaluate btn" style="margin-right: -10rpx;" @click.stop="payone(index)">再买一次</view>
								</view>
							</view>
							<u-loadmore :status="loadStatus[0]" :icon-type="iconType" :load-text="loadText"  bgColor="#f2f2f2"></u-loadmore>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	// import Moment from 'moment'
	// import common from '../../common/common.js'
	export default {
		components: {},
		data() {
			return {
				show: false,
				showpopup:false,
				beginshowTime:false,
				endshowTime:false,
				beginshowTimeVal:'',
				endshowTimeVal:'',
				orderListData:false,
				orderList: [
					// {
					// 	addressInfo: "我是地址信息",
					// 	brandCode: "830131184402038784",
					// 	buserCode: "0111",
					// 	buserFullName: "济南客户",
					// 	createTime: 1624586749925,
					// 	detailList: [
					// 		{puserCode: "LS678678", puserFullName: "小天鹅", kuserCode: null, kuserFullName: null, billUnitName: "只"},
					// 		{puserCode: "LS678679", puserFullName: "癞蛤蟆", kuserCode: null, kuserFullName: null, billUnitName: "只"}
					// 	],
					// 	billUnitName: "只",
					// 	kuserCode: null,
					// 	kuserFullName: null,
					// 	puserCode: "LS678678",
					// 	puserFullName: "小天鹅",
					// 	puserNumber: 15,
					// 	puserPrice: null,
					// 	billUnitName: "只",
					// 	kuserCode: null,
					// 	kuserFullName: null,
					// 	puserCode: "LS678679",
					// 	puserFullName: "癞蛤蟆",
					// 	puserNumber: 22,
					// 	puserPrice: null,
					// 	id: 1408245014131249200,
					// 	inputName: null,
					// 	invoiceStatus: true,
					// 	kuserCode: null,
					// 	kuserFullName: null,
					// 	logisticalInfo: null,
					// 	logisticalNumber: null,
					// 	orderStatus: 0,
					// 	remarkInfo: null,
					// 	settleBuserCode: "0111",
					// 	settleBuserFullName: "济南客户",
					// 	storeCode: "10000094",
					// 	summary: null,
					// }
				],
				dataList: [
				],
				list: [{
						name: '待付款'
					},
					{
						name: '待发货'
					},
					{
						name: '待收货'
					},
					{
						name: '待评价',
						count: 12
					}
				],
				current: 0,
				currentCount:1,
				// swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,
				loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore'],
				iconType: 'flower',
				loadText: {
					loadmore: '加载更多...',
					loading: '努力加载中...',
					nomore: '实在没有了'
				},
				screenList:{
					orderstaus:'',
					beginshowTime:'',
					endShowTime:''
				}
			};
		},
		onLoad() {
			this.getOrderList(0);
		},
		computed: {
			// 价格小数
			priceDecimal() {
				return val => {
					if (val !== parseInt(val)) return val.slice(-2);
					else return '00';
				};
			},
			// 价格整数
			priceInt() {
				// return val => {
				// 	if (val !== parseInt(val)) return val.split('.')[0];
				// 	else return val;
				// };
			}
		},
		methods: {
			beginShowTime(e){
				//时间
				console.log(e)
				this.beginshowTimeVal = e.year+'-'+e.month+'-'+e.day
			},
			endShowTime(e){
				//时间
				console.log(e)
				this.endshowTimeVal = e.year+'-'+e.month+'-'+e.day
			},
			confirmTopBtn(){
				//确认
				this.show = false
				this.screenList.beginshowTime = this.beginshowTimeVal+' '+'00:00:00'
				this.screenList.endShowTime = this.endshowTimeVal+' '+'00:00:00'
				this.orderList = []
				this.currentCount = 1
				this.getOrderList(0);
			},
			cancelTopBtn(){
				//取消
				this.show = false
				this.beginshowTimeVal = ''
				this.endshowTimeVal = ''
			},
			goShopping(){
				//去购物
				uni.navigateTo({
					url: 'classifyList'
				});
			},
			orderListPage(index){
				//跳转到详情
				uni.navigateTo({
					// url: './classifyList?id='+_this.list[index].key
					url:'./orderList?list='+JSON.stringify(this.orderList[index])
				});
			},
			payone(index){
				//再买一次
				var orderListData = []
				for(var i=0;i<this.orderList[index].detailList.length;i++){
					let orderLists = {}
					orderLists.baseUnit = this.orderList[index].detailList[i].billUnitName
					orderLists.materialName = this.orderList[index].detailList[i].puserFullName
					orderLists.materialCode = this.orderList[index].detailList[i].puserCode
					orderLists.priceNum = this.orderList[index].detailList[i].puserNumber
					orderLists.clientRealPrice = this.orderList[index].detailList[i].puserPrice
					orderLists.standard = this.orderList[index].detailList[i].standard
					orderListData.push(orderLists)
				}
				uni.navigateTo({
					url:'./confirmOrder?list='+JSON.stringify(orderListData)+'&array=1'
				});
			},
			back() {
				//返回
				uni.navigateBack({
					delta: 1
				})
			},
			rightlist() {
				//点击筛选按钮
				console.log(321)
				this.show = true
			},
			showpopupListBtn(data){
				this.show = false
				this.showpopup = false
				// this.beginshowTimeVal = ''
				// this.endshowTimeVal = ''
				this.screenList.orderstaus = data
				this.orderList = []
				this.currentCount = 1
				this.getOrderList(0);
			},
			reachBottom() {
				// 此tab为空数据
				let _this = this
				// if (_this.current != 2) {
					_this.loadStatus.splice(_this.current, 1, "loading")
					setTimeout(() => {
						_this.getOrderList(_this.currentCount);
					}, 1200);
					
				// }
			},
			// 页面数据
			getOrderList(idx) {
				let _this = this
				let index = _this.$u.random(0, _this.dataList.length - 1);
				_this.$u.get('chain-api/v1/ishop/info/order/query', {
					page:_this.currentCount,
					size:'5',
					startDate:_this.screenList.beginshowTime,
					endDate:_this.screenList.endShowTime,
					orderStatus:_this.screenList.orderstaus
				}).then(res => {
					if (res.code == 200) {
						if(res.data != ''){
							for(var i=0;i<res.data.length;i++){
								_this.orderList.push(res.data[i]);
							}
							_this.currentCount++
						}else{
							_this.$refs.uToast.show({
								title: '暂无更多数据'
							})
						}
						
						if(_this.orderList == ''){
							_this.orderListData = true
						}else{
							_this.orderListData = false
						}
					}else{
						_this.$refs.uToast.show({
							title: res.message
						})
					}
				})
				_this.loadStatus.splice(_this.current, 1, "loadmore")
				
			},
			// 总价
			totalPrice(item) {
				// let price = 0;
				// item.map(val => {
				// 	price += parseFloat(val.price);
				// });
				// return price.toFixed(2);
			}
			// 总件数
			// totalNum(item) {
			// 	let num = 0;
			// 	item.map(val => {
			// 		num += val.number;
			// 	});
			// 	return num;
			// },
			// tab栏切换
			// change(index) {
			// 	this.swiperCurrent = index;
			// 	this.getOrderList(index);
			// },
			// transition({
			// 	detail: {
			// 		dx
			// 	}
			// }) {
			// 	this.$refs.tabs.setDx(dx);
			// },
			// animationfinish({
			// 	detail: {
			// 		current
			// 	}
			// }) {
			// 	this.$refs.tabs.setFinishCurrent(current);
			// 	this.swiperCurrent = current;
			// 	this.current = current;
			// }

		}
	}
</script>

<style lang="scss" scoped>
	// @import '@/common/uni-nvue.scss';
	$nav-height: 30px;

	/* #ifndef APP-NVUE */
	page {
		height: 100%;
		background: #f9f9f9;
	}

	/* #endif */
	.uni-nav-bar-text {
		font-size: $uni-font-size-base;
	}

	.input-uni-icon {
		line-height: $nav-height;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 0;
	}
</style>
<style lang="scss" scoped>
	.order {
		width: 710rpx;
		background-color: #ffffff;
		margin: 20rpx auto;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		font-size: 28rpx;

		.top {
			display: flex;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;

				.store {
					margin: 0 10rpx;
					font-size: 32rpx;
					font-weight: bold;
				}
			}

			.right {
				color: $u-type-warning-dark;
			}
		}

		.item {
			display: flex;
			margin: 20rpx 0 0;

			.left {
				margin-right: 20rpx;

				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 10rpx;
				}
			}

			.content {
				line-height: 60rpx;

				.title {
					font-size: 28rpx;
					line-height: 150rpx;
				}

				.type {
					margin: 10rpx 0;
					font-size: 24rpx;
					color: $u-tips-color;
				}

				.delivery-time {
					color: #e5d001;
					font-size: 24rpx;
				}
			}

			.right {
				margin-left: 10rpx;
				padding-top: 20rpx;
				text-align: right;

				.decimal {
					font-size: 24rpx;
					margin-top: 4rpx;
				}

				.number {
					color: $u-tips-color;
					font-size: 24rpx;
				}
			}
		}

		.total {
			margin-top: 20rpx;
			// text-align: right;
			font-size: 24rpx;

			.total-price {
				font-size: 32rpx;
				color: #f4a52f;
			}
		}

		.bottom {
			display: flex;
			// margin-top: 40rpx;
			padding: 0 10rpx;
			justify-content: space-between;
			align-items: center;

			.btn {
				line-height: 52rpx;
				width: 160rpx;
				border-radius: 26rpx;
				border: 2rpx solid $u-border-color;
				font-size: 26rpx;
				text-align: center;
				color: $u-type-info-dark;
			}

			.evaluate {
				color: $u-type-warning-dark;
				border-color: $u-type-warning-dark;
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

	.wrap {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top));
		width: 100%;
	}

	.swiper-box {
		flex: 1;
	}

	.swiper-item {
		height: 100%;
	}
	.popupConter{
		padding: 0 20rpx;
		color: rgb(192,192,192);
		height: 90rpx;
		font-size: 14px;
		border-bottom: 1px solid #ccc;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-content: center;
		justify-content: space-between;
	}
	.uni-scroll-view-content{
		    background: #f9f9f9;
	}
	u-popup{
		    background: #f9f9f9;
	}
	.showpopupList view{
		height: 80rpx;
		border-bottom: 1px solid #ddd;
		color: #5e5e5e;
		line-height: 80rpx;
		padding-left: 20rpx;
	}
</style>
