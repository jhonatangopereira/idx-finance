type Payment = {
    value: number,
    payment_method: string,
    due_date: string,
    payment_date: string,
    status: string | null,
    installment: number
}

type DataType = {
	supplier: string,
	competence: string,
	description: string,
	value: number,
	cost_center: number,
	code: string,
	observations: string,
	status: string | null,
	installment: number,
	number_installments: number,
	nsu: string,
	financial_account: string,
	payment: Payment
}

export type { DataType }