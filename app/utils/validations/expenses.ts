import * as yup from 'yup';

const createExpenseSchema = yup.object().shape({
    alternative_due_date: yup.string().required("Digite a data de vencimento."),
    competence: yup.string().required("Digite a data de competência."),
    description: yup.string().required("Digite a descrição."),
    financial_category: yup.number().min(1, "Escolha a categoria.").required("Escolha a categoria."),
    supplier: yup.number().min(1, "Escolha o fornecedor.").required("Escolha o fornecedor."),
    _value: yup.string().matches(/^(?!0+(?:,00)?$)(\d+(?:\.\d{3})*|0)(?:,\d{1,2})?$/, 'O valor deve ser um número válido.'),
    cost_center: yup.number().min(1, "Escolha o centro de custo.").required("Escolha o centro de custo."),
    code: yup.string(),
    observations: yup.string().nullable(),
    status: yup.boolean().nullable(),
    installment: yup.number().min(0, "Digite um valor positivo").required("Digite um valor.").required("Digite o valor da parcela."),
    attachment: yup.mixed(),
    document_number: yup.string().required("Digite o número do documento."),
    number_of_installments:
        yup
            .string()
            .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
            .typeError('Por favor, insira um número válido.')
            .matches(/^\d+x?$/, 'Digite um valor válido.')
            .required('Digite o número de parcelas.'),
    nsu: yup.string(),
    financial_account: yup
        .number()
        .when('payment.status', {
            is: (status: boolean) => status === true,
            then: (schema) => schema.min(1, "Selecione uma conta válida.").required("Escolha uma conta bancária."),
            otherwise: (schema) => schema.nullable()
        }),
    bank_slip: yup.boolean(),
    payment: yup.object({
        value: yup.string().matches(/^(?!0+(?:,00)?$)(\d+(?:\.\d{3})*|0)(?:,\d{1,2})?$/, 'O valor deve ser um número válido.'),
        payment_method: yup.string()
            .when('status', {
                is: (status: boolean) => status === true,
                then: (schema) => schema.required("Escolha a forma de pagamento.").test('not-empty', 'A forma de pagamento não pode ser vazia', value => value.trim() !== ''),
                otherwise: (schema) => schema.nullable()
            }),
        due_date: yup.string(),
        installment_values: yup.array().of(yup.object().shape({
            due_date: yup.string()
                .required("Digite a data de vencimento."),
            value: yup.string()
                .required("Digite um valor.")
                .min(0, "Digite um valor positivo.")
                .matches(/^(?!0+(?:,00)?$)(\d+(?:\.\d{3})*|0)(?:,\d{1,2})?$/, 'O valor deve ser um número válido.'),
        })),
        payment_date: yup.string().required("Digite a data de pagamento.").nullable(),
        status: yup.boolean(),
    }),
    apportionment: yup.array().of(yup.object().shape({
        reference_code: yup.string().nullable(),
        financial_category: yup.number().required("Digite a categoria."),
        value: yup.string().nullable(),
        percentage: yup.string().matches(/^(?!-)(\d+)(?:,\d{1,2})?$/, 'Digite um valor positivo válido.'),
        cost_center: yup.number().required("Digite o centro de custo."),
    }).nullable()).nullable()
});

export { createExpenseSchema }