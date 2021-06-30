<template>
	<view class="content">
		<!-- 提示 -->
		<view>
			<u-toast ref="uToast" />
		</view>
		<!-- 软键盘 -->
		<view>
			<u-keyboard :mask="false" tips="请输入数量" mode="number" @cancel="cancelkeyboard" @confirm="confirmkeyboard" :mask-close-able='false'  :dot-enabled="false" @change="valChange" @backspace="backspace" v-model="keyboardShow"></u-keyboard>
		</view>
		<view class="example-body">
			<uni-nav-bar left-icon="" right-text="编辑" left-text="" title="全部订单" @clickLeft="back"
				@clickRight="edit" />
		</view>
		<view style="height: 100%;overflow: auto;">
			<view v-if="orderListData">
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
			<view v-else style="padding-bottom: 100px;">
				<view class="titlebody">
					<view>可购买({{goodsList.length}})</view>
				</view>
				<view class="conterBody">
					<view v-if="conterBodytrue" style="height: 100%;">
						<!-- <u-swipe-action :show="show" @click="clickswipeaction" @open="open" :options="options1" class="conterBodyCount" v-for="(i,index) in goodsList"> -->
						<view class="conterBodyCount" v-for="(i,index) in goodsList" :key="index">
							<view class="conterBodyradio">
								<label @click='checkeboxclick(index)'>
									<image src="../../static/uview/example/checkedYse.png" mode="" v-if="i.flag"></image>
									<image src="../../static/uview/example/checkedNo.png" mode="" v-else></image>
								</label>
							</view>
							<view class="conterBodyimg">
								<u-image width="100%" height="200rpx" src="https://cdn.uviewui.com/uview/example/fade.jpg">
								</u-image>
							</view>
							<view class="conterBodyTet">
								<view class="conterBodyTetName">{{i.materialName}}</view>
								<view class="conterBodyTetCode">货号：{{i.materialCode}}</view>
								<view>规格：{{i.standard}}</view>
								<!-- <view class="conterBodyTetNum"><text style="color: #ff9901;font-size: 16px;">￥456/箱</text><text
										style="font-size: 12px;color: #7A7777;margin-left: 20rpx;">24灌 / 箱</text></view> -->
								<view style="height: 25px;">
									<view class="input-wrap" style="display: flex;">
										<u-button @click="countreduce(index)"
											:custom-style="{height: '25px',width:'25px',margin:'0px',padding:'0px'}">-
										</u-button>
										<input class="input" @click="statusChange(index)" disabled v-model="i.shopCardNumber" type="text" :value="input" />
										<u-button @click="countAdd(index)"
											:custom-style="{height: '25px',width:'25px',margin:'0px',padding:'0px'}">+
										</u-button>
										<!-- <u-keyboard :mask="mask" ref="uKeyboard" safe-area-inset-bottom @confirm="confirm"
											:random="random" :dotEnable="false" :mode="mode" :confirmBtn="true"
											:cancelBtn="true" :tooltip="tooltip" v-model="show" @change="change"
											@backspace="backspace"></u-keyboard> -->
									</view>
								</view>
								<view class="conterBodyTetText">请按1的基数购买</view>
							</view>
						</view>
						<!-- </u-swipe-action> -->
					</view>
					<view v-else></view>
				</view>
				<view class="titleBotm" v-if="edittrue">
					<view class="bottom titleBotmView">
						<!-- <checkbox :checked="seletedAll" style="border-radius: 20px;" @tap="_seletedAll">全选</checkbox> -->
						<!-- <u-checkbox-group :size="size" :width="width" :wrap="wrap" :max="max" @change="checkboxGroupChange"
							:activeColor="activeColor">
							<u-checkbox @tap="_seletedAll" :checked="seletedAll" v-model="item.checked" v-for="(item, index) in list" :key="index"
								 :shape="shape" >全选
							</u-checkbox>
						</u-checkbox-group> -->
						<view class="bottom">
							<!-- <checkbox :shape="shape" color="#ff6226" :checked="seletedAll" @tap="_seletedAll">全选</checkbox> -->
							<label @click="checkenAll">
								<image src="../../static/uview/example/checkedYse.png" mode="" v-if="allchecked"></image>
								<image src="../../static/uview/example/checkedNo.png" mode="" v-else></image>
							</label>
						</view>
					</view>
					<view class="titleBotmView">合计<text class="titleBotmViewText">￥{{totalPrice.price}}</text></view>
					<view class="titleBotmView" style="float: right;">
						<u-button type="warning" size="medium" @click="confirmOrderPageList">去下单</u-button>
					</view>
				</view>
				<view class="titleBotm" v-else>
					<view class="bottom titleBotmView">
						<!-- <checkbox :checked="seletedAll" style="border-radius: 20px;" @tap="_seletedAll">全选</checkbox> -->
						<!-- <u-checkbox-group :size="size" :width="width" :wrap="wrap" :max="max" @change="checkboxGroupChange"
							:activeColor="activeColor">
							<u-checkbox @tap="_seletedAll" :checked="seletedAll" v-model="item.checked" v-for="(item, index) in list" :key="index"
								:name="item.name" :shape="shape" :disabled="item.disabled">{{item.name}}
							</u-checkbox>
						</u-checkbox-group> -->
						<view class="bottom">
							<!-- <checkbox :shape="shape" color="#ff6226" :checked="seletedAll" @tap="_seletedAll">全选</checkbox> -->
							<label @click="checkenAll">
								<image src="../../static/uview/example/checkedYse.png" mode="" v-if="allchecked"></image>
								<image src="../../static/uview/example/checkedNo.png" mode="" v-else></image>
							</label>
						</view>
					</view>
					<view class="titleBotmView" style="float: right;">
						<u-button type="error" size="medium" @click="delShoppingList">删除</u-button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				seletedAll: false,
				conterBodytrue: true,
				orderListData:false,
				input: '1',
				size: 45,
				wrap: false,
				max: 3,
				// tooltip: true,
				listLength:0,
				width: 'auto',
				show: false,
				// mask: false,
				mode: 'number',
				random: false,
				edittrue: true,
				keyboardShow:false,
				keyboardValue:'0',
				keyboardValueNum:'0',
				numCount: '0',
				allcount: '0',
				activeColor: '#ff9901',
				shape: 'circle',
				options1: [{
					text: '删除',
					style: {
						backgroundColor: '#ff9901'
					}
				}],
				listData: [{
					name: '全选',
					checked: false,
					disabled: false
				}],
				list: [{
					name: '全选',
					checked: false,
					disabled: false
				}],
				goodsListCount: 10, //库存总数
				goodsList: [
					// {
					// 	id: 1,
					// 	name: '椰浆',
					// 	value: 'a',
					// 	num: 2,
					// 	flag: 0,
					// 	code: '2343',
					// 	monery: '22',
					// 	count: '24',
					// 	checked: false,

					// }
				],
				items: [
				],
				checkList: [], //选中值
				countPrice: 0
			};
		},
		onShow() {
			this.shoppingListData()
		},
		onLoad() {
			// math.add	(22, 2)
			// console.log(this.$math.multiply(2,4))
		},
		computed: {
			allchecked() {
				var unms = 0
				for (var i = 0; i < this.goodsList.length; i++) {
					if (this.goodsList[i].flag == 1) {
						unms++
					}
				}
				if (unms == this.goodsList.length) {
					return true
				} else {
					return false
				}
			},
			totalPrice() {
				var num = 0
				var price = 0
				for (var i = 0; i < this.goodsList.length; i++) {
					if (this.goodsList[i].flag == 1) {
						num += this.goodsList[i].shopCardNumber
						price += this.$math.multiply(this.goodsList[i].shopCardNumber , this.goodsList[i].clientRealPrice)
					}
				}
				return {
					num,
					price
				}
			}
		},
		methods: {
			// clickswipeaction(index, index1) {
			// 	if (index1 == 1) {
			// 		this.list.splice(index, 1);
			// 		this.$u.toast(`删除了第${index}个cell`);
			// 	} else {
			// 		this.list[index].show = false;
			// 		this.$u.toast(`收藏成功`);
			// 	}
			// },
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if (index != idx) this.list[idx].show = false;
				})
			},
			// bindClick(e) {
			// 	uni.showToast({
			// 		title: `点击了${e.position === 'left' ? '左侧' : '右侧'} ${e.content.text}按钮`,
			// 		icon: 'none'
			// 	});
			// },
			checkenAll() {
				//全选
				if (this.allchecked == true) {
					for (var i = 0; i < this.goodsList.length; i++) {
						this.goodsList[i].flag = 0
					}
				} else {
					for (var i = 0; i < this.goodsList.length; i++) {
						this.goodsList[i].flag = 1
					}
				}
			},
			// radioList(e) {
			// 	console.log(e)
			// },
			// seletedStatus(e) {
				// console.log(e)
				// this.checkList = e.detail.value
				// console.log(this.checkList)
				// if (this.checkList.length === this.goodsList.length) {
				// 	this.seletedAll = true
				// }
			// },
			// _seletedAll() {
			// 	console.log(this.seletedAll)
			// 	if (!this.seletedAll) {
			// 		this.seletedAll = true
			// 		this.countPrice = 0
			// 		this.goodsList.map(item => {
			// 			this.checkList.push(item.name)
			// 			this.countPrice += item.monery
			// 		})
			// 		console.log(this.checkList)
			// 		console.log('true')
			// 		console.log(this.countPrice, 'price')
			// 	} else {
			// 		this.seletedAll = false
			// 		this.checkList = []
			// 		console.log('false')
			// 	}
			// },
			countreduce(index) {
				//购物车--
				if (this.goodsList[index].shopCardNumber == 1) {
					this.$refs.uToast.show({
						title: '数量不能小于1',
						// 如果不传此type参数，默认为default，也可以手动写上 type: 'default'
						// type: 'success', 
						// 如果不需要图标，请设置为false
						// icon: false
					})
					return
				}
				this.goodsList[index].shopCardNumber--
				let shopCardDetailDTOList = [{
					materialCode:this.goodsList[index].materialCode,
					materialNumber:'-1'
				}]
				this.$u.post('store-api/v1/store/shop_card/set', {
					shopCardDetailDTOList
				}).then(res => {
					if (res.code == 200) {
						
					}else{
						this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			},
			delShoppingList(){
				//删除购物车订单
				let _this = this
				if (confirm('确定要删除吗？') == true) {
					let materialCodeList = _this.goodsList.filter((goodItem)=>goodItem.flag==1)
						.map((goodItem)=> {
							return {
								materialCode: goodItem.materialCode
							}
						} )
					let shopCardDetailDTOList = {
						"shopCardDetailDTOList": materialCodeList
					}
					_this.$u.post('store-api/v1/store/shop_card/remove', shopCardDetailDTOList).then(res => {
						if (res.code == 200) {
							_this.$refs.uToast.show({
								title: '删除成功'
							})
							_this.shoppingListData()
						}else{
							_this.$refs.uToast.show({
								title: res.message
							})
						}
					})
				} else {
					return false;
				}
			},
			countAdd(index) {
				//购物车++
				// if (this.goodsList[index].shopCardNumber > this.goodsListCount) {
				// 	return
				// }
				this.goodsList[index].shopCardNumber++
				let shopCardDetailDTOList = [{
					materialCode:this.goodsList[index].materialCode,
					materialNumber:'1'
				}]
				this.$u.post('store-api/v1/store/shop_card/set', {
					shopCardDetailDTOList
				}).then(res => {
					if (res.code == 200) {
						
					}else{
						this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			},
			checkeboxclick(index) {
				//单选按钮
				this.goodsList[index].flag = !this.goodsList[index].flag
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				this.result = e;
			},
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				// console.log(e);
			},
			//编辑
			edit() {
				this.edittrue = !this.edittrue
			},
			statusChange(index) {
				//点击件数弹出软键盘
				this.keyboardValueNum = this.goodsList[index].shopCardNumber
				this.keyboardShow = true
				this.listLength = index
				this.keyboardValue = this.goodsList[index].shopCardNumber.toString()
			},
			// confirm(e) {

			// },
			// 键盘按键发生变化
			valChange(detail) {
				// console.log(detail)
				// this.keyboardValue += detail;
			},
			// 按键被点击(点击退格键不会触发此事件)
			valChange(val) {
				// 将每次按键的值拼接到value变量中，注意+=写法
				this.keyboardValue += val;
				this.goodsList[this.listLength].shopCardNumber = this.keyboardValue
			},
			// 退格键被点击
			backspace(e) {
				// 删除value的最后一个字符
				if(this.keyboardValue.length >=1){
					this.keyboardValue = this.keyboardValue.substr(0, this.keyboardValue.length - 1);
					this.goodsList[this.listLength].shopCardNumber = this.keyboardValue
				}
			},
			confirmkeyboard(){
				//软键盘确定
				let keyboardValueNums = this.keyboardValue - this.keyboardValueNum
				if(this.keyboardValue == ''){
					this.goodsList[this.listLength].shopCardNumber = '1'
				}else{
					this.goodsList[this.listLength].shopCardNumber = this.keyboardValue
				}
				if(parseInt(this.keyboardValue.slice(0,1)) == 0){
					this.goodsList[this.listLength].shopCardNumber = '1'
				}
				let shopCardDetailDTOList = [{
					materialCode:this.goodsList[this.listLength].materialCode,
					materialNumber:keyboardValueNums
				}]
				this.$u.post('store-api/v1/store/shop_card/set', {
					shopCardDetailDTOList
				}).then(res => {
					if (res.code == 200) {
						
					}else{
						this.$refs.uToast.show({
							title: res.message
						})
					}
				})
				
			},
			cancelkeyboard(){
				//软键盘取消
				this.goodsList[this.listLength].shopCardNumber = this.keyboardValueNum
			},
			goShopping(){
				//去购物
				uni.navigateTo({
					url: 'classifyList'
				});
			},
			confirmOrderPageList(){
				console.log(this.goodsListFlag = [])
				let goodsListFlag = []
				for(var i=0;i<this.goodsList.length;i++){
					if(this.goodsList[i].flag){
						let priceNum = this.goodsList[i]
						priceNum.priceNum = this.goodsList[i].shopCardNumber
						goodsListFlag.push(priceNum)
					}
				}
				console.log(goodsListFlag)
				if(goodsListFlag == ''){
					this.$refs.uToast.show({
						title: '请选择订单'
					})
					return
				}
				//去下单
				uni.navigateTo({
					url: 'confirmOrder?list='+JSON.stringify(goodsListFlag)+'&array=1'
				});
			},
			shoppingListData(){
				let _this = this
				_this.$u.get('stock-api/v1/ishop/store/shop_card/get', {
					
				}).then(res => {
					console.log(res)
					if (res.code == 200) {
						if(res.data == ''){
							_this.orderListData = true
						}else{
							_this.orderListData = false
						}
						for(var i=0;i<res.data.length;i++){
							res.data[i].flag = 1
						}
						_this.goodsList = res.data
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

<style lang="scss" scoped>
	page {
		height: 100%;
		background: #f9f9f9;
	}
	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 0;
		// display: flex;
	}
	.content {
		height: 100%;
		width: 100%;
	}
	uni-checkbox .uni-checkbox-input {
		border-radius: 20px;
	}

	.titleCet {
		height: 100rpx;
		line-height: 100rpx;
		background-color: #f9f9f9;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		padding: 0px 10px;
	}

	.titlebody {
		margin-top: 5rpx;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #f9f9f9;
		color: #ff9901;
		font-size: 16px;
		padding: 0px 10px;
	}

	.titleBotm {
		width: 100%;
		position: fixed;
		bottom: 50px;
		z-index: 9999;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #f9f9f9;
		text-align: center;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		padding: 0px 10px;
	}

	.titleBotmView {
		float: left;

	}

	.titleBotmViewText {
		color: #ff9901;
	}

	.conterBody {
		height: 100%;
		background-color: #C0C4CC;
		// margin-bottom: 180rpx;
	}

	.conterBodyCount {
		padding: 0 22px;
		width: 100%;
		height: 290rpx;
		background: #fff;
		box-shadow: 0px 0px 5px #e6dfdf;
	}

	.conterBodyradio {
		float: left;
		line-height: 280rpx;
	}

	uni-movable-area {
		height: 130px !important
	}

	.conterBodyimg {
		width: 200rpx;
		float: left;
		height: 100px;
		margin-top: 40rpx;
		margin-left: 40rpx;
	}

	.conterBodyTet {
		float: left;
		margin-left: 30rpx;
		margin-top: 15rpx;
		line-height: 25px;
	}

	.input {
		border: 1px solid $u-light-color;
		border-radius: 4px;
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
	}

	.input-wrap {
		display: flex;
	}

	.clear-btn {
		margin-left: 10px;
		font-size: 28rpx;
	}

	.conterBodyTetText {
		color: #f00;
	}

	label image {
		width: 25px;
		height: 25px;
		margin-top: 26rpx;
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
