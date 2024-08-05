import Styles from './component.module.css';
import Image from 'next/image';
import InputContainer from '../../InputContainer/InputContainer';
import ButtonForm from '../ButtonForm/ButtonForm';
import { EditAccountPopupProps } from './types';
import MessagePopup from '../../MessagePopup/MessagePopup';

import { useState, ChangeEvent, useEffect } from 'react';
import { parseCookies } from 'nookies';
import { useForm } from 'react-hook-form';

export default function EditAccountPopup({ onCloseFunction, accountName, bank, type, modality, description, id, finalBalance }: EditAccountPopupProps) {
	const [nameValue, setNameValue] = useState(() => accountName);
	const [bankValue, setBankValue] = useState(() => bank);
	const [typeValue, setTypeValue] = useState(() => type);
	const [modalityValue, setModalityValue] = useState(() => modality);
	const cookies = parseCookies();	
	const { handleSubmit, register, setValue } = useForm();
    const [popUpData, setPopUpData] = useState({
        open: false,
        title: '',
        text: ''
    });

	const handleEdit = async (data: any) => {
		await fetch(`${"https://idxfinance.com.br"}/api/financial-accounts/update/${id}/`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Token ${cookies.authToken}`,
			},
			body: JSON.stringify(data),
		})
			.then(response => response.json())
			.then(() => {
				setPopUpData({
					open: true,
					title: "Sucesso!",
					text: 'Dados do banco atualizados.'
				});
				setTimeout(() => window.location.reload(), 3000);
			})
			.catch(error => {
				setPopUpData({
					open: true,
					title: "Ops, algo de errado!",
					text: 'Falha ao atualizar os dados do banco. Tente novamente mais tarde.'
				});				
			});
	};

	const getData = async (fields: any) => {		
		const data = {
			bank_name: fields.bankName,
			account_number: 0,
			agency_number: 0,
			balance: Number(fields.finalBalance.replace(",", ".")),
			description: fields.description,
			status: "-",
			account_type: "Conta Corrente",
			account_modality: fields.accountModality,
			user: cookies.userId,
		};
		console.log(data)
		console.log(cookies.userId)
		await handleEdit(data);
	};

	useEffect(() => {
		setValue("accountName", accountName);
		setValue("bankName", bank);
		setValue("accountType", type);
		setValue("accountModality", modality);
		setValue("description", description);
		setValue("finalBalance", finalBalance.replace(".", ","));
	}, [accountName, bank, type, modality, setValue]);

	return (
		<>
			{popUpData.open && <MessagePopup title={popUpData.title} text={popUpData.text} setPopupState={setPopUpData}/>}
			<form onSubmit={handleSubmit(getData)} className={Styles.Container}>
				<header>
					<h1>Informações da conta</h1>
					<Image
						src='/images/icons/close.svg'
						width={24}
						height={24}
						alt="Close icon"
						className={Styles.CloseIcon}
						onClick={onCloseFunction}
					/>
				</header>
				<div className={Styles.InputsContainer}>
					<div className={Styles.Input}>
						<label>Nome da conta</label>
						<div>
							<input
								placeholder='Nome da conta'
								{...register("accountName")}
								onInput={(e: ChangeEvent<HTMLInputElement>) => setNameValue(e.target.value)}
								type="text"
							/>
							<Image
								alt="Pencil icon"
								width={12}
								height={12}
								src="/images/icons/pencil-without-background.svg"
							/>
						</div>
					</div>
					<div className={Styles.Input}>
						<label>Banco</label>
						<div>
							<select {...register("bankName")}>					
								<option value="Banco do Brasil">Banco do Brasil</option>
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
								<option value="Outros">Outros</option>
							</select>
							<Image
								alt="Pencil icon"
								width={12}
								height={12}
								src="/images/icons/pencil-without-background.svg"
							/>
						</div>
					</div>
					<div className={Styles.Input}>
						<label>Tipo de conta</label>
						<div>
							<input
								placeholder='Tipo de conta'
								{...register("accountType")}
								value="Conta Corrente"
								onInput={(e: ChangeEvent<HTMLInputElement>) => setTypeValue(e.target.value)}
								type="text"
							/>
							<Image
								alt="Pencil icon"
								width={12}
								height={12}
								src="/images/icons/pencil-without-background.svg"
							/>
						</div>
					</div>
					<div className={Styles.Input}>
						<label>Modalidade</label>
						<div>
							<select {...register("accountModality")}>
								<option value="PF">PF</option>
								<option value="PJ">PJ</option>		
							</select>
							<Image
								alt="Pencil icon"
								width={12}
								height={12}
								src="/images/icons/pencil-without-background.svg"
							/>
						</div>
					</div>
					<div className={Styles.Input}>
						<label>Saldo bancário inicial</label>
						<div>
							<input
								placeholder='Ex.: R$120,0'
								{...register("finalBalance")}
								onInput={(e: ChangeEvent<HTMLInputElement>) => setNameValue(e.target.value)}
								type="text"
							/>
							<Image
								alt="Pencil icon"
								width={12}
								height={12}
								src="/images/icons/pencil-without-background.svg"
							/>
						</div>
					</div>
					<div className={Styles.Input}>
						<label>Descrição</label>
						<div>
							<input
								placeholder='Descrição'
								{...register("description")}
								onInput={(e: ChangeEvent<HTMLInputElement>) => setNameValue(e.target.value)}
								type="text"
							/>
							<Image
								alt="Pencil icon"
								width={12}
								height={12}
								src="/images/icons/pencil-without-background.svg"
							/>
						</div>
					</div>
				</div>
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
