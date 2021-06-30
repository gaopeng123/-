<template>
	<view>
		<view class="example-body">
			<uni-nav-bar left-icon="arrowleft" left-text="" title="" @clickLeft="back" >
				<view style="width: 100%;">
					<u-form-item class="searchInput" :label-position="labelPosition">
						<u-input :border="border" :clearable="false" placeholder="搜索商品" v-model="model.value"
							type="text"></u-input>
						<u-icon name="search" size="40rpx" @click="searchList" class="searchicon" color="#ccc"></u-icon>
					</u-form-item>
				</view>
			</uni-nav-bar>
		</view>
		<view v-if="listDataNull">
			<view>
				<view class="centre">
					<image src="https://cdn.uviewui.com/uview/template/taobao-order.png" mode=""></image>
					<view class="explain">
						抱歉
						<view class="tips">抱歉,没有找到符合条件的商品</view>
					</view>
				</view>
			</view>
		</view>
		<view class="classifyConter" v-else>
			<view class="classifyConterList" v-for="(item,index) in list" :key="index" @click="classifyConterListBtn(index)">
				<!-- <view v-for="(item1,index1) in item.materialList" :key="index1"> -->
				<view>
					<view class="classifyConterListTitle">
						<view>{{item.materialName}}</view>
						<!-- <view class="available" v-if="item1.selfStatus">有</view>
						<view class="availableFs" v-else>无</view> -->
					</view>
					<view class="classifyConterListPrice">
						货号:
						<text>{{item.materialCode}}</text>
						<text class="classifyConterListPriceye">¥ {{item.clientRealPrice}} / {{item.baseUnit}} </text>
						<text class="classifyConterListPriceno">价格{{item.clientDisplayPrice}}</text>
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
				listDataNull:false,
				available: true,
				labelPosition: 'left',
				border: true,
				list: [
					// {
					// 	name: '茉莉花',
					// 	code: '123432',
					// 	price: '34',
					// 	flag: 1,
					// 	id: 1
					// },
					// {
					// 	name: '茉莉花2',
					// 	code: '123432',
					// 	price: '65',
					// 	flag: 0,
					// 	id: 2
					// },
					// {
					// 	name: '茉莉花3',
					// 	code: '123432',
					// 	price: '65',
					// 	flag: 1,
					// 	id: 3
					// }
				],
				model: {
					value: ''
				}
			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.id); //打印出上个页面传递的参数。
			console.log(option.name); //打印出上个页面传递的参数。
			this.commodityListData(option.id,option.name)
		},
		methods: {
			back() {
				//返回
				uni.navigateBack({
					delta: 1
				})
			},
			rightlist() {
				//点击菜单按钮
				this.show = true
			},
			searchList() {
				//搜索
				console.log(31)
				this.commodityListData('',this.model.value)
			},
			classifyConterListBtn(index){
				uni.navigateTo({
					url:'./detailsPage?id='+JSON.stringify(this.list[index])
				});
			},
			commodityListData(id,name){
				let _this = this
				_this.$u.get('stock-api/v1/ishop/material/list', {
					typeId:id,
					name:name
				}).then(res => {
					console.log(res)
					if (res.code == 200) {
						if(res.data == ''){
							_this.listDataNull = true
						}else{
							_this.listDataNull = false
						}
						let listData = []
						for(var i=0;i<res.data.length;i++){
							for(var j =0;j<res.data[i].materialList.length;j++){
								console.log()
								listData.push(res.data[i].materialList[j])
							}
						}
						console.log(listData)
						_this.list = listData
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
	/* @import '@/common/uni-nvue.scss'; */
	$nav-height: 30px;

	/* #ifndef APP-NVUE */
	page {
		background-color: #f9f9f9;
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
		background: #f9f9f9;
	}

	.classifyConterList {
		height: 80px;
		background: #fff;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		justify-content: space-evenly;
		padding: 20rpx;
		border-bottom: 1px solid #ebebeb;
	}

	.classifyConterListTitle {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
	}

	.available {
		width: 20px;
		height: 20px;
		text-align: center;
		line-height: 20px;
		border: 1px solid;
		border-radius: 3px;
		color: rgb(255, 153, 1);
	}

	.availableFs {
		width: 20px;
		height: 20px;
		text-align: center;
		line-height: 20px;
		border: 1px solid;
		border-radius: 3px;
		color: rgb(202, 194, 183);
	}

	.classifyConterListPrice {
		color: #5E5E5E;
	}

	.searchInput {
		width: 100%;
		/* margin-left: 1%; */
	}

	.searchicon {
		position: absolute;
		right: 2%;
	}
	.classifyConterListPriceye{
		color: rgb(255, 153, 1);
		font-size: 16px;
		margin-left: 20rpx;
	}
	.classifyConterListPriceno{
		margin-left: 20rpx;
		font-size: 12px;
		color: #ccc;
		text-decoration: line-through;
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
