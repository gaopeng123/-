<template>
	<view>
		<view class="example-body">
			<uni-nav-bar left-icon="arrowleft" right-text="" left-text="" title="资讯中心" @clickLeft="back"
				@clickRight="rightlist" />
		</view>
		<view class="u-m-t-5">
			<u-cell-group v-for="(item,index) in list" :key="index">
				<view>
					<u-cell-item icon="" :title="item.title" @click="informationLise(index)">
						<view>{{item.createTime}}</view>
					</u-cell-item>
				</view>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				list:[
					
				]
			}
		},
		onLoad() {
			this.informationList()
		},
		methods:{
			back() {
				//返回
				uni.navigateBack({
					delta: 1
				})
			},
			rightlist() {
				//点击菜单按钮
				console.log(321)
				this.show = true
			},
			informationLise(index){
				console.log(23,this.list)
				// uni.navigateTo({
				// 	url:'./informationList?list='+JSON.stringify(this.list[index])
				// })
				this.$store.commit('updateNoticeInfo',this.list[index])
				uni.navigateTo({
					url: './informationList'
				})
			},
			informationList(){
				let _this = this
				_this.$u.get('chain-api/v1/notice/list', {
					page:1,
					size:100
				}).then(res => {
					if (res.code == 200) {
						_this.list =res.data.list
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
	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 0;
	}
	.u-cell{
		padding: 8px 16px;
	}
</style>
