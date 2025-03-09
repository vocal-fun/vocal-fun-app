export enum TrxType {
	BUY = 'Buy',
	SELL = 'Sell',
}

export enum TypeOfTable {
	HOLDERS = 'holders',
	TRADES = 'trades',
}


export type Transaction = {
	account: string
	type: TrxType
	eth: number
	tokenAmount: number
	date: string
	transactionHash: string
}
type TransactionKey = keyof Transaction

export type TableHeader = {
	key: TransactionKey;
	label: string;
}
