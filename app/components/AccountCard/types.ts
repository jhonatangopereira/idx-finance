type AccountCardProps = {
    responsible: string,
    description: string,
    maturity: string,
    value: string,
    situation: "PAGO" | "EM ATRASO" | "RECEBIDO" |  "À VENCER" | "VENCIDO" | string,
    document_number: string,
    linkTo: string,
    id: number,
    type: "income" | "expense"
};

export type { AccountCardProps };