export enum TrxType {
	BUY = 'Buy',
	SELL = 'Sell',
}

export enum TypeOfTable {
  HOLDERS = 'HOLDERS',
  TRADES = 'TRADES',
  COMMENTS = 'Thread'
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
