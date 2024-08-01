"use client"

import StylesContainer from '@/app/page.module.css';
import Styles from './page.module.css';
import InputContainer from '@/app/components/InputContainer/InputContainer';
import ButtonForm from '@/app/components/AccountPopups/ButtonForm/ButtonForm';
import { createExpenseSchema } from '../../../../utils/validations/expenses';
import CreateCategoryPopup from '@/app/components/CreateCategoryPopup/CreateCategoryPopup';
import CreateCostCenterPopup from '@/app/components/CreateCostCenterPopup/CreateCostCenterPopup';

import { useState, useCallback, useMemo, FormEvent, useEffect, ChangeEvent } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { parseCookies } from 'nookies';
import { format } from 'date-fns';
import { DataType } from './types';
import { yupResolver } from '@hookform/resolvers/yup';

export default function Pagar() {  
    type ApportionmentType =  {            
    reference_code: string,
    financial_category: number,
    value: string,
    percentage: string,
    cost_center: number
}  
    const [apportionments, setApportionments] = useState<ApportionmentType[]>([
        {
            reference_code: "",
            financial_category: 0,
            value: "",
            percentage: "",
            cost_center: 0
        }
    ]);  
    const ap = apportionments;
    const { id } = useParams();    
    const [markAs, setMarkAs] = useState(false);
    const [data, setData] = useState();
    const [isApportionmentInputChecked, setIsApportionmentInputChecked] = useState(false);
    const [totalValue, setTotalValue] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [hasInstallment, setHasInstallment] = useState(false);
    const [userBanks, setUserBanks] = useState([
        { id: 0, bank_name: '' }
    ]);
    const [useCategories, setUserCategories] = useState([{ id: 0, description: '' }]);
    const [userCostCenters, setUserCostCenters] = useState([{ id: 0, description: '' }]);
    const [isCreateCategoryPopupVisible, setIsCreateCategoryPopupVisible] = useState(false);
    const [isCostCenterPopupVisibe, setIsCostCenterPopupVisible] = useState(false);

     const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        resolver: yupResolver(createExpenseSchema),
        defaultValues: {
            _value: "0",
            alternative_due_date: hasInstallment ? "01/01/2024" : "",
            installment: 0,
            financial_account: 0,
            number_of_installments: "2x",   
            interval_between_installments:  1,
            payment: {
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

    const getData = async (fields: any) => {
        const cookies = parseCookies();
        const data = {
            supplier: fields.supplier,
            competence: format(new Date(fields.competence + 'T00:00:00'), 'dd/MM/yyyy'),
            description: fields.description,
            value: Number(parseFloat(fields._value.replace(/\./g, '').replace(',', '.')).toFixed(2).toString()),
            code: "code",
            observations: fields.observations,
            status: fields.payment.status === false ? "" : "Pago",
            installment: 1,
            number_of_installments: hasInstallment ? Number(fields.number_of_installments.split("x")[0]) : 1,
            nsu: "nsu",
            financial_category: fields.financial_category,
            category: fields.financial_category,
            cost_center: Number(fields.cost_center),
            financial_account: fields.financial_account,
            interval_between_installments: hasInstallment ? Number(fields.interval_between_installments) : 0,
            payment: {
                value: Number(parseFloat(fields.payment.value.replace(/\./g, '').replace(',', '.')).toFixed(2).toString()),
                payment_method: fields.payment.payment_method,
                due_date: hasInstallment ? format(new Date(fields.payment.due_date + 'T00:00:00'), 'dd/MM/yyyy') : format(new Date(fields.alternative_due_date + 'T00:00:00'), 'dd/MM/yyyy'),
                payment_date: hasInstallment ? format(new Date(fields.payment.payment_date + 'T00:00:00'), 'dd/MM/yyyy') : format(new Date(fields.alternative_due_date + 'T00:00:00'), 'dd/MM/yyyy'),
                status: fields.payment.status === false ? "" : "Pago",
                installment: 1,
            },
            apportionment: isApportionmentInputChecked ? apportionments.map((a) => { 
                return {
                    financial_category: a.financial_category,
                    cost_center: Number(a.cost_center),
                    percentage: parseFloat(a.percentage.replace(",", ".")),
                    value: Number(parseFloat(a.value.replace(/\./g, '').replace(',', '.')).toFixed(2).toString()),
                    reference_code: '-',
                }
            }) : []
        };

        console.log(data)

        try {
            await updateExpense(data)
            alert("Despesa editada com sucesso!");
        } catch (err) {
            alert("Falha ao editar a desesa.")
        }
    
    }

    const updateExpense = async(values: any) => {
        const cookies = parseCookies();
        await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/expenses/update/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${cookies.authToken}`
            },
            body: JSON.stringify(values)
        })
    }

    const fetchAccountData = async () => {
        const cookies = parseCookies();

        try {
            await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/expenses/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${cookies.authToken}`
                },
            })
            .then(repsonse => repsonse.json())
            .then(data => {
                setValue('supplier', data.supplier);
                setValue('competence', data.competence);
                setValue('description', data.description);
                setValue('_value', parseFloat(data.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));                
                setValue('payment.value', parseFloat(data.payment[0].value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                setValue('payment.due_date', data.payment[0].due_date);
                setValue('alternative_due_date', data.payment[0].due_date);
                setValue('payment.payment_method', data.payment[0].payment_method);
                setValue('financial_account', data.payment[0].payment_account);
                setValue('observations', data.observations);
                setValue('cost_center', Number(data.cost_center));
                setValue('financial_category', data.financial_category);
                setValue('interval_between_installments', data.interval_between_installments);

                if (data.apportionment.length > 0) {
                    setApportionments(previousValue => data.apportionment.map((a: ApportionmentType, index: number) => { 
                    setValue(`apportionment.${index}.financial_category`, a.financial_category);
                    setValue(`apportionment.${index}.percentage`, parseFloat(a.percentage).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                    setValue(`apportionment.${index}.cost_center`, a.cost_center),
                    setValue(`apportionment.${index}.value`, parseFloat(a.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
                    return a 
                }));
                    setIsApportionmentInputChecked(true);
                } else {
                    setIsApportionmentInputChecked(false)
                }

                if (data.interval_between_installments !== 0) {
                    setHasInstallment(true);
                }

                if (data.status !== 'Pago') {                
                    setMarkAs(false);
                } else if (data.status === "Pago"){
                    setMarkAs(true);
                }
                setValue('payment.payment_date', data.payment[0].payment_date);

                if(data.value !== data.payment[0].value && data.interval_between_installments !== 0) {
                    setHasInstallment(true);Styles

                    if (data.value !== data.payment[0].value === data.payment) {
                        setValue('number_of_installments', "2x")
                    } else {
                        setValue('number_of_installments', Math.floor(Number(data.value) / Number(data.payment[0].value)).toString())
                    }
                }
            });
        } catch (err) {
            console.log(err)
        }
    }

    const addNewApportionment = () => {
        setApportionments(previousValue => [...previousValue, {
            value: "",
            cost_center: 0,
            percentage: "",
            financial_category: 0,
            reference_code: '-'
        }]);
    }

    const removeApportionment = (id: number) => {         
        let filteredApportionments = apportionments.filter((item, i) => { return i !== id} )
        setApportionments(filteredApportionments);
    }

    const fetchBanks = async () => {
        const cookies = parseCookies();

        try {
            await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/release-options/`, {
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
        fetchAccountData();
        
    }, []);

    useEffect(() => {
        fetchBanks()
    }, [isCreateCategoryPopupVisible, isCostCenterPopupVisibe])

    const _value = watch('_value');
    const number_of_installments = watch('number_of_installments')

    useEffect(() => {
        if (Number(number_of_installments.split("x")[0]) > 0) {
            let value = (((stringToCurrency(_value!) / Number(number_of_installments.split("x")[0])).toFixed(2).toString()).replace(".", ","))
            const formattedValue = parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            setValue('payment.value', formattedValue);
        } else {
            setValue('payment.value', _value);
        }
    }, [_value, number_of_installments, setValue])

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
        let cleanedString = str.replace(',', '.');;           
        cleanedString = cleanedString.replace(',', '.');
        const number = parseFloat(cleanedString);

        return number;
    }

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
            <form onSubmit={handleSubmit(getData)}>
                <main>
                    <div className={StylesContainer.Container}>
                        <div className={StylesContainer.BreadCrumb}>
                            <h2 className={Styles.Title}>Detalhes da despesa</h2>

                            <main className={Styles.Main}>
                                <section className={Styles.LaunchInformation}>
                                    <h2>Informações de lançamento</h2>
                                    <div className={Styles.LabelInputContainer}>
                                        <label className={Styles.Label}>Fornecedor <span className={Styles.AsterisckSpan}>*</span></label>
                                        <input 
                                            className={Styles.Input}
                                            placeholder='Fornecedor'
                                            type='text'
                                            {...register("supplier")}
                                            maxLength={200}
                                        />
                                        {errors.supplier && <p className={Styles.Error}>{errors.supplier.message}</p>}
                                    </div>
                                    <div className={Styles.LabelInputContainer}>
                                        <label className={Styles.Label}>Data de competência <span className={Styles.AsterisckSpan}>*</span></label>
                                        <input
                                            className={Styles.Input}
                                            placeholder='Data de competência'
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
                                            maxLength={200}
                                        />
                                        {errors.description && <p className={Styles.Error}>{errors.description.message}</p>}
                                    </div>
                                    <div className={Styles.LabelInputContainer}>
                                        <label className={Styles.Label}>Valor <span className={Styles.AsterisckSpan}>*</span></label>
                                        <input
                                                className={Styles.Input}
                                                placeholder='Ex.: 120,50'
                                                type='text'                                            
                                                name='_value'
                                                onChange={handle_ValueInputChange}
                                                value={_value}
                                                min={0}                                            
                                            /> 
                                        {errors._value && <p className={Styles.Error}>{errors._value.message}</p>}
                                    </div>
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
                                     <div className={Styles.LabelInputContainer}>
                                            <label className={Styles.Label}>Categoria <span className={Styles.AsterisckSpan}>*</span></label>
                                            <select className={Styles.Input} {...register("financial_category")}>
                                                <option value={0}>Selecione a categoria</option>  
                                                    {useCategories.length >= 1 && useCategories.map((category, index) => (
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
                                                {userCostCenters.length >= 1 && userCostCenters.map((category, index) => (
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
                                </section>                           
                                {hasInstallment && (
                                <section className={Styles.PaymentTerms}>
                                    <h2>Condições de pagamento</h2>
                                    <div className={Styles.LabelInputContainer}>
                                        <label className={Styles.Label}>Parcelamento <span className={Styles.AsterisckSpan}>*</span></label>
                                        <input
                                            className={Styles.Input}
                                            placeholder='Ex.: 3x'
                                            type='text'          
                                            id="installmentsIntervalInput"        
                                            onMouseEnter={onInstallMentIntervalFielMouseEnter}
                                            onMouseLeave={onInstallMentIntervalFielMouseLeave}                      
                                            {...register("number_of_installments")}
                                            min={2}
                                        />
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
                                        <label className={Styles.Label}>Data de pagamento <span className={Styles.AsterisckSpan}>*</span></label>
                                        <input
                                            className={Styles.Input}
                                            placeholder='Data de pagamento'
                                            type='date'
                                            {...register("payment.payment_date")}
                                        />
                                        {errors.payment?.payment_date && <p className={Styles.Error}>{errors.payment.payment_date.message}</p>}
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
                                            {...register("interval_between_installments")}
                                        />
                                        {errors.interval_between_installments && <p className={Styles.Error}>{errors.interval_between_installments.message}</p>}
                                    </div>
                                </section> )}   
                                <section>
                                    <div className={Styles.ApportionmentInput}>
                                        <span>Habilitar rateio</span>
                                        <div>
                                            <div>
                                                <input 
                                                    type="radio" 
                                                    name="apportionment" 
                                                    id="yes" 
                                                    onChange={(e) => { setIsApportionmentInputChecked(true)}}
                                                    checked={isApportionmentInputChecked === true}
                                                />
                                                <label htmlFor="yes">Sim</label>
                                            </div>
                                            <div>
                                                <input 
                                                    type="radio" 
                                                    name="apportionment" 
                                                    id="no"
                                                    onChange={(e) => setIsApportionmentInputChecked(false)}
                                                    checked={isApportionmentInputChecked === false}
                                                />
                                                <label htmlFor="no">Não</label>
                                            </div>
                                        </div>
                                    </div>    
                                        <button
                                            className={Styles.AddApportionmentButton} 
                                            type='button' 
                                            onClick={addNewApportionment}
                                        >
                                            Adicionar novo rateio
                                        </button>
                                </section>
                                {isApportionmentInputChecked === true && (
                                    <section className={Styles.Apportionment}>
                                            <h3>Informe os dados do rateio</h3>
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
                                                            <div className={Styles.ValueInput}>
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
                                                        <span>Valor rateado: <b>R${(transformStringToNumber(apportionments[index].value) * ((transformStringToNumber(apportionments[index].percentage)) / 100)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></span>
                                                        <span>A ratear: <b>R$ {(transformStringToNumber(apportionments[index].value) - (transformStringToNumber(apportionments[index].value) * (Number(parseFloat(apportionments[index].percentage).toFixed(2)) / 100))).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({100 - Number(parseFloat(apportionments[index].percentage).toFixed(2))}%)</b></span>
                                                    </div> 
                                            </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                                <section>
                                    <div className={Styles.MarkAs}>
                                        <span>Marcar como</span>
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="receveid"                                         
                                                {...register("payment.status")}
                                                value="Pago"
                                                checked={markAs}
                                                onChange={() => setMarkAs(previousValue => !previousValue)}
                                             />
                                            <label htmlFor="receveid">Pago</label>
                                            <input type="checkbox" id="hasInstallment" checked={hasInstallment} onInput={() => setHasInstallment(previousValue => !previousValue)}/>
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
