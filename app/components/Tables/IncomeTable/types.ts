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
    category: string | null,
    apportionment: string | null,
    attachment: string | null,
    user: number,
}

interface TableComponentProps {
    data: Income[] | null;
    linkTo: string,
}

export type { TableComponentProps };