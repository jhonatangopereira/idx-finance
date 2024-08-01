type DataType = {
    description: string
};

const createFinancialCategory = async (values: DataType, authToken: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/financial-categories/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
        },
        body: JSON.stringify(values)
    })
};

export { createFinancialCategory }