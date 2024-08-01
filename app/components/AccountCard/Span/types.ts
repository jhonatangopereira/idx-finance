type SpanProps = {
    children: string,
    situation: "PAGO" | "EM ATRASO" | "RECEBIDO" |  "À VENCER" | "VENCIDO" | string
}

export type { SpanProps };