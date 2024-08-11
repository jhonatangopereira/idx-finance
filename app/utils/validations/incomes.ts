import * as yup from 'yup';

const createIncomeSchema = yup.object().shape({    
    alternative_due_date: yup.string().required("Digite a data de vencimento."),
    client: yup.string().required("Digite o cliente."),
    competence: yup.string().required("Digite a data de competência."),
    description: yup.string().required("Digite a descrição."),
    financial_category: yup.number().min(1, 'Escolha a categoria.').required("Escolha a categoria."),
    _value: yup.string().matches(/^(?!0+(?:,00)?$)(\d+(?:\.\d{3})*|0)(?:,\d{1,2})?$/, 'O valor deve ser um número válido.'),
    cost_center: yup.number().min(1, 'Escolha o centro de custo.').required("Digite o centro de custo."),
    code: yup.string(),
    observations: yup.string().nullable(),
    status: yup.mixed().oneOf([yup.boolean(), yup.string(), "Recebido", undefined, true, false, ""]).nullable(),
    installment: yup.number().min(0, "Digite um valor positivo"),    
    number_of_installments:
        yup
        .string()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
        .typeError('Por favor, insira um número válido.')
        .matches(/^\d+x?$/, 'Digite um valor válido.')
        .required('Digite o número de parcelas.'),
    nsu: yup.string(),
    financial_account: yup.number().min(1, "Escolha um banco válido."),
    payment: yup.object({
        interval_between_installments:
            yup
            .number()
            .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
            .typeError('Por favor, insira um número válido')
            .min(0, 'Digite um valor positivo')
            .required('Digite o número de dias.'),
        payment_date: yup.string().required("Digite a data de pagamento."),
        due_date: yup.string().required("Digite a data de vencimento."),
        value: yup.string().matches(/^(?!0+(?:,00)?$)(\d+(?:\.\d{3})*|0)(?:,\d{1,2})?$/, 'O valor deve ser um número válido.'),
        payment_method: yup.string().required("Escolha a forma de pagamento."),
        installment_values: yup.array().of(yup.object().shape({
            due_date: yup.string().required("Digite a data de vencimento."),
            value: yup.string().required("Digite um valor.")
        })),
        status: yup.mixed().oneOf([yup.boolean(), yup.string(), "Recebido", undefined, true, false, ""]).nullable(),
        installment: yup.number().min(0, "Digite um valor positivo"),
    }),
    apportionment: yup.array(yup.object({
        reference_code: yup.string().nullable(),
        financial_category: yup.number().required("Digite a categoria."),
        value: yup.string().nullable(),
        percentage: yup.string().matches( /^(?!-)(\d+)(?:,\d{1,2})?$/, 'Digite um valor positivo válido.'),
        cost_center: yup.number().required("Digite o centro de custo."),
    }).nullable()).nullable()
}); 

export { createIncomeSchema }