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

<!-- When we code have data from api -->

<!-- <template>
	<div id="tv_chart_container" style="width: 100%; height: 600px;"></div>
</template>

<script setup>
import { onMounted, defineProps } from 'vue'
import { widget } from 'charting_library'

const props = defineProps({
	fetchDataFromAPI: {
		type: Array,
		default: () => [],
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
			const apiUrl = `https://testapi.example.com/data?from=${from}&to=${to}`
			const response = await fetch(apiUrl)
			const apiData = await response.json()
			const bars = apiData.map(bar => ({
				time: new Date(bar.time).getTime(),
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

	subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {

		const interval = setInterval(async () => {
		  const response = await fetch(`https://testapi.example.com/realtime?symbol=${symbolInfo.name}`)
		  const newBar = await response.json()
		  onRealtimeCallback({
		    time: new Date(newBar.time).getTime(),
		    open: newBar.open,
		    high: newBar.high,
		    low: newBar.low,
		    close: newBar.close,
		  })
		}, 5000)
		symbolInfo._interval = interval
	},

	unsubscribeBars: (subscriberUID) => {
		// clearInterval(subscriberUID)
	},
}

onMounted(() => {
	const widgetOptions = {
		symbol: 'MY_SYMBOL',            
		interval: '5',                  
		container_id: 'tv_chart_container',
		datafeed: myDatafeed,             
		library_path: '/charting_library/', // path to library
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


<!-- When all data from props -->
<!-- <template>
	<div id="tv_chart_container" style="width: 100%; height: 600px;"></div>
</template>

<script setup>
import { onMounted, defineProps } from 'vue'
import { widget } from 'charting_library'

const props = defineProps({
	fetchDataFromAPI: {
		type: Array,
		default: () => [
			{ time: "2018-10-19", open: 180.34, high: 180.99, low: 178.57, close: 179.85 },
			{ time: "2018-10-20", open: 179.85, high: 181.00, low: 178.60, close: 180.00 },
			{ time: "2018-10-21", open: 180.00, high: 182.00, low: 179.00, close: 181.50 },
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
			const bars = props.fetchDataFromAPI
				.filter(bar => {
					const barTimeSec = new Date(bar.time).getTime() / 1000
					return barTimeSec >= from && barTimeSec <= to
				})
				.map(bar => ({
					time: new Date(bar.time).getTime(),
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

	subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
	},

	unsubscribeBars: (subscriberUID) => {
	},
}

onMounted(() => {
	const widgetOptions = {
		symbol: 'MY_SYMBOL',
		interval: '5',
		container_id: 'tv_chart_container',
		datafeed: myDatafeed,
		library_path: '/charting_library/',
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
</script>
-->
