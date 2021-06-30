<template>
	<view>
		<view>
			<u-form-item class="searchInput" :label-position="labelPosition">
				<u-input :border="border" :clearable="false" placeholder="搜索商品" v-model="model.value" type="text"></u-input>
				<u-icon name="search" size="40rpx" @click="search" class="searchicon" color="#ccc"></u-icon>
			</u-form-item>
		</view>
		<view class="u-demo-area">
			<u-toast ref="uToast"></u-toast>
			<u-swiper @change="change" :height="400" :list="list" :title="title" :effect3d="effect3d" 
			:indicator-pos="indicatorPos" :mode="mode" :interval="3000" @click="click"></u-swiper>
		</view>
		<view class="pic-menu">
			<ul>
				<li @click="informBtn">
					<!-- <p class="pic-menuList icon icon-ribbon" style='background: #72cae2;'>
						<u-icon name="grid" size="40" color="#fff"></u-icon>
					</p> -->
					<image src="../../static/uview/example/informHome.png" class="pic-menuList icon icon-ribbon"></image>
					<p>通知</p>
				</li>
				<li @click='batchBtn'>
					<!-- <p class="pic-menuList icon icon-ribbon" style='background: #72cae2;'>
						<u-icon name="grid" size="40" color="#fff"></u-icon>
					</p> -->
					<image src="../../static/uview/example/batchHome.png" class="pic-menuList icon icon-ribbon"></image>
					<p>批量</p>
				</li>
				<li @click="orderBtn">
					<!-- <p class="pic-menuList icon icon-ribbon" style='background: #72cae2;'>
						<u-icon name="grid" size="40" color="#fff"></u-icon>
					</p> -->
					<image src="../../static/uview/example/orderHome.png" class="pic-menuList icon icon-ribbon"></image>
					<p>订单</p>
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					// {
					// 	image: '/static/uview/example/inform.png',
					// 	title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					// },
					// {
					// 	image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
					// 	title: '身无彩凤双飞翼，心有灵犀一点通'
					// },
					// {
					// 	image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
					// 	title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					// }
				],
				title: false,
				mode: 'round',
				indicatorPos: 'bottomCenter',
				effect3d: false,
				labelPosition: 'left',
				border: true,
				model: {
					value:''
				},
			}
		},
		onLoad() {
			this.carouselList()
		},
		onShow(){
			
		},
		methods: {
			titleChange(index) {
				this.title = index == 0 ? true : false;
			},
			modeChange(index) {
				this.mode = index == 0 ? 'round' : index == 1 ? 'rect' : index == 2 ? 'number' : 'none';
			},
			indicatorPosChange(index) {
				this.indicatorPos = index == 0 ? 'topLeft' : index == 1 ? 'topRight' : index == 2 ? 'bottomLeft' : index == 3 ? 'bottomCenter'  : 'bottomRight';
			},
			effect3dChange(index) {
				this.effect3d = index == 0 ? true : false;
			},
			click(index) {
				// this.$refs.uToast.show({
				// 	title: `点击了第${index + 1}张图片`,
				// 	type: 'success'
				// })
			},
			change(index) {
				// console.log(index);
			},
			search(){
				//搜索详情
				uni.navigateTo({
					// url: './classifyList?id='+_this.list[index].key
					url:'./classifyList?id=&name='+this.model.value
				});
			},
			informBtn(){
				//通知
				uni.navigateTo({
					url: 'information'
				});
			},
			batchBtn(){
				//批量
				uni.switchTab({
					url: 'classify'
				});
			},
			orderBtn(){
				//订单
				uni.navigateTo({
					url: 'order'
				});
			},
			//轮播图
			carouselList(){
				this.$u.get('chain-api/v1/carousel/list', {
					
				}).then(res => {
					// console.log(res.statusCode)
					if (res.code == 200) {
						let imgData = []
						for(var i=0;i<res.data.length;i++){
							let imgDataArray = {}
							imgDataArray.image = res.data[i].urlInfo
							imgDataArray.title = res.data[i].title
							imgData.push(imgDataArray)
						}
						this.list = imgData
					}else{
						
						
					}
				}).catch(res=>{
					// if(res.statusCode == 401){
					// 	uni.reLaunch({
					// 	    url: 'login'
					// 	});
					// }
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item {
		margin: 30rpx 0;
	}
	.pic-menu{
		
	}
	.pic-menuList{
		// background: #72cae2;
		width: 80rpx;
		height: 80rpx;
		border-radius: 35%;
		color: white;
	}
	ul{
		display: flex;
		flex-wrap: wrap;
		margin: 0;
		padding: 0;
		margin-top: 20rpx;
	}
	li{
		margin-top: 10rpx;
		height: 136rpx;
		display: flex;
		list-style: none;
		width: 33%;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		P{
			display: flex;
			justify-content: space-around;
		}
	}
	.searchInput{
		width: 98%;
		margin-left: 1%;
	}
	.searchicon{
		position: absolute;
		right: 2%;
	}
</style>
