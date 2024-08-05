type Payment = {
    value: number,
    payment_method: string,
    due_date: string,
    payment_date: string | null,
    status: string | boolean,
    installment: number
}

type Apportionment = {
	financial_category: number,
    cost_center: number,
    percentage: number,
    value: number,
    reference_code: string,
}

type DataType = {
	supplier: string,
	competence: string,
	description: string,
	value: number,
	cost_center: number,
	code: string,
	observations: string,
	status: string | boolean,
	installment: number,
	number_of_installments: number,
	nsu: string,
	financial_account: string,
	payment: Payment,
	financial_category: number,
	category: number,
	interval_between_installments: number,
	apportionment: Apportionment[],
	attachment: File | null | string 
}

type FieldsType = {
	supplier: string,
	competence: string,
	description: string,
	value: string,
	cost_center: string,
	code: string,
	observations: string,
	status: string,
	installment: number,
	number_installments: number,
	nsu: string,
	financial_account: string,
	payment_value: string,
	payment_due_date: string,
	payment_date: string,
	mark_as: string
	payment_account: string
}

export type { DataType, FieldsType }