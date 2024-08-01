// Defina uma interface para os dados esperados
interface DataItem {
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

// Defina uma interface para a resposta da API
interface ApiResponse {
    dados?: DataItem[]; // Use a chave real se a resposta não contém a chave 'dados'
}

export type { ApiResponse, DataItem }