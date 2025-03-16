<template>
	<div ref="chartContainer" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps } from 'vue'
import { createChart, CandlestickSeries, ColorType, type UTCTimestamp } from 'lightweight-charts'
import type { CandleData } from '~/types'

const props = defineProps<{
	data?: CandleData[]
}>()

const defaultData: CandleData[] = [
	{ open: 10, high: 10.63, low: 9.49, close: 9.55, time: 1642427876 as UTCTimestamp },
	{ open: 9.55, high: 10.30, low: 9.42, close: 9.94, time: 1642514276 as UTCTimestamp },
	{ open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: 1642600676 as UTCTimestamp },
	{ open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: 1642687076 as UTCTimestamp },
	{ open: 9.51, high: 10.46, low: 9.10, close: 10.17, time: 1642773476 as UTCTimestamp },
	{ open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: 1642859876 as UTCTimestamp },
	{ open: 10.47, high: 11.39, low: 10.40, close: 10.81, time: 1642946276 as UTCTimestamp },
	{ open: 10.81, high: 11.60, low: 10.30, close: 10.75, time: 1643032676 as UTCTimestamp },
	{ open: 10.75, high: 11.60, low: 10.49, close: 10.93, time: 1643119076 as UTCTimestamp },
	{ open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1643205476 as UTCTimestamp },
]

const chartData: CandleData[] = props.data ?? defaultData

const chartContainer = ref<HTMLDivElement | null>(null)
let chart: ReturnType<typeof createChart> | null = null
let resizeObserver: ResizeObserver | null = null

function handleWindowResize(): void {
	if (!chartContainer.value || !chart) return
	chart.resize(chartContainer.value.clientWidth, chartContainer.value.clientHeight)
}

onMounted(() => {
	if (!chartContainer.value) return

	chart = createChart(chartContainer.value, {
		width: chartContainer.value.clientWidth,
		height: chartContainer.value.clientHeight,
		layout: {
			background: {
				type: ColorType.Solid,
				color: '#131722'
			},
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
	})

	const candlestickSeries = chart.addSeries(CandlestickSeries, {
		upColor: '#4bffb5',
		downColor: '#ff4976',
		borderUpColor: '#4bffb5',
		borderDownColor: '#ff4976',
		wickUpColor: '#4bffb5',
		wickDownColor: '#ff4976',
	})

	candlestickSeries.setData(chartData.map(item => ({ ...item, time: item.time as UTCTimestamp })))
	chart.timeScale().fitContent()
	resizeObserver = new ResizeObserver(entries => {
		for (const entry of entries) {
			chart?.resize(entry.contentRect.width, entry.contentRect.height)
		}
	})
	resizeObserver.observe(chartContainer.value)

	window.addEventListener('resize', handleWindowResize)
})

onUnmounted(() => {
	if (resizeObserver) {
		resizeObserver.disconnect()
		resizeObserver = null
	}
	window.removeEventListener('resize', handleWindowResize)
})
</script>

<style scoped>
.chart-container {
	width: 100%;
	height: 520px;
}
</style>
