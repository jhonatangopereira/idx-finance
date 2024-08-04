
type Payment = {
    value: string,
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
	value: string,
	cost_center: string,
	code: string,
	observations: string,
	status: string,
	installment: number,
	number_installments: number,
	nsu: string,
	financial_account: string,
	payment: Payment
}

const fetchBanks = async (authToken: string) => {             
    return await fetch(`${"https://idxfinance.com.br"}/api/financial-accounts/all/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
        },
    })      
};

const getBankById = async (authToken: string, id: number) => {
	return await fetch(`${"https://idxfinance.com.br"}/api/financial-accounts/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
        },
    })
};


const deleteAccountById = async (authToken: string, id: number) => {
    return await fetch(`${"https://idxfinance.com.br"}/api/financial-accounts/delete/${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`,
        },
    })        
};  

const createBank = async (authToken: string, data: any) => {             
    return await fetch(`${"https://idxfinance.com.br"}/api/financial-accounts/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
        },
        body: JSON.stringify(data)
    }); 
};

export { createBank, deleteAccountById, fetchBanks, getBankById };
