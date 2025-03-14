<template>
	<div ref="chartContainer" class="chart"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { CandlestickSeries, createChart } from 'lightweight-charts'

const chartContainer = ref(null)

const data = [
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
]

let chart

function updateChartWidth() {
	if (chart && chartContainer.value) {
		chart.applyOptions({ width: chartContainer.value.clientWidth })
	}
}

onMounted(() => {
	const containerWidth = chartContainer.value.clientWidth
	const chartOptions = {
		width: containerWidth,
		height: 520,
		layout: {
			background: { type: 'solid', color: '#131722' },
			textColor: '#d1d4dc',
		},
		grid: {
			vertLines: { color: '#363c4e' },
			horzLines: { color: '#363c4e' },
		},
		timeScale: {
			borderColor: '#485c7b',
			timeVisible: true,
			secondsVisible: false,
		},
		rightPriceScale: {
			borderColor: '#485c7b',
		},
		crosshair: {
			vertLine: {
				color: '#758696',
				width: 1,
				labelVisible: true,
				labelBackgroundColor: '#1e222d',
			},
			horzLine: {
				color: '#758696',
				width: 1,
				labelVisible: true,
				labelBackgroundColor: '#1e222d',
			},
		},
	}

	chart = createChart(chartContainer.value, chartOptions)
	const candlestickSeries = chart.addSeries(CandlestickSeries, {
		upColor: '#4bffb5',
		downColor: '#ff4976',
		borderUpColor: '#4bffb5',
		borderDownColor: '#ff4976',
		wickUpColor: '#4bffb5',
		wickDownColor: '#ff4976',
	})
	candlestickSeries.setData(data)
	chart.timeScale().fitContent()

	window.addEventListener('resize', updateChartWidth)
})

onUnmounted(() => {
	window.removeEventListener('resize', updateChartWidth)
})
</script>

<style scoped>
.chart {
	width: 100%;
	height: 100%;
}
</style>
