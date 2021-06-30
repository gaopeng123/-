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
			<uni-nav-bar left-icon="arrowleft" right-icon="" title="订单详情" @clickLeft="back" @clickRight="" />
		</view>
		<!-- 订单管理选择 -->
		<view>
			<u-select v-model="ordershow" mode="single-column" :list="orderListSite" @confirm="confirmOrderList"></u-select>
		</view>
		<view>
			<u-picker mode="time" v-model="pickershow" :params="paramsTime" @confirm="confirmOrderTime"></u-picker>
		</view>
		<view class="u-m-t-5">
			<view  style="margin-top: 50px;padding-bottom: 200rpx;">
				<u-cell-group>
					<u-cell-item title="订单管理" @click="orderlistSiteBtn" class="orderlistSite">
						<text>物流</text>
					</u-cell-item>
				</u-cell-group>
				
				<view class="orderListDetail">
					<view>
						<u-icon name="map"></u-icon>收货信息
					</view>
				</view>
				<u-cell-group class="confirmOrderParameter">
					<text>
						<u-cell-item title="" @click="locationPage">
							<view><text>{{addressInfo.username ? addressInfo.username : '暂无收货地址'}}{{addressInfo.phoneNumber}}</text></view>
							<view><text>{{addressInfo.address}}</text></view>
						</u-cell-item>
					</text>
				</u-cell-group>
				<!-- <u-cell-group class="orderListParameter">
					<view>刘维凤<text>13082796677</text></view>
					<view>山东省日照市东港区望海路与丽阳路中段文苑大厦西侧</view>
				</u-cell-group> -->
				<u-cell-group class="collapseList">
					<u-collapse style="padding:10px;" :item-style="itemStyle" event-type="close" @change="change">
						<u-collapse-item @change="itemChange" title="商品清单">
							<view class="conterBody">
								<view style="height: 100%;">
									<view class="conterBodyCount" v-for="(i,index) in goodsList" :key="index">
										<view class="conterBodyTet">
											<view class="conterBodyTetName">
												<text>{{i.materialName}}</text>
												<u-icon size="40" @click="delList(index)" name="trash"></u-icon>
											</view>
											<view class="conterBodyTetCode">货号：{{i.materialCode}}</view>
											<view class="conterBodyTetCode">价格：￥{{i.clientRealPrice}}</view>
											<view class="conterBodyTetCode">规格：{{i.standard}}</view>
											<!-- <view class="conterBodyTetNum"><text
													style="color: #ff9901;font-size: 16px;">￥456/箱</text><text
													style="font-size: 12px;color: #7A7777;margin-left: 20rpx;">24灌 / 箱</text></view> -->
											<view style="height: 25px;width: 40%;">
												<view class="input-wrap" style="display: flex;">
													<u-button @click="countreduce(index)"
														:custom-style="{height: '25px',width:'25px',margin:'0px',padding:'0px'}">
														-
													</u-button>
													<input class="input" @click="statusChange(index)" disabled
														v-model="i.priceNum" type="text" :value="pagepeve.input" />
													<u-button @click="countAdd(index)"
														:custom-style="{height: '25px',width:'25px',margin:'0px',padding:'0px'}">
														+
													</u-button>
												</view>
											</view>
											<!-- <view class="conterBodyTetText">请按1的基数购买</view> -->
										</view>
									</view>
								</view>
							</view>
				
						</u-collapse-item>
						<view class="numList">共{{goodsList.length}}种</view>
					</u-collapse>
				</u-cell-group>
				<u-cell-group>
					<u-cell-item title="是否开发票" @click="" class="switchs">
						<u-switch v-model="isinvoice" size="40" style="line-height: initial;"></u-switch>
					</u-cell-item>
				</u-cell-group>
				<u-cell-group>
					<u-cell-item title="下单" @click="" ></u-cell-item>
				</u-cell-group>
				<!-- <u-cell-group>
					<u-cell-item title="交货时间" @click="deliveryTime"  class="orderlistSite">
						<text>{{deliveryTimeNum}}</text>
					</u-cell-item>
				</u-cell-group> -->
				<u-cell-group>
					<view class="textareavalview" style="padding: 10px;">
						<u-input v-model="textareavalue" placeholder="我要留言：" type="textarea" :border="true" />
					</view>
				</u-cell-group>
				<u-cell-group class="confirmBtn">	
					<view class="confirmBtnview">
						<text>共<text style="color:rgb(255, 158, 1) ;">{{goodsList.length}}</text>种商品</text>
						<text>运费<text style="color:rgb(255, 158, 1) ;">￥0</text></text>
						<text>商品金额<text style="color:rgb(255, 158, 1) ;">￥{{totalPrice.price}}</text></text>
					</view>
					<view class="confirmBtnview">
						<view>
							合计<text style="color: rgb(255, 158, 1);font-size: 18px;">￥{{totalPrice.price}}</text>
						</view>
						<view>
							<u-button type="warning" size="medium" @click="confirmOrder">确认下单</u-button>
						</view>
					</view>
				</u-cell-group>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ordershow:false,
				orderlistSitetext:'物流',
				pickershow:false,
				deliveryTimeNum:'',
				keyboardShow:false,
				keyboardValue:'0',
				keyboardValueNum:'0',
				paramsTime:{
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				itemList: [{
					head: "赏识在于角度的转换",
					body: "只要我们正确择取一个合适的参照物乃至稍降一格去看待他人，值得赏识的东西便会扑面而来",
					open: true,
					disabled: true
				}],
				orderListSite:[{
					value: '1',
					label: '物流'
				}],
				pagepeve:[
					{
						value:''
					}
				],
				textareavalue:'',
				isinvoice:false,
				addressFlag:false,
				goodsListCount: 10, //库存总数
				goodsList:[],
				// goodsList: [{
				// 		id: 1,
				// 		name: '椰浆',
				// 		value: 'a',
				// 		num: 2,
				// 		flag: 0,
				// 		code: '2343',
				// 		monery: '22',
				// 		count: '24',
				// 		checked: false,

				itemStyle: {
					// marginTop: '20px'
				}
			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(JSON.parse(option.list))
			if(option.array){
				this.goodsList = JSON.parse(option.list)
			}else{
				this.goodsList.push(JSON.parse(option.list))
			}
			this.addressdefault()
		},
		computed:{
			addressInfo: function() {
				return this.$store.state.addressInfo
			},
			totalPrice() {
				var num = 0
				var price = 0
				for (var i = 0; i < this.goodsList.length; i++) {
					num += this.goodsList[i].priceNum
					price += this.$math.multiply(this.goodsList[i].priceNum , this.goodsList[i].clientRealPrice)
				}
				return {
					num,
					price
				}
			}
		},
		methods: {
			back() {
				//返回
				uni.navigateBack({
					delta: 1
				})
			},
			// rightlist(){
			// 	if (confirm('确定要删除吗？') == true) {
			// 		this.$refs.uToast.show({
			// 			title: '删除成功'
			// 		})
			// 		return true;
			// 	} else {
			// 		return false;
			// 	}
			// },
			change() {

			},
			itemChange(e) {
				console.log(e)
			},
			delList(index){
				let _this = this
				if(_this.goodsList.length == 1){
					_this.$refs.uToast.show({
						title: '商品不能小于1！'
					})
					return
				}
				_this.goodsList.splice(index,1)
			},
			locationPage(){
				// 地址管理
				uni.navigateTo({
					url: './location?flag=1'
				});
			},
			//确认下单
			confirmOrder(){
				// debugger
				let _this = this
				var goodsListData = []
				console.log(_this.goodsList)
				for(var i=0;i<_this.goodsList.length;i++){
					var confirmListArrty = {}
					confirmListArrty.puserCode = _this.goodsList[i].materialCode
					confirmListArrty.puserFullName = _this.goodsList[i].materialName
					confirmListArrty.billUnitName = _this.goodsList[i].baseUnit
					confirmListArrty.puserNumber = _this.goodsList[i].priceNum
					confirmListArrty.standard = _this.goodsList[i].standard
					goodsListData.push(confirmListArrty)
				}
				let requestParam = {
					remarkInfo:_this.textareavalue,
					addressInfo:_this.addressInfo.address,
					addressForUser:_this.addressInfo.username,
					addressForPhoneNumber:_this.addressInfo.phoneNumber,
					invoiceStatus:_this.isinvoice,
					detailList:goodsListData
				}
				console.log(requestParam,_this.isinvoice)
				_this.$u.post('chain-api/v1/ishop/info/sale_list/save', requestParam).then(res => {
					if (res.code == 200) {
						_this.$refs.uToast.show({
							title: '下单成功'
						})
						_this.confirmDelOrder(goodsListData)//删除购物车
						setTimeout(function(){
							uni.switchTab({
								url: 'home'
							});
						},1500)
						
					}else{
						_this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			},
			confirmDelOrder(list){
				let _this = this
				console.log(list)
				var listData = []
				for(var i=0;i<list.length;i++){
					let listArray = {}
					listArray.materialCode = list[i].puserCode
					listData.push(listArray)
				}
				// let materialCodeList = list.filter((goodItem)=>)
				// 	.map((goodItem)=> {
				// 		return {
				// 			materialCode: goodItem.materialCode
				// 		}
				// 	} )
				let shopCardDetailDTOList = {
					"shopCardDetailDTOList": listData
				}
				console.log(shopCardDetailDTOList)
				_this.$u.post('store-api/v1/store/shop_card/remove', shopCardDetailDTOList).then(res => {
					if (res.code == 200) {
						// _this.$refs.uToast.show({
						// 	title: '删除成功'
						// })
					}else{
						_this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			},
			addressdefault(){
				let _this = this	
				_this.$u.get('store-api/v1/store/address/default/query', {}).then(res => {
					if (res.code == 200) {
						_this.$store.commit('updateAddressInfo',res.data)
					}else{
						_this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			},
			//订单管理
			orderlistSiteBtn(){
				this.ordershow = true
			},
			//选择物流
			confirmOrderList(e){
				this.orderlistSitetext = e[0].label
			},
			deliveryTime(){
				this.pickershow = true
			},	
			//获取时间
			confirmOrderTime(e){
				console.log(e)
				this.deliveryTimeNum = e.year+'-'+e.month+'-'+e.day
			},
			countAdd(index) {
				//购物车++
				this.goodsList[index].priceNum++
			},
			countreduce(index) {
				//购物车--
				if (this.goodsList[index].priceNum == 1) {
					this.$refs.uToast.show({
						title: '数量不能小于1',
						// 如果不传此type参数，默认为default，也可以手动写上 type: 'default'
						// type: 'success', 
						// 如果不需要图标，请设置为false
						// icon: false
					})
					return
				}
				this.goodsList[index].priceNum--
			},
			statusChange(index) {
				//点击件数弹出软键盘
				this.keyboardValueNum = this.goodsList[index].priceNum
				this.keyboardShow = true
				this.listLength = index
				this.keyboardValue = this.goodsList[index].priceNum.toString()
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
				this.goodsList[this.listLength].priceNum = this.keyboardValue
			},
			// 退格键被点击
			backspace(e) {
				// 删除value的最后一个字符
				if(this.keyboardValue.length >=1){
					this.keyboardValue = this.keyboardValue.substr(0, this.keyboardValue.length - 1);
					this.goodsList[this.listLength].priceNum = this.keyboardValue
				}
			},
			confirmkeyboard(){
				//软键盘确定
				let keyboardValueNums = this.keyboardValue - this.keyboardValueNum
				if(this.keyboardValue == ''){
					this.goodsList[this.listLength].priceNum = '1'
				}else{
					this.goodsList[this.listLength].priceNum = this.keyboardValue
				}
				if(parseInt(this.keyboardValue.slice(0,1)) == 0){
					this.goodsList[this.listLength].priceNum = '1'
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
				this.goodsList[this.listLength].priceNum = this.keyboardValueNum
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		background: #f9f9f9;
	}
	.example-body{
		position: fixed;
		z-index: 999;
		width: 100%;
		top: 0;
	}
	.switchs{
		/deep/ .u-cell__value {
			text-align: right !important
		}
	}
	/deep/ .u-cell__value {
		text-align: left !important
	}
	/deep/ .u-switch{
		line-height: initial;
		margin-top: 14rpx;
	}

	.orderListDetail {
		color: #151515;
		font-size: 16px;
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 35rpx;
	}

	.orderListParameter view {
		font-size: 14px;
		padding: 15rpx 30rpx;
	}
	.confirmOrderParameter view {
		font-size: 14px;
		padding: 10rpx 30rpx;
	}
	.orderlistSite{
		/deep/ .u-cell__value {
			text-align: right !important
		}
	}
	.collapse-item {
		/* color: red; */
		padding-bottom: 10px;
	}

	.collapseList {
		margin-top: 20rpx;
		padding: 10rpx 10rpx;
	}

	.numList {
		position: absolute;
		top: 40rpx;
		right: 80rpx;
	}

	.collapseListData {
		height: 100rpx;
		padding-top: 6px;
		border-bottom: 1px solid #e4e4e4;
	}

	.evaluate {
		color: $u-type-warning-dark;
		border-color: $u-type-warning-dark;
	}

	.btn {
		margin-right: 5px;
		float: right;
		margin-top: 10px;
		text-align: center;
		width: 200rpx;
		border-radius: 32rpx;
		line-height: 64rpx;
		color: #ffffff;
		font-size: 26rpx;
		background: linear-gradient(270deg, rgba(249, 116, 90, 1) 0%, rgba(255, 158, 1, 1) 100%);
	}

	.conterBody {
		height: 100%;
		background-color: #C0C4CC;
		// margin-bottom: 180rpx;
	}

	.conterBodyCount {
		// padding: 0 22px;
		width: 100%;
		height: 280rpx;
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
		width: 95%;
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
	.conterBodyTetName{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.confirmBtn{
		position: fixed;
		bottom: 0;
		z-index: 99;
	}
	.confirmBtnview{
		padding: 10px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
