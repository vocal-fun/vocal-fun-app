<template>
	<div>
		<Graphic :token="agent.tokenName" />
		<CoinInfo v-if="$isSmallScreen" :agent="agent" />
		<BondingCurve class="curve-small" v-if="$isSmallScreen" :progressPercentage="getPercentage(props.agent.mcap)" />
		<div>
			<div class="holders">
				<p v-play-click-sound :class="{ selected: selectedTab === TypeOfTable.HOLDERS }"
					@click="selectedTab = TypeOfTable.HOLDERS">
					Holders ({{ totalHolders }})
				</p>
				<p v-play-click-sound :class="{ selected: selectedTab === TypeOfTable.TRADES }"
					@click="selectedTab = TypeOfTable.TRADES">
					All trades
				</p>
				<p v-play-click-sound :class="{ selected: selectedTab === TypeOfTable.COMMENTS }"
					@click="selectedTab = TypeOfTable.COMMENTS">
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
					<button v-play-click-sound @click="handleAddComment">Add comment</button>
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
import CoinInfo from './AgentDetailsCard/CoinInfo.vue'
import BondingCurve from './BuySell/BondingCurve.vue'
import { getPercentage } from '~/utils/helpers'

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
	return Array.isArray(props.agent.comments.comments) ? props.agent.comments.comments : [];
});

async function handleAddComment() {
	if (!newComment.value.trim()) return;
	try {
		await agentsStore.addComment(props.agent.id, newComment.value);
		await agentsStore.getAgentComments(props.agent.id, true);
		const agentCommentData = agentsStore.agentComments[props.agent.id];
		props.agent.comments = { comments: agentCommentData.data };
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
	if ($isSmallScreen.value) {
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
	border-bottom: 1px solid var(--color-tertiary);
	color: var(--color-secondary);
}

.holders p {
	opacity: 0.5;
	transition: opacity .3s ease-in-out
}

.holders p:hover {
	opacity: 0.8;
	cursor: pointer
}

.holders p.selected {
	opacity: 1
}

.comments-container {
	height: 100%;
	background-color: black;
	gap: 20px;
	display: flex;
	flex-direction: column;
	padding: 24px 0;
	color: var(--color-secondary);
	border-bottom: 1px solid var(--color-tertiary)
}

.comments-container .add-comment-section {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 0 36px
}

.comments-container .add-comment-section input {
	flex: 1;
	padding: 4px 8px;
	color: var(--color-secondary);
	background: black;
	border: 1px solid var(--color-tertiary)
}

.comments-container .add-comment-section button {
	cursor: pointer;
	background: var(--color-secondary);
	color: black;
	border: none;
	padding: 6px 12px;
	transition: background-color .3s ease
}

.comments-container .add-comment-section button:hover {
	background-color: #00dd00
}

.comments-container .comment-row {
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 12px 36px;
	transition: background-color .3s ease
}

.comments-container .comment-row:hover {
	cursor: pointer;
	background-color: rgba(0, 250, 0, 0.12)
}

.comments-container .comment-row div {
	display: flex;
	flex-direction: row
}

.comments-container .comment-row div span {
	margin: 0 10px
}

.comments-container .comment-row .time {
	opacity: 0.5
}

.transactions-table-container,
.holders-table-container,
.comments-container {
	max-height: 240px;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch
}

.transactions-table,
.holders-table {
	width: 100%;
	border-collapse: collapse
}

.transactions-table thead th {
	position: sticky;
	top: 0;
	background-color: var(--color-background);
}

.transactions-table th,
.transactions-table td,
.holders-table th,
.holders-table td {
	text-align: right;
	padding: 20px 0
}

.transactions-table th:first-child,
.transactions-table td:first-child,
.holders-table th:first-child,
.holders-table td:first-child {
	padding-left: 20px;
	text-align: left
}

.transactions-table th:nth-child(2),
.transactions-table td:nth-child(2) {
	text-align: left
}

.transactions-table th:nth-child(3),
.transactions-table td:nth-child(3) {
	padding-right: 10px
}

.holders-table th:nth-child(2),
.holders-table td:nth-child(2),
.holders-table th:nth-child(3),
.holders-table td:nth-child(3) {
	text-align: center
}

.transactions-table th:nth-child(4),
.transactions-table td:nth-child(4) {
	text-align: left;
	padding-left: 10px
}

.transactions-table th:nth-child(5) {
	text-align: center
}

.transactions-table td:last-child,
.holders-table td:last-child,
.transactions-table th:last-child,
.holders-table th:last-child {
	padding-right: 20px
}

.transactions-table td,
.holders-table td {
	background-color: black;
	color: var(--color-secondary);
}

.transactions-table td.sell-trx {
	color: var(--color-warn);
}

.transactions-table td:first-child,
.transactions-table td:last-child,
.holders-table td:first-child,
.holders-table td:last-child {
	transition: color .3s ease-in-out
}

.transactions-table td:first-child:hover,
.transactions-table td:last-child:hover,
.holders-table td:first-child:hover,
.holders-table td:last-child:hover {
	cursor: pointer;
	text-decoration: underline;
	color: var(--color-primary)
}

.transactions-table th,
.holders-table th {
	color: #8989AB
}

.transactions-table tr,
.holders-table tr {
	border-bottom: 2px solid var(--color-tertiary);
	padding: 20px 30px
}

thead,
tbody {
	font-size: 14px;
}

@media (max-width:600px) {

	.transactions-table thead th:nth-child(1),
	.transactions-table tbody td:nth-child(1),
	.holders-table thead th:nth-child(1),
	.holders-table tbody td:nth-child(1) {
		width: 30%;
		text-align: left
	}

	.transactions-table thead th:nth-child(2),
	.transactions-table tbody td:nth-child(2) {
		text-align: center
	}

	.holders-table thead th:nth-child(3),
	.holders-table tbody td:nth-child(3) {
		text-align: right
	}

	.comments-container .comment-row {
		padding: 12px 16px
	}

	.comments-container .add-comment-section {
		flex-wrap: wrap;
		padding: 0 16px
	}

	.comments-container .add-comment-section button {
		width: 100%
	}

	.transactions-table-container,
	.holders-table-container,
	.comments-container {
		max-height: 440px;
		padding-bottom: 80px
	}

	.curve-small {
		padding: 0 20px;
		border-bottom: 1px solid var(--color-tertiary);
		border-top: 1px solid var(--color-tertiary);
		margin-bottom: unset
	}

	.holders {
		border-bottom: unset;
		padding-bottom: 12px
	}
}
</style>
