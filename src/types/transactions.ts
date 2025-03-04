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
	sol: number
	tokenAmount: number
	date: string
	transactionHash: string
}
