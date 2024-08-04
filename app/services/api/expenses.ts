
type Payment = {
    value: number,
    payment_method: string,
    due_date: string,
    payment_date: string,
    status: string,
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
	status: string,
	installment: number,
	number_of_installments: number,
	number_installments: number,
	nsu: string,
	financial_account: string,
	payment: Payment
}

const createExpense = async (values: any, authToken: string) => {
    await fetch(`${"https://idxfinance.com.br"}/api/expenses/`, {
        method: 'POST',
        headers: {            
            'Authorization': `Token ${authToken}`,
        },
        body: values
    })
};

const deleteExpense = async (authToken: string, id: number) => {
	await fetch(`${"https://idxfinance.com.br"}/api/expenses/delete/${id}/`, {
	    method: 'DELETE',
	    headers: {
	        'Content-Type': 'application/json',
	        'Authorization': `Token ${authToken}`
	    },
	})       
}	

const getAllExpenses = async (authToken: string) => {
	return await fetch(`${"https://idxfinance.com.br"}/api/expenses/all/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`,
        },
    });
}

export { createExpense, deleteExpense, getAllExpenses };
