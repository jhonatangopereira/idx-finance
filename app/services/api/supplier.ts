type DataType = {
    description: string
};

const createSupplier = async (values: DataType, authToken: string) => {
    return await fetch(`${"https://idxfinance.com.br"}/api/suppliers/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
        },
        body: JSON.stringify(values)
    })
};

export { createSupplier }