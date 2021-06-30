<template>
	<view>
		<view class="example-body">
			<uni-nav-bar left-icon="arrowleft" right-text="" left-text="" title="资讯中心" @clickLeft="back"
				@clickRight="" />
		</view>
		<view class="u-content">
			<u-parse :html="noticeInfo.content"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: `
							<p>露从今夜白，月是故乡明</p>
							<img src="https://cdn.uviewui.com/uview/swiper/2.jpg" />
						`
			}
		},
		onLoad(option) {
			// console.log(JSON.parse(option.list))
			// this.content = JSON.parse(option.list.content)
		},
		computed: {
			noticeInfo() {
				return this.$store.state.noticeInfo
			}
		},
		methods: {
			back() {
				//返回
				uni.navigateBack({
					delta: 1
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 0;
	}

	.u-content {
		// margin-top: 100rpx;
		padding: 20rpx;
	}
</style>
