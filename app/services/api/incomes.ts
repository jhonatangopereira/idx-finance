const createIncome = async (authToken: string, data: any) =>  {
    return await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/incomes/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
        },
        body: JSON.stringify(data)
    })
};

const getIncomeById = async (authToken: string, id: number) => {
    return await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/incomes/${id}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
        },
    })
};

const updateIncome = async(authToken: string, values: any, id: number) => {
    return await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/incomes/update/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
        },
        body: JSON.stringify(values)
    })
};

const deleteIncomeById = async(authToken: string, id: number) => {
    return await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/incomes/delete/${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
        }
    })
};

export { createIncome, getIncomeById, updateIncome, deleteIncomeById };