<template>
	<div>
		<Graphic token="BONK" />
		<p>$isSmallScreen {{ $isSmallScreen }}</p>
		<div>
			<div class="holders">
				<p :class="{ selected: selectedTab === TypeOfTable.HOLDERS }" @click="selectedTab = TypeOfTable.HOLDERS">
					Holders ({{ totalHolders }})
				</p>
				<p :class="{ selected: selectedTab === TypeOfTable.TRADES }" @click="selectedTab = TypeOfTable.TRADES">
					All trades
				</p>
				<p :class="{ selected: selectedTab === TypeOfTable.COMMENTS }" @click="selectedTab = TypeOfTable.COMMENTS">
					Thread
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

			<div v-else-if="selectedTab === TypeOfTable.COMMENTS" class="comments-container">
				<div class="add-comment-section">
					<input v-model="newComment" placeholder="Type your comment..." @keyup.enter="handleAddComment" />
					<button @click="handleAddComment">Add comment</button>
				</div>
				<div v-for="(comment, index) in commentsList" :key="index" class="comment-row">
					<div>
						<p class="author">
							{{ formatContract(comment?.createdBy?.address) || 'Unknown' }}
						</p>
						<span>:</span>
						<p class="content">
							{{ comment?.content || 'no content' }}
						</p>
					</div>
					<p class="time">
						{{ timeAgo(comment?.createdAt) }}
					</p>
				</div>
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
									{{ holder.balance * agent.price }}$
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
import { ref, computed, defineProps } from 'vue'
import { TrxType, TypeOfTable, type TableHeader } from '~/types/transactions'
import type { Trade, Agent } from '~/types'
import { formatContract, timeAgo } from '~/utils/formatters'
import Graphic from './Graphic.vue'

const props = defineProps({
	agent: {
		type: Object as () => Agent,
		required: true,
	}
})

const { $isSmallScreen } = useNuxtApp();
const newComment = ref('');
const agentsStore = useAgentsStore()
const contractAddress = props.agent.contract
const selectedTab = ref<TypeOfTable>(TypeOfTable.TRADES)

const commentsList = computed(() => {
	return Array.isArray(props.agent.comments) ? props.agent.comments : [];
});

async function handleAddComment() {
	if (!newComment.value.trim()) return;
	try {
		await agentsStore.addComment(props.agent.id, newComment.value);
		await agentsStore.getAgentComments(props.agent.id);
		props.agent.comments = agentsStore.agentComments[props.agent.id];
		newComment.value = '';
	} catch (err) {
		console.warn('Error adding comment:', err);
	}
}

const tradesToUse = computed((): Trade[] => {
	const arrDefaultTrades = Array(6).fill(defaultTrade);
	const tradesData = props.agent.trades;
	if (Array.isArray(tradesData)) {
		return tradesData.length ? tradesData : arrDefaultTrades;
	} else if (tradesData && 'trades' in tradesData && Array.isArray(tradesData.trades)) {
		return tradesData.trades.length ? tradesData.trades : arrDefaultTrades;
	}
	return arrDefaultTrades
});

const transactions = computed(() => {
	return tradesToUse.value.map((trade: Trade) => {
		let type: TrxType;
		let account: string;

		if (trade.seller.address.toLowerCase() === contractAddress.toLowerCase()) {
			type = TrxType.BUY;
			account = trade.buyer.address;
		} else {
			type = TrxType.SELL;
			account = trade.seller.address;
		}

		return {
			account,
			type,
			eth: trade.amount * trade.price,
			tokenAmount: trade.amount,
			date: trade.timestamp,
			transactionHash: trade.txHash
		};
	});
});

const tokenHolderList = computed(() => {
	return props.agent.tokenHolders?.holders?.holders?.length
		? props.agent.tokenHolders.holders.holders
		: dummyHolders.holders.holders
})

const totalHolders = computed(() => {
	return props.agent.tokenHolders?.holders?.total || dummyHolders.holders.total
})

const tableHeaders = computed<TableHeader[]>(() => {
	if ($isSmallScreen.value) {
		return [
			{ key: 'date', label: 'Date' },
			{ key: 'type', label: 'Type' },
			{ key: 'eth', label: 'ETH' },
		];
	} else {
		return [
			{ key: 'account', label: 'Account' },
			{ key: 'type', label: 'Type' },
			{ key: 'eth', label: 'ETH' },
			{ key: 'tokenAmount', label: `$${props.agent.tokenName}` },
			{ key: 'date', label: 'Date' },
			{ key: 'transactionHash', label: 'Transaction' },
		];
	}
});


const holdersTableHeaders = computed(() => {
	if ($isSmallScreen) {
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

const defaultTrade: Trade = {
	timestamp: timeAgo('2025-03-05T18:32:34.746Z'),
	buyer: { address: '0xBuyerAddress' },
	seller: { address: contractAddress },
	amount: 100,
	price: 0.01,
	txHash: '4yTezz'
}

const dummyHolders = {
	holders: {
		holders: Array(6).fill(null).flatMap(() => [
			{ user: { address: '0x123' }, balance: 100, percentage: 10 },
		]),
		total: 6,
	},
};

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

.comments-container {
	height: 100%;
	background-color: black;
	gap: 20px;
	display: flex;
	flex-direction: column;
	padding: 24px 0px;
	color: #00FA00;

	.add-comment-section {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0px 36px;

		input {
			flex: 1;
			padding: 4px 8px;
			color: #00fa00;
			background: black;
			border: 1px solid #59596d;
		}

		button {
			cursor: pointer;
			background: #00fa00;
			color: black;
			border: none;
			padding: 6px 12px;
			transition: background-color 0.3s ease;

			&:hover {
				background-color: #00dd00;
			}
		}
	}

	.comment-row {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 12px 36px;
		transition: background-color 0.3s ease;

		&:hover {
			cursor: pointer;
			background-color: rgba(0, 250, 0, 0.12);
		}

		div {
			display: flex;
			flex-direction: row;

			span {
				margin: 0 10px;
			}
		}

		.time {
			opacity: 0.5;
		}
	}
}

.transactions-table-container,
.holders-table-container,
.comments-container {
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

.transactions-table th:nth-child(3),
.transactions-table td:nth-child(3) {
	padding-right: 10px;
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

	.transactions-table thead th:nth-child(2),
	.transactions-table tbody td:nth-child(2) {
		text-align: center;
	}

	.holders-table thead th:nth-child(3),
	.holders-table tbody td:nth-child(3) {
		text-align: right;
	}

	.comments-container {
		.comment-row {
			padding: 12px 16px;
		}

		.add-comment-section {
			flex-wrap: wrap;
			padding: 0px 16px;

			button {
				width: 100%;
			}
		}
	}

	.transactions-table-container,
	.holders-table-container,
	.comments-container {
		max-height: 440px;
	}


}
</style>
