type AccountCardProps = {
    description: string,
    maturity: string,
    value: string,
    situation: "PAGO" | "EM ATRASO" | "RECEBIDO" |  "À VENCER" | "VENCIDO" | string,
    linkTo: string,
    id: number,
    type: "income" | "expense"
};

export type { AccountCardProps };