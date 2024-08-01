import * as yup from 'yup';

const banksSchema = yup.object().shape({    
    bankName: yup.string().required("Selecione o banco"),
    account_number: yup.string(),
    agency_number: yup.string(),
    finalBankBalance: yup.string(),
    description: yup.string().required("Digite a descrição."),
    status: yup.string(),
    account_modality: yup.string().required("Escolha o tipo da sua conta"),
    account_type: yup.string()
});


export { banksSchema }