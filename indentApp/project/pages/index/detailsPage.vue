<template>
	<view>
		<!-- 提示 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<!-- 软键盘 -->
		<view>
			<u-keyboard :mask="false" tips="请输入数量" mode="number" @cancel="cancelkeyboard" @confirm="confirmkeyboard" :mask-close-able='false'  :dot-enabled="false" @change="valChange" @backspace="backspace" v-model="keyboardShow"></u-keyboard>
		</view>
		<view class="example-body">
			<uni-nav-bar left-icon="arrowleft" right-text="" left-text="" title="商品详情" @clickLeft="back"
				@clickRight="rightlist" />
		</view>
		<view style="height: 100%;overflow: auto;">
			<u-cell-group class="orderListParameter">
				<view>名称：<text>{{list.materialName}}</text></view>
				<view>货号：<text>{{list.materialCode}}</text></view>
				<view>规格：<text style="font-size: 16px;">{{list.standard}}</text></view>
				<view>订货价：<text style="font-size: 16px;color: rgba(255, 158, 1, 1);">￥{{list.clientRealPrice}} </text> / 箱</view>
				<view>零售价：<text style="font-size: 16px;color: rgba(255, 158, 1, 1);">￥{{list.clientDisplayPrice}} </text> / 箱</view>
				<!-- <view>热度：<text style="font-size: 16px;color: rgba(255, 158, 1, 1);">456.00</text></view> -->
			</u-cell-group>
			<u-cell-group class="orderListParameter" style="margin-top: 20rpx;">
				<view>单位</view>
				<view class="boxList">{{list.baseUnit}}</view>
				<view>订货数量</view>
				<view class="input-wrap" style="display: flex;width: 400rpx;height: 60rpx;">
					<u-button @click="countreduce"
						:custom-style="{height: '25px',width:'25px',margin:'0px',padding:'0px'}">-
					</u-button>
					<input class="input" @click="statusChange" disabled v-model="num" type="text" :value="input" />
					<u-button @click="countAdd"
						:custom-style="{height: '25px',width:'25px',margin:'0px',padding:'0px'}">+
					</u-button>
					<!-- <view v-if="numdatanull" class="numdatanull" style="">有</view>
					<view v-else class="numdatanullno" style="">无</view> -->
				</view>
				<view style="color: red;">请按1的基数购买</view>
				<view>合计金额：<text style="font-size: 16px;color: rgba(255, 158, 1, 1);">￥{{totalPrice.price}}</text></view>
			</u-cell-group>
			<u-cell-group class="orderListParameter" style="margin-top: 20rpx;">
				<view>商品名称：<text>{{list.materialName}}</text></view>
				<view>商品编号：<text>{{list.materialCode}}</text></view>
			</u-cell-group>
			<u-cell-group class="orderListParameter" style="position: fixed;bottom: 0px;">
				<view class="listBtn">
					<u-button @click="shoppingBtn" size="default" style="background: #ff0000;color: #FFFFFF;">加入购物车</u-button>
					<u-button @click="purchaseBtn" style="margin-left: 1%;background: #68c8ef;color: #FFFFFF;" size="default">购买商品</u-button>
				</view>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				list:{
					materialName:'',
					materialCode:'',
					standard:'',
					clientRealPrice:'',
					clientDisplayPrice:'',
					baseUnit:''
				},
				input: '1',
				num:1,
				numdatanull:true,
				monery:0,
				keyboardValueNum:'',
				keyboardShow:false,
				listLength:0,
				keyboardValue:''
			}
		},
		computed: {
			totalPrice() {
				var num = 0
				var price = 0
				// for (var i = 0; i < this.goodsList.length; i++) {
				// 	if (this.goodsList[i].flag == 1) {
				// 		num += this.goodsList[i].num
				// 		price += this.goodsList[i].num * this.goodsList[i].monery
				// 	}
				// }
				price += this.$math.multiply(this.num , this.list.clientRealPrice)
				return {
					num,
					price
				}
			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.id); //打印出上个页面传递的参数。
			// this.commodityList(option.id)
			this.list = JSON.parse(option.id)
			console.log(this.list)
		},
		methods:{
			back() {
				//返回
				uni.navigateBack({
					delta: 1
				})
			},
			shoppingBtn(){
				//购物车
				let _this = this
				let shopCardDetailDTOList = [{
					materialCode:_this.list.materialCode,
					materialNumber:_this.num
				}]
				_this.$u.post('store-api/v1/store/shop_card/set', {
					shopCardDetailDTOList
				}).then(res => {
					console.log(res)
					if (res.code == 200) {
						_this.$refs.uToast.show({
							title: '加入购物车成功'
						})
					}else{
						_this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			},
			purchaseBtn(){
				let _this = this
				let priceNum = _this.list
				priceNum.priceNum = _this.num
				//购买
				uni.navigateTo({
					url: 'confirmOrder?list='+JSON.stringify(priceNum)
				});
			},
			countreduce() {
				//购物车--
				if (this.num == 1) {
					this.$refs.uToast.show({
						title: '数量不能小于1',
						// 如果不传此type参数，默认为default，也可以手动写上 type: 'default'
						// type: 'success', 
						// 如果不需要图标，请设置为false
						// icon: false
					})
					return
				}
				this.num--
			},
			countAdd() {
				//购物车++
				// if (this.goodsList[index].num > this.goodsListCount) {
				// 	return
				// }
				this.num++
			},
			statusChange() {
				//点击件数弹出软键盘
				this.keyboardValueNum = this.num
				this.keyboardShow = true
				// // this.listLength = index
				this.keyboardValue = this.num.toString()
			},
			// 键盘按键发生变化
			valChange(detail) {
				// console.log(detail)
				// this.keyboardValue += detail;
			},
			// 按键被点击(点击退格键不会触发此事件)
			valChange(val) {
				// 将每次按键的值拼接到value变量中，注意+=写法
				this.keyboardValue += val;
				this.num = this.keyboardValue
			},
			// 退格键被点击
			backspace(e) {
				// 删除value的最后一个字符
				if(this.keyboardValue.length >=1){
					this.keyboardValue = this.keyboardValue.substr(0, this.keyboardValue.length - 1);
					this.num = this.keyboardValue
				}
			},
			confirmkeyboard(){
				//软键盘确定
				console.log(this.keyboardValue)
				if(this.keyboardValue == ''){
					this.num = '1'
				}else{
					this.num = this.keyboardValue
				}
				if(parseInt(this.keyboardValue.slice(0,1)) == 0){
					this.num = '1'
				}
				
			},
			cancelkeyboard(){
				//软键盘取消
				this.num = this.keyboardValueNum
			},
			commodityList(id){
				let _this = this
				_this.$u.get('stock-api/v1/ishop/material/findById', {
					id
				}).then(res => {
					console.log(res)
					if (res.code == 200) {
						_this.list = res.data
						_this.monery = res.data.clientRealPrice
					}else{
						_this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			}
		}
	}
</script>

<style>
	page {
		height: 100%;
		background: #f9f9f9;
	}
	.numdatanull{
		height: 50rpx;
		padding: 5rpx 10rpx!important;
		border: 1px solid rgba(255, 158, 1, 1);
		color: rgba(255, 158, 1, 1);
		margin-left: 10rpx;
	}
	.numdatanullno{
		height: 50rpx;
		padding: 5rpx 10rpx!important;
		border: 1px solid #ccc;
		color: #ccc;
		margin-left: 10rpx;
	}
	.orderListParameter view {
		font-size: 14px;
		padding: 15rpx 30rpx;
	}
	.boxList{
		padding: 0!important;
		width: 70rpx;
		height: 70rpx;
		text-align: center;
		border: 1px solid rgba(255, 158, 1, 1);
		padding: 0;
		line-height: 70rpx;
		margin-left: 20px;
		color: rgba(255, 158, 1, 1);
	}
	.input {
		border: 1px solid $u-light-color;
		/* border-radius: 4px; */
		margin-bottom: 20px;
		font-size: 26rpx;
		flex: 1;
		box-sizing: border-box;
		height: 25px;
		width: 40px;
		background: #fff;
		// border-right: none;
		// border-left: none;
		text-align: center;
		vertical-align: middle;
		border: 1px solid #ccc;
	}
	.listBtn{
		width: 100%;
		height: 110rpx;
		
	}
	.listBtn button{
		width: 49%;
		float: left;
	}
</style>
