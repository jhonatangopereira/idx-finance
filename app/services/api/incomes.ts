const createIncome = async (authToken: string, data: any) =>  {
    return await fetch(`${"https://idxfinance.com.br"}/api/incomes/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
        },
        body: JSON.stringify(data)
    })
};

const getIncomeById = async (authToken: string, id: number) => {
    return await fetch(`${"https://idxfinance.com.br"}/api/incomes/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
        },
    })
};

const updateIncome = async(authToken: string, values: any, id: number) => {
    return await fetch(`${"https://idxfinance.com.br"}/api/incomes/update/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
        },
        body: JSON.stringify(values)
    })
};

const deleteIncomeById = async(authToken: string, id: number) => {
    return await fetch(`${"https://idxfinance.com.br"}/api/incomes/delete/${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
        }
    })
};

export { createIncome, getIncomeById, updateIncome, deleteIncomeById };