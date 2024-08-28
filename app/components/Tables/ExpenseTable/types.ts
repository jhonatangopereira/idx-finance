type Payment = {
    created_at: string,
    due_date: string,
    due_date_formatted: string | null,
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
    payment: Payment[],
    project: string | null,
    status: string,
    supplier: string,
    user: number,
    value: number
};

interface TableComponentProps {
    data: Expense[] | null;
    linkTo: string,
}

export type { Expense, Payment, TableComponentProps };
