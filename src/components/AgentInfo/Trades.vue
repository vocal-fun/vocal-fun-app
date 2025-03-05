<template>
	<div>
		<Graphic :token="token" />
		<div>
			<div class="holders">
				<p :class="{ selected: selectedTab === TypeOfTable.HOLDERS }" @click="selectedTab = TypeOfTable.HOLDERS">
					Holders ({{ holders }})
				</p>
				<p :class="{ selected: selectedTab === TypeOfTable.TRADES }" @click="selectedTab = TypeOfTable.TRADES">
					All trades
				</p>
			</div>

			<div v-if="selectedTab === TypeOfTable.TRADES" class="transactions-table-container">
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
							<td v-for="header in tableHeaders" :key="header.key"
								:class="header.key === 'type' && tx[header.key] === TrxType.SELL ? 'sell-trx' : ''">
								{{ header.key === 'account' || header.key === 'transactionHash'
									? formatContract(tx[header.key])
									: tx[header.key] }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div v-else>
				<p>list of holders</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'
import { TrxType, TypeOfTable, type Transaction } from '~/types/transactions'
import Graphic from './Graphic.vue'

const props = defineProps({
	token: {
		type: String,
		required: true,
	},
	holders: {
		type: Number,
		required: true,
	},
})

const selectedTab = ref<TypeOfTable.HOLDERS | TypeOfTable.TRADES>(TypeOfTable.TRADES)

const tableHeaders = ref([
	{ key: 'account', label: 'Account' },
	{ key: 'type', label: 'Type' },
	{ key: 'sol', label: 'ETH' },
	{ key: 'tokenAmount', label: `$${props.token}` },
	{ key: 'date', label: 'Date' },
	{ key: 'transactionHash', label: 'Transaction #' },
])

const baseTransaction: Transaction = {
	account: '0x1cd9a56c8c2ea913c70319a44da75e99255aa46f',
	type: TrxType.SELL,
	sol: 0.841,
	tokenAmount: 4242,
	date: '10s ago',
	transactionHash: '0x1cd9a56c8c2ea913c70319a44da75e99255aa46f',
}

const transactions = ref(Array(6).fill(baseTransaction))

const formatContract = (address: string) => {
	return address.slice(0, 4) + '...' + address.slice(-4)
}

onMounted(() => {
	// Here will get transactions from the API
})
</script>

<style scoped lang="scss">
.holders {
	display: flex;
	flex-direction: row;
	gap: 24px;
	padding: 20px 32px;
	border-bottom: 1px solid #59596D;
	color: #00FA00;

	p {
		opacity: 0.5;

		&:hover {
			opacity: 0.7;
			cursor: pointer;
		}

		&.selected {
			opacity: 1;
		}
	}
}

.transactions-table-container {
	max-height: 240px;
	overflow-y: auto;
}

.transactions-table {
	width: 100%;
	border-collapse: collapse;

	th,
	td {
		text-align: right;
		padding: 20px 0px;

		&:first-child {
			padding-left: 32px;
			text-align: left;
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

	.sell-trx {
		color: #FA6400;
	}

	td {
		background-color: black;
		color: #00FA00;

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

	tr {
		border-bottom: 2px solid #59596D;
		padding: 20px 30px;

		&:last-child {
			border-bottom: none;
		}
	}
}
</style>
