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

<!-- 
<template>
	<div id="tv_chart_container" style="width: 100%; height: 600px;"></div>
</template>

<script setup>
import { onMounted, defineProps } from 'vue'
import { widget } from 'charting_library'

const props = defineProps({
	fetchDataFromAPI: {
		type: Array,
		default: () => [
			{ open: 10, high: 10.63, low: 9.49, close: 9.55, time: 1642427876 },
			{ open: 9.55, high: 10.30, low: 9.42, close: 9.94, time: 1642514276 },
			{ open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: 1642600676 },
			{ open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: 1642687076 },
			{ open: 9.51, high: 10.46, low: 9.10, close: 10.17, time: 1642773476 },
			{ open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: 1642859876 },
			{ open: 10.47, high: 11.39, low: 10.40, close: 10.81, time: 1642946276 },
			{ open: 10.81, high: 11.60, low: 10.30, close: 10.75, time: 1643032676 },
			{ open: 10.75, high: 11.60, low: 10.49, close: 10.93, time: 1643119076 },
			{ open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1643205476 },
		],
	},
})

const myDatafeed = {
	onReady: (callback) => {
		setTimeout(() => {
			callback({
				supports_search: false,
				supports_group_request: false,
				supports_marks: false,
				supports_timescale_marks: false,
				supports_time: true,
			})
		}, 0)
	},

	resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
		const symbolInfo = {
			ticker: symbolName,
			name: symbolName,
			session: '24x7',
			timezone: 'Etc/UTC',
			minmov: 1,
			pricescale: 100,
			has_intraday: true,
			has_daily: true,
			has_weekly_and_monthly: true,
			supported_resolutions: ['1', '5', '15', '60', '1D'],
			volume_precision: 2,
		}
		setTimeout(() => {
			onSymbolResolvedCallback(symbolInfo)
		}, 0)
	},

	getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback) => {
		try {
			const apiData = props.fetchDataFromAPI
			const bars = apiData
				.filter(bar => bar.time >= from && bar.time <= to)
				.map(bar => ({
					time: bar.time * 1000,
					open: bar.open,
					high: bar.high,
					low: bar.low,
					close: bar.close,
				}))

			if (bars.length) {
				onHistoryCallback(bars, { noData: false })
			} else {
				onHistoryCallback([], { noData: true })
			}
		} catch (error) {
			onErrorCallback(error)
		}
	},

  // Left empty
	subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
	},

	unsubscribeBars: (subscriberUID) => {
	},
}

onMounted(() => {
	const widgetOptions = {
		symbol: 'MY_SYMBOL',            // Символ для графика
		interval: '5',                  // Интервал по умолчанию (например, 5-минутный)
		container_id: 'tv_chart_container',
		datafeed: myDatafeed,           // Наш datafeed
		library_path: '/charting_library/',  // Путь к файлам TradingView Charting Library
		locale: 'en',
		fullscreen: false,
		autosize: true,
		theme: 'Dark',
	}

	const tvWidget = new widget(widgetOptions)

	tvWidget.onChartReady(() => {
		console.log('Chart has loaded!')
	})
})
</script> -->
