const createExpense = async (values: any, authToken: string) => {
    await fetch(`${"https://idxfinance.com.br"}/api/expenses/`, {
        method: 'POST',
        headers: {            
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
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