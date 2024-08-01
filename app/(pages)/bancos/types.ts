// Defina uma interface para os dados esperados
interface AccountData {
    id: number,
    bank_name: string,
    account_number: number,
    agency_number: number,
    balance: number,
    status: string,
    created_at: string,
    account_type: string,
    account_modality: string,
    description: string,
    user: number
}

// Defina uma interface para a resposta da API
interface ApiResponse {
    dados?: AccountData[]; // Use a chave real se a resposta não contém a chave 'dados'
}

export type { AccountData, ApiResponse }