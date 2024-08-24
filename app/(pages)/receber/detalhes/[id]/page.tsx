"use client";

import ButtonForm from '@/app/components/AccountPopups/ButtonForm/ButtonForm';
import CreateCategoryPopup from '@/app/components/CreateCategoryPopup/CreateCategoryPopup';
import CreateCostCenterPopup from '@/app/components/CreateCostCenterPopup/CreateCostCenterPopup';
import StylesContainer from '@/app/page.module.css';
import MessagePopup from '../../../../components/MessagePopup/MessagePopup';
import { getBankById } from '../../../../services/api/banks';
import { getIncomeById, updateIncome } from '../../../../services/api/incomes';
import { createIncomeSchema } from '../../../../utils/validations/incomes';
import Styles from './page.module.css';

import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';
import { parseCookies } from 'nookies';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

type ApportionmentType =  {            
    reference_code: string,
    financial_category: number,
    value: string,
    percentage: string,
    cost_center: number
}     

export default function Receita() {
    const [apportionments, setApportionments] = useState<ApportionmentType[]>([]);
    const ap = apportionments
    const [numberOfInstallments, setNumberOfInstallments] = useState(2);
    const [installmentValues, setInstallmentValues] = useState<any[]>([
        {
          due_date: "01/01/2024",
          value: "0",
        },
        {
          due_date: "01/01/2024",
          value: "0",
        },
      ]);
    const [hasInstallment, setHasInstallment] = useState(false);
    const paymentSelectedAccountRef = useRef<HTMLOptionElement>(null);
    const [attachmentImageUrl, setAttachmentImageUrl] = useState('');
    const paymentAccountRef = useRef<HTMLSelectElement>(null);
    const [markAs, setMarkAs] = useState(false);    
    const { id } = useParams();        
    const [isApportionmentInputChecked, setIsApportionmentInputChecked] = useState(false);
    const [totalValue, setTotalValue] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const originalPaymentDueDateRef = useRef<string | null>(null);
    const originalPaymentDateRef = useRef<string | null>(null);
    const originalAlternativeDueDateRef = useRef<string | null>(null);

    const { register, handleSubmit, formState: { errors }, watch, setValue, resetField } = useForm({
        resolver: yupResolver(createIncomeSchema),
        defaultValues: {
            _value: "0",
            alternative_due_date: hasInstallment ? "01/01/2024" : "",
            installment: 0,
            financial_account: 0,
            payment: {
                interval_between_installments: hasInstallment ? 1 : 1,
                value: "0",
                payment_method: '',
                due_date: hasInstallment ? '' : '01/01/2024',
                payment_date: hasInstallment ? '' : '01/01/2024',
                status: null,
                installment: 0,
            },
            observations: '',
            apportionment: [{
                reference_code: "Código de referência",
                financial_category: 0,
                value: "0",
                percentage: "0",
                cost_center: 0
            }]
        }
    });
    const [userBanks, setUserBanks] = useState([
        { id: 0, bank_name: '' }
    ]);
    const [attachmentStatus, setAttachment] = useState({
        message: 'Nehum anexo adicionado.'
    });
    const attachment = watch('attachment');
    const [useCategories, setUserCategories] = useState([{ id: 0, description: '' }]);
    const [userCostCenters, setUserCostCenters] = useState([{ id: 0, description: '' }]);
    const [isCreateCategoryPopupVisible, setIsCreateCategoryPopupVisible] = useState(false);
    const [isCostCenterPopupVisibe, setIsCostCenterPopupVisible] = useState(false);
    const [popUpData, setPopUpData] = useState({
        open: false,
        title: '',
        text: ''
    });

    const changeTotalValue = useCallback((value: number) => {
        setTotalValue(value)
    }, [totalValue]); 

    const changePercentage = useCallback((value: number) => {
        setPercentage(value)
    }, [percentage]);

    const apportionmentValue = useMemo(() => (
        totalValue * (percentage / 100)
    ), [totalValue, percentage]);

    const toApportionmentValue = useMemo(() => (
        totalValue - apportionmentValue
    ), [totalValue, apportionmentValue]); 

    const fetchAccountData = async () => {
        const cookies = parseCookies();

        try {        
            const response = await getIncomeById(cookies.authToken, Number(id));
            const data = await response.json(); 
            console.log(data.status)
            if (data.status !== 'Recebido') {                
                setMarkAs(false);
            } else if (data.status === "Recebido") {
                setValue('payment.payment_date', data.payments[0].payment_date);
                setMarkAs(true);
            }

            setValue('client', data.client);
            setValue('competence', data.competence);
            setValue('description', data.description);
            setValue('_value', parseFloat(data.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));             
            setValue('installment', data.payments[0].installment);
            setValue('payment.value', parseFloat(data.payments[0].value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
            setValue('payment.due_date', data.payments[0].due_date);
            setValue('alternative_due_date', data.payments[0].due_date);         
            setValue('observations', data.observations);            
            setValue('financial_account', data.payments[0].payment_account);            
            setValue('payment.payment_method', data.payments[0].payment_method);
            setValue('payment.status', data.status);   
            setValue('payment.interval_between_installments', data.interval_between_installments);
            setValue('cost_center', Number(data.cost_center));
            setValue('financial_category', data.financial_category);

            if (data.apportionment.length > 0) {
                setApportionments(previousValue => data.apportionment.map((a: ApportionmentType, index: number) => { 
                    setValue(`apportionment.${index}.financial_category`, a.financial_category);
                    setValue(`apportionment.${index}.percentage`, a.percentage.replace(".", ","));
                    setValue(`apportionment.${index}.cost_center`, a.cost_center);
                    setValue(`apportionment.${index}.value`, parseFloat(a.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
                    return a 
                }));
                setIsApportionmentInputChecked(true);
            } else {
                setIsApportionmentInputChecked(false)
            }          

            if(!hasInstallment) {
                setValue('alternative_due_date', data.payment.length ? data.payment[0].due_date : "");
            }
            
            if (data.payment.length > 1) {
                setHasInstallment(true);
                setInstallmentValues(
                  data.payment.map((payment: any, index: number) => ({
                    value: parseFloat(payment.value).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }),
                    due_date: payment.due_date,
                  }))
                );
                data.payment.map((payment: any, index: number) => {
                  setValue(
                    `payment.installment_values.${index}.due_date`,
                    payment.due_date
                  );
                  setValue(
                    `payment.installment_values.${index}.value`,
                    parseFloat(payment.value).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  );
                });
                setValue("number_of_installments", `${data.payment.length}x`);
                setNumberOfInstallments(data.payment.length);
              } else {
                setHasInstallment(false);
              }

            const bankResponse = await getBankById(cookies.authToken, data.financial_account);
            const bankData = await bankResponse.json();
            console.log(bankData)

            if(paymentSelectedAccountRef.current) {
                paymentSelectedAccountRef.current.innerText = bankData.bank_name;                    
                paymentSelectedAccountRef.current.value = bankData.id;   
            }    
            const allBanksResponse = await fetchBanks(cookies.authToken);
            
            
            originalPaymentDueDateRef.current = data.payment.length ? data.payment[0].due_date : "";
            originalPaymentDateRef.current = data.payment.length ? data.payment[0].payment_date : "";
            originalAlternativeDueDateRef.current = data.payment.length ? data.payment[0].due_date : "";
         
        } catch (err) {
            console.log(err)
        }
    }

    const getFields = async (fields: any) => {                
         const data = {
            client: fields.client,
             competence: format(new Date(fields.competence + 'T00:00:00'), 'dd/MM/yyyy'),
            description: fields.description,
            value: Number(parseFloat(fields._value.replace(/\./g, '').replace(',', '.')).toFixed(2).toString()),
            code: "code",
            observations: fields.observations,
            status: fields.payment.status === false ? "" : "Recebido",
            installment: 1,
            financial_category: fields.financial_category,
            nsu: "nsu",
            category: fields.financial_category,
            cost_center: Number(fields.cost_center),
            financial_account: fields.financial_account,
            payment: {
                number_of_installments: hasInstallment ? Number(fields.payment.number_of_installments.split("x")[0]) : 1,
                interval_between_installments: hasInstallment ? Number(fields.payment.interval_between_installments) : 0,
                value:  Number(parseFloat(fields._value.replace(/\./g, '').replace(',', '.')).toFixed(2).toString()) / (hasInstallment ? Number(number_of_installments.split("x")[0]) : 1),
                payment_method: fields.payment.payment_method,
                due_date: hasInstallment ? format(new Date(fields.payment.due_date + 'T00:00:00'), 'dd/MM/yyyy') : format(new Date(fields.alternative_due_date + 'T00:00:00'), 'dd/MM/yyyy'),
                payment_date: hasInstallment ? format(new Date(fields.payment.payment_date + 'T00:00:00'), 'dd/MM/yyyy') : format(new Date(fields.alternative_due_date + 'T00:00:00'), 'dd/MM/yyyy'),
                status: fields.payment.status === false ? "" : "Recebido",
                installment: 1,
            },
            apportionment: isApportionmentInputChecked ? apportionments.map((a) => { 
                console.log(a.value)
                return {
                    financial_category: a.financial_category,
                    cost_center: Number(a.cost_center),
                    percentage: parseFloat(a.percentage.replace(",", ".")),
                    value: parseFloat(a.value.replace(/\./g, '').replace(',', '.')),
                    reference_code: '-',
                }
            }) : [],
            attachment: ''
        };

        console.log(data)

        const cookies = parseCookies();
        if (fields.attachment.length > 0 ) {
            const file = fields.attachment[0];
            const reader = new FileReader();
          
            reader.onload = async (event) => {
                if (event.target) {
                    data.attachment = event.target.result as string;
                }
                try {
                  await updateIncome(cookies.authToken, data, Number(id));
                  alert('Nova despesa criada com sucesso!');
                } catch (err) {
                  alert('Falha ao criar a nova despesa.');
                }
            };
              reader.readAsDataURL(file);
        } else {
              try {
                await updateIncome(cookies.authToken, data, Number(id));
                alert('Nova despesa criada com sucesso!');
              } catch (err) {
                alert('Falha ao criar a nova despesa.');
            }
        }


      /* try {
            const cookies = parseCookies();
            await updateIncome(cookies.authToken, data, Number(id))
            alert('Receita atualizada.')
        } catch (err) {
            alert('Falha ao atualizar receita.')
        }    */
    } 

    const fetchBanks = async (authToken: string) => {
        const cookies = parseCookies();

        
       try {
            await fetch(`${"https://idxfinance.com.br"}/api/release-options/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${cookies.authToken}`
                },
            })
            .then(repsonse => repsonse.json())
            .then(data => {
                setUserBanks(data.financial_accounts);
                setUserCategories(data.financial_categories);
                setUserCostCenters(data.cost_centers);
            });
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {     
        const cookies = parseCookies(); 
        const handleFecthBanks = async () => {
            await fetchBanks(cookies.authToken)
        }  ;
        fetchAccountData();
        handleFecthBanks()
    }, [])

    const _value = watch('_value');
    const number_of_installments = watch('number_of_installments');
    const payment_status = watch('payment.status');
    const payment_due_date = watch('payment.due_date');
    const payment_date = watch('payment.payment_date');
    const alternative_due_date = watch('alternative_due_date');

     const addNewApportionment = () => {
        setApportionments(previousValue => [...previousValue, {
            value: "",
            cost_center: 0,
            percentage: "",
            financial_category: 0,
            reference_code: ''
        }]);
    }

    const removeApportionment = (id: number) => {         
        let filteredApportionments = apportionments.filter((item, i) => { return i !== id} )
        setApportionments(filteredApportionments);
    }

    useEffect(() => {
        if (Number(number_of_installments.split("x")[0])! > 0) {
            let value = (((stringToCurrency(_value!) / Number(number_of_installments.split("x")[0])).toFixed(2).toString()).replace(".", ","))
            const formattedValue = parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            setValue('payment.value', formattedValue);
        } else {
            setValue('payment.value', _value);
        }

        if (hasInstallment) {
           setValue('payment.due_date', originalPaymentDueDateRef.current ?? '');
           setValue('payment.payment_date', originalPaymentDateRef.current ?? '');
           setValue('alternative_due_date', '01/01/2024');
        } else {
            setValue('payment.due_date', '01/01/2024');
            setValue('payment.payment_date', '01/01/2024');
            setValue('alternative_due_date', originalAlternativeDueDateRef.current!);
        }

    }, [_value, number_of_installments, setValue, hasInstallment])

    useEffect(() => {        
        if (payment_status) {
            setValue('payment.payment_date', payment_due_date)
        }        
    }, [payment_status])

    const onInstallMentIntervalFielMouseEnter = () => {
        let installMentsIntervalInput = document.getElementById('installmentsIntervalInput') as HTMLInputElement;       
        installMentsIntervalInput.value = installMentsIntervalInput.value.split("x")[0]
        installMentsIntervalInput.setAttribute('type', 'number');
    }

    const onInstallMentIntervalFielMouseLeave = () => {
        let installMentsIntervalInput = document.getElementById('installmentsIntervalInput') as HTMLInputElement;       
        installMentsIntervalInput.setAttribute('type', 'text');
        installMentsIntervalInput.value =  `${installMentsIntervalInput.value}x`
    }

    const [firstValue, setFirstValue] = useState("");

    const handle_ValueInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const inputValue = event.target.value.replace(/\D/g, '');
        const formattedValue = formatCurrency(inputValue);
        setFirstValue(formattedValue)
        setValue('_value', formattedValue);
    };  

    const handle_PercentageInputChange = (event: ChangeEvent<HTMLInputElement>, id: number): void => {
        const inputValue = event.target.value.replace(/\D/g, '');
        const formattedValue = formatCurrency(inputValue);
        setFirstValue(formattedValue);
        setValue(`apportionment.${id}.percentage`, formattedValue);
    };  

    const formatCurrency = (inputValue: string): string => {    
        const numberValue = (parseInt(inputValue, 10) || 0) / 100;        
        return numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const stringToCurrency = (value: string) => {
        const numberValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));
        return numberValue;
    };

    function transformStringToNumber(str: string) {            
        let cleanedString = Number(str).toString();           
        cleanedString = cleanedString.replace(',', '.');
        const number = parseFloat(cleanedString);
        
        return number;
    }

    const addInstallment = () => {
        if (numberOfInstallments < 12) {
          setNumberOfInstallments((previousValue) => previousValue + 1);
          setInstallmentValues((previousValues) => [
            ...previousValues,
            { value: "", due_date: "" },
          ]);
        }
      };

      const removeInstallment = () => {
        if (numberOfInstallments > 2) {
          setNumberOfInstallments((previousValue) => previousValue - 1);
          setInstallmentValues((previousValues) => previousValues.slice(0, -1));
          resetField(
            `payment.installment_values.${numberOfInstallments - 1}.value`
          );
          resetField(
            `payment.installment_values.${numberOfInstallments - 1}.due_date`
          );
        }
      };

    const handleRemoveProof = () => {
        setValue('attachment', null);
    }

    useEffect(() => {
        setValue("number_of_installments", `${numberOfInstallments}x`);
      }, [numberOfInstallments]);

    useEffect(() => {
        if (attachment !== null && attachment !== undefined  && attachment.length > 0) {
            setAttachment({ message: `Anexo já adicionado.` });
        } else {
            setValue('attachment', '');
            setAttachment({ message: `Nenhum anexo adicionado.` });
        }

        setValue('competence', new Date().toISOString().split('T')[0])
    }, [attachment, setValue]);

    const installmentArray = Array.from(
        { length: numberOfInstallments },
        (_, i) => {
          return i + 1;
        }
      );

   return (
        <>
            {isCreateCategoryPopupVisible && (
                <div className="ModalBackground">
                    <CreateCategoryPopup closeFunction={setIsCreateCategoryPopupVisible}/>
                </div>
            )}
            {isCostCenterPopupVisibe && (
                <div className="ModalBackground">
                    <CreateCostCenterPopup closeFunction={setIsCostCenterPopupVisible}/>
                </div>
            )}
            <form onSubmit={handleSubmit(getFields)}>
                {popUpData.open && <MessagePopup title={popUpData.title} text={popUpData.text} setPopupState={setPopUpData}/>}
                <main>
                    <div className={StylesContainer.Container}>
                        <div className={StylesContainer.BreadCrumb}>
                            <h2 className={Styles.Title}>Detalhes da receita</h2>

                            <main className={Styles.Main}>
                                <section className={Styles.LaunchInformation}> 
                                    <h2>Informações de lançamento</h2> 
                                    <div className={Styles.LabelInputContainer}>
                                        <label className={Styles.Label}>Cliente <span className={Styles.AsterisckSpan}>*</span></label>
                                        <input 
                                            className={Styles.Input}
                                            placeholder='Cliente'
                                            type='text'
                                            {...register("client")}
                                            maxLength={200}
                                        />
                                        {errors.client && <p className={Styles.Error}>{errors.client.message}</p>}
                                    </div>
                                    <div className={Styles.LabelInputContainer}>
                                        <label className={Styles.Label}>Data de competencia <span className={Styles.AsterisckSpan}>*</span></label>
                                        <input 
                                            className={Styles.Input}
                                            placeholder='Data de competencia'
                                            type='date'
                                            {...register("competence")}
                                        />
                                        {errors.competence && <p className={Styles.Error}>{errors.competence.message}</p>}
                                    </div>
                                    <div className={Styles.LabelInputContainer}>
                                        <label className={Styles.Label}>Descrição <span className={Styles.AsterisckSpan}>*</span></label>
                                        <input 
                                            className={Styles.Input}
                                            placeholder='Descrição'
                                            type='text'
                                            {...register("description")}
                                            max={200}
                                        />
                                        {errors.description && <p className={Styles.Error}>{errors.description.message}</p>}
                                    </div>  
                                    <div className={Styles.LabelInputContainer}>
                                        <label className={Styles.Label}>Valor <span className={Styles.AsterisckSpan}>*</span></label>
                                        <div className={Styles.ValueInput}>
                                            <span>R$</span>
                                            <input
                                                className={Styles.Input}
                                                placeholder='Ex.: 120,50'
                                                type='text'                                            
                                                name='_value'
                                                onChange={handle_ValueInputChange}
                                                value={_value}
                                                min={0}                                            
                                            />                                        
                                        </div>
                                        {errors._value && <p className={Styles.Error}>{errors._value.message}</p>}
                                    </div>
                                    {markAs && (<>
                                     <div className={Styles.LabelInputContainer}>
                                        <label className={Styles.Label}>Conta de recebimento <span className={Styles.AsterisckSpan}>*</span></label>
                                        <select className={Styles.Input} {...register("financial_account")}>
                                        <option value={0} selected>Selecione o banco</option>  
                                            {userBanks.length >= 0 && userBanks.map((bank, index) => (
                                                <option value={bank.id} key={index}>{bank.bank_name}</option>
                                            ))}
                                        </select>
                                        {errors.financial_account && <p className={Styles.Error}>{errors.financial_account.message}</p>}
                                    </div>
                                     <div className={Styles.LabelInputContainer}>
                                        <label className={Styles.Label}>Forma de pagamento <span className={Styles.AsterisckSpan}>*</span></label>
                                        <select className={Styles.Input} {...register("payment.payment_method")}>
                                            <option value="">Selecione a forma de pagameto</option>
                                            <option value="Boleto Bancário">Boleto Bancário</option>
                                            <option value="Cashback">Cashback</option>
                                            <option value="Cheque">Cheque</option>
                                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                                            <option value="Cartão de Crédito via Link">Cartão de Crédito via Link</option>
                                            <option value="Cartão de Débito">Cartão de Débito</option>
                                            <option value="Carteira Digital">Carteira Digital</option>
                                            <option value="Pix">Pix</option>
                                            <option value="Outro">Outro</option>
                                        </select>                                   
                                        {errors.payment?.payment_method && <p className={Styles.Error}>{errors.payment.payment_method.message}</p>}
                                    </div>
                                     <div className={Styles.LabelInputContainer}>
                                        <label className={Styles.Label}>Data de pagamento <span className={Styles.AsterisckSpan}>*</span></label>
                                        <input 
                                            className={Styles.Input}
                                            placeholder='Data de pagamento'
                                            type='date'
                                            {...register("payment.payment_date")}
                                        />
                                        {errors.payment?.payment_date && <p className={Styles.Error}>{errors.payment.payment_date.message}</p>}
                                    </div> </>)}
                                     <div className={Styles.LabelInputContainer}>
                                                <label className={Styles.Label}>Categoria <span className={Styles.AsterisckSpan}>*</span></label>
                                                <select className={Styles.Input} {...register("financial_category")}>
                                                    <option value={0}>Selecione a categoria</option>  
                                                        {useCategories !== undefined && useCategories.length >= 1 && useCategories.map((category, index) => (
                                                            <option value={category.id} key={index}>{category.description}</option>
                                                        ))}                                        
                                                </select>
                                                    <a
                                                        onClick={() => setIsCreateCategoryPopupVisible(previousValue => !previousValue)}
                                                    >+ Criar nova categoria</a>
                                                {errors.financial_category && (
                                                  <p className={Styles.Error}>{errors.financial_category?.message}</p>
                                                )}
                                            </div>
                                            <div className={Styles.LabelInputContainer}>
                                                <label className={Styles.Label}>Centro de custo <span className={Styles.AsterisckSpan}>*</span></label>
                                                <select className={Styles.Input} {...register("cost_center")}>
                                                <option value={0} selected>Selecione o centro de custo</option>  
                                                    {userCostCenters !== undefined && userCostCenters.length >= 1 && userCostCenters.map((category, index) => (
                                                        <option value={category.id} key={index}>{category.description}</option>
                                                    ))}
                                                </select>
                                                 <a
                                                        onClick={() => setIsCostCenterPopupVisible(previousValue => !previousValue)}
                                                    >+ Criar novo centro de custo</a>
                                                {errors.cost_center && (
                                                    <p className={Styles.Error}>{errors.cost_center.message}</p>
                                                )} 
                                            </div>
                                    {!hasInstallment && (
                                        <div className={Styles.LabelInputContainer}>
                                            <label className={Styles.Label}>Vencimento <span className={Styles.AsterisckSpan}>*</span></label>
                                            <input
                                                className={Styles.Input}
                                                placeholder='Vencimento'
                                                type='date'
                                                {...register("alternative_due_date")}
                                            />
                                            {errors.alternative_due_date && <p className={Styles.Error}>{errors.alternative_due_date.message}</p>}
                                        </div>
                                    )}

                                    {/*
                                    <div className={Styles.ApportionmentInput}>
                                        <span>Habilitar rateio</span>
                                        <div>
                                            <div>
                                                <input 
                                                    type="radio" 
                                                    name="apportionment" 
                                                    id="yes" 
                                                    onInput={(e) => setIsApportionmentInputChecked(true)}/>
                                                <label htmlFor="yes">Sim</label>
                                            </div>
                                            <div>
                                                <input 
                                                type="radio" 
                                                name="apportionment" 
                                                id="no"
                                                onInput={(e) => setIsApportionmentInputChecked(false)}/>
                                                <label htmlFor="no">Não</label>
                                            </div>
                                        </div>
                                    </div>                            
                                    <InputContainer 
                                        inputPlaceholder='Categoria'
                                        inputType='text'
                                        labelText='Categoria'
                                    />
                                    <InputContainer 
                                        inputPlaceholder='Central de custo'
                                        inputType='text'
                                        labelText='Central de custo'
                                    />  
                                    <InputContainer 
                                        inputPlaceholder='Código de referência'
                                        inputType='text'
                                        labelText='Código de referência'
                                    />*/}
                                </section>
                                <section>
                                        <button
                                            className={Styles.AddApportionmentButton} 
                                            type='button' 
                                            onClick={addNewApportionment}
                                        >
                                            {ap.length > 0 ? "Adicionar novo rateio" : "Adicionar Rateio"}
                                        </button>
                                    </section>
                                    <section className={Styles.Apportionment}>
                                            {ap.length > 0 && <h3>Informe os dados do rateio</h3>}
                                            <div id="container">
                                                {ap.length > 0 && ap.map((apportionment, index) => (
                                                <div className="ApportionmentsContainer" key={index} id={`apportionment-${index}`}>
                                                    <div className={Styles.ApportionmentInputs}>
                                                        <div className={Styles.LabelInputContainer}>
                                                            <label className={Styles.Label}>Categoria <span className={Styles.AsterisckSpan}>*</span></label>
                                                            <select
                                                                className={Styles.Input}
                                                                {...register(`apportionment.${index}.financial_category`)}
                                                                onChange={(e) => setApportionments(prevApportionments =>
                                                                    prevApportionments.map((apportionment, i) => {
                                                                            return i === index ? { ...apportionment, financial_category: Number(e.target.value) } : apportionment
                                                                        }
                                                                    )
                                                                )}
                                                            >
                                                            <option value={0}>Selecione a categoria</option>  
                                                                {useCategories.length >= 1 && useCategories.map((category, index) => (
                                                                    <option value={category.id} key={index}>{category.description}</option>
                                                                ))}
                                                            </select>
                                                            {errors.apportionment?.[index]?.financial_category && (
                                                              <p className={Styles.Error}>{errors.apportionment[index]?.financial_category?.message}</p>
                                                            )}
                                                        </div>       
                                                        <div className={Styles.LabelInputContainer}>
                                                            <label className={Styles.Label}>Valor total<span className={Styles.AsterisckSpan}>*</span></label>
                                                            <div className={Styles.ValueInput} >
                                                                <div>
                                                                    <span>R$</span>
                                                                    <input
                                                                        className={Styles.Input}
                                                                        placeholder='Ex.: 100,00'
                                                                        type='text'        
                                                                        {...register(`apportionment.${index}.value`)}                                   
                                                                        onChange={(e) => setApportionments(prevApportionments =>
                                                                            prevApportionments.map((apportionment, i) => {
                                                                                    setValue(`apportionment.${index}.value`, (formatCurrency(e.target.value.replace(/\D/g, ''))).toString())
                                                                                    return i === index ? { ...apportionment, value: (formatCurrency(e.target.value.replace(/\D/g, ''))).toString() } : apportionment
                                                                                }
                                                                            )
                                                                        )}
                                                                    />   
                                                                </div>                                      
                                                                {errors.apportionment?.[index]?.value && (
                                                                  <p className={Styles.Error}>{errors.apportionment[index]?.value?.message}</p>
                                                                )}
                                                            </div>                                                
                                                        </div>       
                                                        <div className={Styles.LabelInputContainer}>
                                                            <label className={Styles.Label}>Porcentagem <span className={Styles.AsterisckSpan}>*</span></label>
                                                            <div className={Styles.ValueInput}>
                                                                <span>%</span>
                                                                <input 
                                                                    className={Styles.Input}
                                                                    placeholder='Ex.: 10'
                                                                    type='text'                                                        
                                                                    {...register(`apportionment.${index}.percentage`)}                                   
                                                                    value={formatCurrency(apportionment.percentage.replace(/\D/g, '')).toString()}                                        
                                                                    onChange={(e) => setApportionments(prevApportionments =>
                                                                        prevApportionments.map((apportionment, i) => {
                                                                            handle_PercentageInputChange(e, index)
                                                                            return i === index ? { ...apportionment, percentage: (formatCurrency(e.target.value.replace(/\D/g, ''))).toString() } : apportionment
                                                                        })
                                                                    )} 
                                                                />     
                                                                {errors.apportionment?.[index]?.percentage && (
                                                                  <p className={Styles.Error}>{errors.apportionment[index]?.percentage?.message}</p>
                                                                )} 
                                                            </div>                                                
                                                        </div> 
                                                         <div className={Styles.LabelInputContainer}>
                                                            <label className={Styles.Label}>Centro de custo <span className={Styles.AsterisckSpan}>*</span></label>
                                                            <select
                                                                className={Styles.Input}
                                                                {...register(`apportionment.${index}.cost_center`)}
                                                                onChange={(e) => setApportionments(prevApportionments =>
                                                                    prevApportionments.map((apportionment, i) =>
                                                                        i === index ? { ...apportionment, cost_center: Number(e.target.value) } : apportionment
                                                                    )
                                                                )}
                                                            >
                                                            <option value={0} selected>Selecione o centro de custo</option>  
                                                                {userCostCenters.length >= 1 && userCostCenters.map((category, index) => (
                                                                    <option value={category.id} key={index}>{category.description}</option>
                                                                ))}
                                                            </select>
                                                            {errors.apportionment?.[index]?.cost_center && (
                                                                  <p className={Styles.Error}>{errors.apportionment[index]?.cost_center?.message}</p>
                                                            )}
                                                        </div>  
                                                    <button 
                                                        className={Styles.AddApportionmentButton}
                                                        type='button' 
                                                        onClick={() => removeApportionment(index)}
                                                    >
                                                        Remover rateio
                                                    </button>
                                                    </div>
                                                    <div className={Styles.ApportionmentDetails}>
                                                        <span>Valor rateado: <b>{(transformStringToNumber(apportionments[index].value)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b></span>
                                                        <span>A ratear: <b>{(transformStringToNumber(_value || '') - (transformStringToNumber(apportionments[index].value))).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) } ({100 - transformStringToNumber(apportionments[index].percentage)}%) </b></span>
                                                    </div> 
                                            </div>
                                            ))}
                                        </div>
                                    </section>
                                {/*isApportionmentInputChecked === true && (
                                    <section className={Styles.Apportionment}>
                                            <h3>Informe os dados do rateio</h3>
                                            <div className={Styles.ApportionmentInputs}>
                                                <InputContainer 
                                                    inputPlaceholder='Categoria'
                                                    inputType='text'
                                                    labelText='Categoria'
                                                />  
                                                <InputContainer 
                                                    inputPlaceholder='R$0,00'
                                                    inputType='number'
                                                    labelText='Valor total'
                                                    onInput={(e) => changeTotalValue(e.target.value)}
                                                />
                                                <InputContainer 
                                                    inputPlaceholder='Ex.: 10%'
                                                    inputType='number'
                                                    labelText='Porcentagem'
                                                    onInput={(e) => changePercentage(e.target.value)}
                                                />
                                                <InputContainer 
                                                    inputPlaceholder='Centro de custo'
                                                    inputType='text'
                                                    labelText='Centro de custo'
                                                /> 
                                                <ButtonForm 
                                                    text='Adicionar rateio'
                                                    primary 
                                                    type='button' 
                                                />
                                            </div>
                                            <div className={Styles.ApportionmentDetails}>
                                                <span>Valor rateado: <b>R${apportionmentValue}</b></span>
                                                <span>A ratear: <b>R${toApportionmentValue} ({percentage}%)</b></span>
                                            </div>
                                    </section>
                                )*/}
                                {hasInstallment && (
                                <section className={Styles.PaymentTerms}>
                                    <h2>Condições de recebimento</h2>
                                    <div className={Styles.LabelInputContainer}>
                                        <label className={Styles.Label}>Parcelamento <span className={Styles.AsterisckSpan}>*</span></label>
                                         <div className={Styles.InstallmentInput}>
                                            <input
                                              className={Styles.Input}
                                              placeholder='Ex.: 3x'
                                              type='text'
                                              id="installmentsIntervalInput"
                                              {...register("number_of_installments")}
                                              min={2}
                                           />
                                          <div className={Styles.Icons}>
                                            <button type="button" onClick={addInstallment}>
                                              <IoMdArrowDropup />
                                            </button>
                                            <button type="button" onClick={removeInstallment}>
                                             <IoMdArrowDropdown />
                                            </button>
                                          </div>
                                         </div>
                                        {errors.number_of_installments && <p className={Styles.Error}>{errors.number_of_installments.message}</p>}
                                    </div> 
                                    <div className={Styles.LabelInputContainer}>
                                        <label className={Styles.Label}>Valor <span className={Styles.AsterisckSpan}>*</span></label>
                                        <div className={Styles.ValueInput}>
                                            <span>R$</span>
                                            <input
                                                className={Styles.Input}
                                                placeholder='Ex.: 120,50'
                                                type='text'
                                                disabled
                                                {...register("payment.value")}
                                                min={0}
                                            />                                        
                                        </div>
                                        {errors.payment?.value && <p className={Styles.Error}>{errors.payment.value.message}</p>}
                                    </div>
                                    <div className={Styles.LabelInputContainer}>
                                        <label className={Styles.Label}>1° data de vencimento <span className={Styles.AsterisckSpan}>*</span></label>
                                        <input 
                                            className={Styles.Input}
                                            placeholder='1° data de vencimento'
                                            type='date'
                                            {...register("payment.due_date")}
                                        />
                                        {errors.payment?.due_date && <p className={Styles.Error}>{errors.payment.due_date.message}</p>}
                                    </div>                                                             
                                    <div className={Styles.LabelInputContainer}>
                                        <label className={Styles.Label}>
                                            Intervalo entre parcelas 
                                            <span className={Styles.AsterisckSpan}>*</span>
                                        </label>
                                        <input
                                            className={Styles.InstallmentsIntervalInput}
                                            placeholder='Ex.: 30 dias'
                                            type='number'
                                            min={0}
                                            {...register("payment.interval_between_installments")}
                                        />
                                        {errors.payment?.interval_between_installments && <p className={Styles.Error}>{errors.payment.interval_between_installments.message}</p>}
                                    </div>
                                    <div className={Styles.ReceivedAndInformNsuContainer}>
                                        {/*<div className={Styles.InformNSU}>
                                            <span>Informar NSU?</span>
                                            <div>
                                                <input type="checkbox"/>
                                                <label></label>
                                            </div>
                                        </div>*/}   
                                    </div>
                                    {/*<div className={Styles.RepeatRealise}>
                                        <span>Repetir lançamento?</span>
                                        <div>
                                            <input type="checkbox"/>
                                            <label></label>
                                        </div>
                                    </div>*/}
                                </section> 
                                )}        
                                <section className={Styles.AddProff}>
                                       <button className={Styles.AddApportionmentButton}>
                                           Adicionar anexo
                                       </button>
                                       <input
                                           type="file"       
                                           id="file"                                    
                                           {...register('attachment')}
                                       />
                                       <p>{attachmentStatus.message}</p>
                                        {attachment !== '' && (
                                            <a                                            
                                               onClick={handleRemoveProof}                                           
                                            >
                                               - Remover anexo
                                            </a> 
                                        )}
                                </section>      
                                 <section>
                                    <div className={Styles.MarkAs}>
                                        <span>Marcar como</span>
                                        <div>
                                            <input 
                                                type="checkbox" 
                                                id="receveid"
                                                checked={markAs}
                                                {...register("payment.status")}
                                                onChange={() => setMarkAs(previousValue => !previousValue)}
                                            />
                                            <label htmlFor="receveid">Recebido</label>
                                            <input 
                                                type="checkbox" id="hasInstallment" 
                                                onChange={() => setHasInstallment(previousValue => !previousValue)}
                                                checked={hasInstallment}
                                            />
                                            <label htmlFor="hasInstallment">Parcelado</label>
                                        </div>
                                    </div>
                                </section>               
                                <section className={Styles.GeneralComments}>
                                    <h2>Observações gerais</h2>
                                    <label>Observações</label>
                                    <textarea
                                        {...register("observations")}
                                        maxLength={1500}
                                    ></textarea>
                                </section>
                            </main>
                            <footer className={Styles.Footer}>
                                <ButtonForm 
                                    text='Salvar'
                                    primary 
                                    type='submit'
                                />
                            </footer>
                        </div>
                    </div>
                </main>
            </form>
        </>
    );
}
