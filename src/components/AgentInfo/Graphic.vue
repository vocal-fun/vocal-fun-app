<template>
	<div class="tradingview-widget-container">
		<div id="tradingview_chart"></div>
	</div>
</template>

<script setup>
import { onMounted, defineProps } from 'vue'

const props = defineProps({
	token: {
		type: String,
		required: true,
	}
})

onMounted(() => {
	const script = document.createElement('script')
	script.src = 'https://s3.tradingview.com/tv.js'
	script.async = true
	script.onload = () => {
		new TradingView.widget({
			container_id: 'tradingview_chart',
			width: '100%',
			height: 518,
			symbol: `BINANCE:${props.token}USDT`,
			interval: '60',
			timezone: 'Etc/UTC',
			theme: 'dark',
			style: '1',
			toolbar_bg: '#f1f3f6',
			hide_side_toolbar: false,
			allow_symbol_change: true,
			studies: [],
			locale: 'en',
		})
	}

	document.body.appendChild(script)
})
</script>

<style scoped>
.tradingview-widget-container {
	min-height: 400px;
	width: 100%;
}
</style>
