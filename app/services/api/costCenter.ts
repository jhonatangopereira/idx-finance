type DataType = {
    description: string
};

const createCostCenter = async (values: DataType, authToken: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/cost-centers/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
        },
        body: JSON.stringify(values)
    })
};

export { createCostCenter }