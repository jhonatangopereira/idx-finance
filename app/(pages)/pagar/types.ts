type ExpensePayment = {
    created_at: string,
    due_date: string,
    expense: string | null,
    id: number,
    income: string | null,
    installment: number,
    payment_account: number,
    payment_date: string,
    payment_method: string,
    release: string | null,
    status: string,
    value: number
}

type Expense = {
    apportionment: string | null,
    attachment: string | null,
    category: string | null,
    code: string,
    competence: string,
    cost_center: string,
    created_at: string,
    deliver: string | null,
    description: string | null,
    financial_account: number,
    id: number,
    nsu: string | null,
    observations: string | null,
    payment: ExpensePayment[],
    project: string | null,
    status: string,
    supplier: string,
    user: number,
    value: number
};

type Payment = {
    value: number,
    installment: number,
    payment_method: string,
    due_date: string,
    payment_date: string,
    status: string,
}

type DataItem = {
    supplier: string,
    competence: string,
    description: string,
    value: number,
    cost_center: string,
    code: string,
    observations?: string,
    status: string,
    installment: number,
    number_installments: number,
    nsu: string,
    category: null,
    financial_account: number,
    payment: Payment[]
};

interface ApiResponse {
    dados?: Expense[]; 
}


export type { DataItem, ApiResponse, Expense }