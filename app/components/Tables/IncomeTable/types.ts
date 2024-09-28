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

type Income = {
    id: number,
    client: string,
    competence: string,
    description: string,
    value: string,
    department: string,
    cost_center: string,
    code: string,
    observations: string,
    status: string,
    created_at: string,
    financial_account: string,
    payment: Payment[],
    category: string | null,
    apportionment: string | null,
    attachment: string | null,
    document_number: string | null,
    user: number,
}

interface TableComponentProps {
    data: Income[] | null;
    linkTo: string,
}

export type { Income, Payment, TableComponentProps };
