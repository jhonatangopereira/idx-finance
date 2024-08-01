import Image from 'next/image'
import closeIcon from '../../../../public/images/icons/close.svg';
import bankLogo from '../../../../public/images/icons/bank-blue.svg';
import Styles from './page.module.css';
import InputContainer from '../../InputContainer/InputContainer';
import ButtonForm from '../ButtonForm/ButtonForm';
import { FinancialAccountPopupProps } from './types';
import { createBank } from '../../../services/api/banks';
import MessagePopup from '../../MessagePopup/MessagePopup';
import { banksSchema } from "@/app/utils/validations/banks";

import { parseCookies } from 'nookies';
import { useState, ChangeEvent } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

export default function FinancialAccountPopup({ onCloseFunction }: FinancialAccountPopupProps) {

	const [popUpData, setPopUpData] = useState({
        open: false,
        title: '',
        text: ''
    });

	const Banks = {
	    "001": "Banco do Brasil",
	    "237": "Bradesco",
	    "341": "Itaú",
	    "104": "Caixa Econômica Federal",
	    "033": "Santander",
	    "745": "Citibank",
	    "399": "HSBC",
	    "422": "Banco Safra",
	    "655": "Banco Votorantim",
	    "041": "Banrisul",
	    "212": "Banco Original",
	    "077": "Banco Inter",
	    "070": "Banco de Brasília (BRB)",
	    "741": "Banco Ribeirão Preto",
	    "389": "Banco Mercantil do Brasil",
	    "756": "Bancoob",
	    "021": "Banestes",
	    "136": "Unicred",
	    "743": "Banco Semear",
	    "735": "Banco Pottencial",
	    "654": "Banco A.J. Renner",
	    "012": "Banco INBURSA",
	    "637": "Banco Sofisa",
	    "643": "Banco Pine",
	    "091": "Central Bank of Brazil",
	    "000": "Outros"
	};	

	const cookies = parseCookies();

	const { handleSubmit, register, formState: { errors }, setValue, watch } = useForm({
		resolver: yupResolver(banksSchema),
		defaultValues: {
			bankName: "001",
			account_number: "0",
			agency_number: "0",
			finalBankBalance: "0,00",
			description: "",
			status: "-",
			account_type: "Conta Corrente",
			account_modality: ""
		}
	});

	const finalBankBalance = watch('finalBankBalance');

	const handle_ValueInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const inputValue = event.target.value.replace(/\D/g, '');
        const formattedValue = formatCurrency(inputValue);        
        setValue('finalBankBalance', formattedValue);
    };  

    const formatCurrency = (inputValue: string): string => {    
        const numberValue = (parseInt(inputValue, 10) || 0) / 100;        
        return numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

	const getData = async (fields: any) => {
		const data = {
			bank_name: Banks[fields.bankName as keyof typeof Banks],
			account_number: "0",
			agency_number: "0",
			balance: Number(parseFloat(fields.finalBankBalance.replace(/\./g, '').replace(',', '.')).toFixed(2).toString()), 
			description: fields.description,
			status: "-",
			account_type: "Conta Corrente",
			account_modality: fields.account_modality
		};		

		console.log(data)

		await createBank(cookies.authToken, data)
		.then(response => {
			if (!response.ok) {
				setPopUpData({
					open: true,
					title: "Ops, algo deu errado!",
					text: "Falha ao criar uma nova conta"
				});
				throw new Error("Falha ao criar nova conta.");
			}
			return response.json()
		})
		.then((data) => { 
			setPopUpData({
				open: true,
				title: "Sucesso!",
				text: "Banco criado com sucesso."
			});
			setTimeout(() => window.location.reload(), 3000);			
		})
		.catch(err => {
			setPopUpData({
				open: true,
				title: "Ops, algo deu errado!",
				text: "Falha ao criar uma nova conta"
			})
		});		
	}

	return (
		<>
			{popUpData.open && <MessagePopup title={popUpData.title} text={popUpData.text} setPopupState={setPopUpData}/>}
			<form  onSubmit={handleSubmit(getData)} className={Styles.Form}>
				<header>
		            <h2>
		                Qual o tipo de conta que você quer cadastrar?
		            </h2>
		            <Image
		                src={closeIcon}
		                width={24}
		                height={24}
		                alt="Close icon"
						className={Styles.CloseIcon}
						onClick={onCloseFunction}
		            />
		            <Image
		                src={bankLogo}
		                width={56}
		                height={56}
		                alt="Bank blue icon"
						className={Styles.BankIcon}
		            />
					<div className={Styles.SelectBankDiv}>
						<label className={Styles.SelectLabel} htmlFor="bankType">Selecione o banco</label>
						<select {...register("bankName")}>						
						    <option value="001">Banco do Brasil</option>
							<option value="237">Bradesco</option>
							<option value="341">Itaú</option>
							<option value="104">Caixa Econômica Federal</option>
							<option value="033">Santander</option>
							<option value="745">Citibank</option>
							<option value="399">HSBC</option>
							<option value="422">Banco Safra</option>
							<option value="655">Banco Votorantim</option>
							<option value="041">Banrisul</option>
							<option value="212">Banco Original</option>
							<option value="077">Banco Inter</option>
							<option value="070">Banco de Brasília (BRB)</option>
							<option value="741">Banco Ribeirão Preto</option>
							<option value="389">Banco Mercantil do Brasil</option>
							<option value="756">Bancoob</option>
							<option value="021">Banestes</option>
							<option value="136">Unicred</option>
							<option value="743">Banco Semear</option>
							<option value="735">Banco Pottencial</option>
							<option value="654">Banco A.J. Renner</option>
							<option value="012">Banco INBURSA</option>
							<option value="637">Banco Sofisa</option>
							<option value="643">Banco Pine</option>
							<option value="091">Central Bank of Brazil</option>
							<option value="000">Outros</option>
							{/*<option value="Banco do Brasil">Banco do Brasil</option>
							<option value="Bradesco">Bradesco</option>
							<option value="Itaú">Itaú</option>
							<option value="Caixa Econômica Federal">Caixa Econômica Federal</option>
							<option value="Santander">Santander</option>
							<option value="Citibank">Citibank</option>
							<option value="HSBC">HSBC</option>
							<option value="Banco Safra">Banco Safra</option>
							<option value="Banco Votorantim">Banco Votorantim</option>
							<option value="Banco Safra">Banco Safra</option>
							<option value="Banco Santander">Banco Santander</option>
							<option value="Banrisul">Banrisul</option>
							<option value="Banco Original">Banco Original</option>
							<option value="Banco Inter">Banco Inter</option>
							<option value="Banco de Brasília (BRB)">Banco de Brasília (BRB)</option>
							<option value="Banco Ribeirão Preto">Banco Ribeirão Preto</option>
							<option value="Banco Mercantil do Brasil">Banco Mercantil do Brasil</option>
							<option value="Bancoob">Bancoob</option>
							<option value="Banestes">Banestes</option>
							<option value="Unicred">Unicred</option>
							<option value="Banco Semear">Banco Semear</option>
							<option value="Banco Pottencial">Banco Pottencial</option>
							<option value="Banco A.J. Renner">Banco A.J. Renner</option>
							<option value="Banco INBURSA">Banco INBURSA</option>
							<option value="Banco Agiplan">Banco Agiplan</option>
							<option value="Banco Sofisa">Banco Sofisa</option>
							<option value="Banco Votorantim">Banco Votorantim</option>
							<option value="Banco Pine">Banco Pine</option>
							<option value="Banco Ribeirão Preto">Banco Ribeirão Preto</option>
							<option value="Central Bank of Brazil">Central Bank of Brazil</option>
							<option value="Outros">Outros</option>*/}
						</select>
						{errors.bankName && <p className={Styles.Error}>{errors.bankName.message}</p>}
					</div>
	        	</header>
	        	<main className={Styles.Main}>
					 <div className={Styles.LabelInputContainer}>
	                    <label className={Styles.Label}>Descrição</label>
	                    <input 
	                        className={Styles.Input}
	                        placeholder='Descrição'
	                        type='text'
	                        {...register("description")}
	                    />
	                    {errors.description && <p className={Styles.Error}>{errors.description.message}</p>}
	                </div>
					 <div className={Styles.LabelInputContainer}>
	                    <label className={Styles.Label}>Saldo bancário inicial</label>
	                    <input 
	                        className={Styles.Input}
	                        placeholder='Saldo bancário inicial'
	                        type='text'
	                        name='finalBankBalance'
                            onChange={handle_ValueInputChange}
                            value={finalBankBalance}
                            min={0}
	                    />
	                    {errors.finalBankBalance && <p className={Styles.Error}>{errors.finalBankBalance.message}</p>}
	                </div>
					<div className={Styles.AnotherInputs}>
						<div className={Styles.CheckboxInputContainer}>
							<input type="checkbox" id="checkbox"/>
							<label htmlFor="checkbox">Quero que essa seja a minha conta padrão</label>
						</div>
						<div className={Styles.RadioInputsContainers}>
							<h2>Modalidade da conta</h2>
							<div className={Styles.RadioInputContainer}>
								<input type="radio" value="PJ" {...register("account_modality")} id="account-type-pj"/>
								<label htmlFor='account-type-pj'>Conta Pessoa Jurídica (PJ)</label>
							</div>
							<div className={Styles.RadioInputContainer}>
								<input type="radio" {...register("account_modality")} value="PF" id="account-type-pf"/>
								<label htmlFor='account-type-pf'>Conta Pessoa Física (PF)</label>
							</div>
						</div>		
						{errors.account_modality && <p className={Styles.Error}>{errors.account_modality.message}</p>}		
					</div>
	        	</main>
				<div className={Styles.Buttons}>
					<ButtonForm 
						type="submit"
						text="Salvar"
						primary={true}
					/>
					<ButtonForm 
						type="button"
						text="Cancelar"
						secondary={true}
						onclickFunction={onCloseFunction}
					/>
				</div>
			</form>
		</>
	);
}