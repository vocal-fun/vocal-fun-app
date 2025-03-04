<template>
	<div class="trades">
		<Graphic :token="token" />
		<div class="list">
			<p>Holders</p>
			<div class="transactions-table-container">
				<table class="transactions-table">
					<thead>
						<tr>
							<th v-for="header in tableHeaders" :key="header.key">
								{{ header.label }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(tx, index) in transactions" :key="index">
							<td v-for="header in tableHeaders" :key="header.key">
								{{ header.key === 'account' || header.key === 'transactionHash' ? formatContract(tx[header.key]) :
									tx[header.key] }}
							</td>
						</tr>
					</tbody>

				</table>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'
import Graphic from './Graphic.vue'

const props = defineProps({
	token: {
		type: String,
		required: true,
	},
})


const tableHeaders = ref([
	{ key: 'account', label: 'Account' },
	{ key: 'type', label: 'Type' },
	{ key: 'sol', label: 'ETH' },
	{ key: 'tokenAmount', label: `$${props.token}` },
	{ key: 'date', label: 'Date' },
	{ key: 'transactionHash', label: 'Transaction #' },
])

const baseTransaction = {
	account: '0x1cd9a56c8c2ea913c70319a44da75e99255aa46f',
	type: 'Sell',
	sol: 0.841,
	tokenAmount: 4242,
	date: '10s ago',
	transactionHash: '0x1cd9a56c8c2ea913c70319a44da75e99255aa46f',
}

const transactions = ref(Array(6).fill(baseTransaction))


onMounted(() => {
	// Here will get trxs from the api
})
</script>

<style scoped lang="scss">
.trades {
	/* container styling */
}

.list {
	margin-top: 1rem;
}

.transactions-table-container {
	max-height: 240px;
	overflow-y: auto;
	scrollbar-width: 0px;
}

.transactions-table {
	width: 100%;
	border-collapse: collapse;

	th,
	td {
		text-align: right;
		padding: 20px 0px;

		&:first-child {
			padding-left: 30px;
			text-align: left;

			&:hover {
				text-decoration: underline;
			}

		}

		&:nth-child(2) {
			text-align: left;
		}

		&:nth-child(4) {
			text-align: left;
			padding-left: 10px;
		}

		&:nth-child(5) {
			text-align: center;
		}

		&:last-child {
			padding-right: 30px;
		}
	}

	td {

		&:first-child,
		&:last-child {
			&:hover {
				cursor: pointer;
				text-decoration: underline;
			}

		}
	}

	th {
		color: #8989AB;
	}

	td {
		background-color: black;
		color: #00FA00;
	}

	tr {
		border-bottom: 2px solid #59596D;
		padding: 20px 30px;

		&:last-child {
			border-bottom: none;
		}
	}
}
</style>
