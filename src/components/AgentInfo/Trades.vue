<template>
	<div>
		<Graphic :token="token" />
		<div>
			<div class="holders">
				<p :class="{ selected: selectedTab === TypeOfTable.HOLDERS }" @click="selectedTab = TypeOfTable.HOLDERS">
					Holders ({{ totalHolders }})
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

			<div v-else class="holders-table-container">
				<table class="holders-table">
					<thead>
						<tr>
							<th v-for="header in holdersTableHeaders" :key="header.key">
								{{ header.label }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(holder, index) in tokenHolderList" :key="holder.user.address || index">
							<td v-for="header in holdersTableHeaders" :key="header.key">
								<template v-if="header.key === 'account'">
									{{ holder.user.address }}
								</template>
								<template v-else-if="header.key === 'amount'">
									{{ holder.balance }}
								</template>
								<template v-else-if="header.key === 'percentage'">
									{{ holder.percentage }}%
								</template>
								<template v-else-if="header.key === 'balance'">
									{{ holder.balance * tokenPrice }}$
								</template>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, defineProps } from 'vue'
import { TrxType, TypeOfTable, type Transaction } from '~/types/transactions'
import type { TokenHoldersResponse } from '~/types'
import Graphic from './Graphic.vue'

const props = defineProps({
	token: {
		type: String,
		required: true,
	},
	tokenPrice: {
		type: Number,
		required: true,
	},
	holders: {
		type: Object as () => TokenHoldersResponse,
		required: true,
	},
})

const selectedTab = ref<TypeOfTable.HOLDERS | TypeOfTable.TRADES>(TypeOfTable.TRADES)
const isSmallScreen = ref(false)
const updateScreenSize = () => {
	isSmallScreen.value = window.innerWidth < 600
}

onUnmounted(() => {
	window.removeEventListener('resize', updateScreenSize)
})

const tableHeaders = computed(() => {
	if (isSmallScreen.value) {
		return [
			{ key: 'date', label: 'Date' },
			{ key: 'type', label: 'Type' },
			{ key: 'sol', label: 'ETH' },
		]
	} else {
		return [
			{ key: 'account', label: 'Account' },
			{ key: 'type', label: 'Type' },
			{ key: 'sol', label: 'ETH' },
			{ key: 'tokenAmount', label: `$${props.token}` },
			{ key: 'date', label: 'Date' },
			{ key: 'transactionHash', label: 'Transaction #' },
		]
	}
})

const holdersTableHeaders = computed(() => {
	if (isSmallScreen.value) {
		return [
			{ key: 'account', label: 'Account' },
			{ key: 'percentage', label: '% Owned' },
			{ key: 'balance', label: 'Balance' },
		]
	} else {
		return [
			{ key: 'account', label: 'Account' },
			{ key: 'amount', label: 'Amount' },
			{ key: 'percentage', label: '% Owned' },
			{ key: 'balance', label: 'Balance' },
		]
	}
})

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

// Computed properties for holders tab.
const dummyHolders = {
	holders: {
		holders: [
			{ user: { address: '0x123' }, balance: 100, percentage: 10 },
			{ user: { address: '0x456' }, balance: 200, percentage: 20 },
		],
		total: 2,
	},
};

const tokenHolderList = computed(() => {
	return props.holders?.holders?.holders?.length ? props.holders.holders.holders : dummyHolders.holders.holders;
});

const totalHolders = computed(() => {
	return props.holders?.holders?.total || dummyHolders.holders.total;
});


onMounted(() => {
	updateScreenSize()
	window.addEventListener('resize', updateScreenSize)
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

.transactions-table-container,
.holders-table-container {
	max-height: 240px;
	overflow-y: auto;
}

.transactions-table,
.holders-table {
	width: 100%;
	border-collapse: collapse;
}

.transactions-table th,
.transactions-table td,
.holders-table th,
.holders-table td {
	text-align: right;
	padding: 20px 0px;
}

.transactions-table th:first-child,
.transactions-table td:first-child,
.holders-table th:first-child,
.holders-table td:first-child {
	padding-left: 32px;
	text-align: left;
}

.transactions-table th:nth-child(2),
.transactions-table td:nth-child(2) {
	text-align: left;
}

.holders-table th:nth-child(2),
.holders-table td:nth-child(2),
.holders-table th:nth-child(3),
.holders-table td:nth-child(3) {
	text-align: center;
}

.transactions-table th:nth-child(4),
.transactions-table td:nth-child(4) {
	text-align: left;
	padding-left: 10px;
}

.transactions-table th:nth-child(5) {
	text-align: center;
}

.transactions-table td:last-child,
.holders-table td:last-child,
.transactions-table th:last-child,
.holders-table th:last-child {
	padding-right: 30px;
}

.transactions-table td,
.holders-table td {
	background-color: black;
	color: #00FA00;
}

.transactions-table td.sell-trx {
	color: #FA6400;
}

.transactions-table td:first-child,
.transactions-table td:last-child,
.holders-table td:first-child,
.holders-table td:last-child {
	&:hover {
		cursor: pointer;
		text-decoration: underline;
	}
}

.transactions-table th,
.holders-table th {
	color: #8989AB;
}

.transactions-table tr,
.holders-table tr {
	border-bottom: 2px solid #59596D;
	padding: 20px 30px;

	&:last-child {
		border-bottom: none;
	}
}

@media (max-width: 600px) {

	.transactions-table thead th:nth-child(1),
	.transactions-table tbody td:nth-child(1),
	.holders-table thead th:nth-child(1),
	.holders-table tbody td:nth-child(1) {
		width: 30%;
		text-align: left;
	}
}
</style>
