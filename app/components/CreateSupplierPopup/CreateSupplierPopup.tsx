'use client'

import ButtonForm from '@/app/components/AccountPopups/ButtonForm/ButtonForm';
import MessagePopup from '@/app/components/MessagePopup/MessagePopup';
import { createSupplier } from '@/app/services/api/supplier';
import Styles from './component.module.css';
import { CreateSupplierPopupProps, FormTypes } from './types';

import Image from 'next/image';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function CreateSupplierPopup ({ closeFunction }: Readonly<CreateSupplierPopupProps>) {

	const { handleSubmit, register } = useForm<FormTypes>();
	const cookies = parseCookies();
	const [popupData, setPopupData] = useState({
		open: false,
		text: '',
		title: ''
	});

	const getData = async (fields: FormTypes) => {
		const data = {
			name: fields.name,
			status: '-',
			description: '-'
		};

		try {
			const response = await createSupplier(data, cookies.authToken);

			if (response.ok) {
				handleClick();
				return setPopupData({
					open: true,
					title: 'Sucesso!',
					text: 'Fornecedor criado com sucesso.'
				});
			}

			throw new Error('Tente novamente mais tarde.');
		} catch (err) {
			if (err instanceof Error) {
				setPopupData({
					open: true,
					title: 'Ops, algo deu errado!',
					text: err.message
				}); 
			}
		}
	}

	const handleClick = () => {
		closeFunction(previousValue => !previousValue);
	}

	return (
		<>
			{popupData.open && (
				<MessagePopup
					title={popupData.title}
					text={popupData.text}
					setPopupState={setPopupData}
				/>
			)}
			<form onSubmit={handleSubmit(getData)} className={Styles.Form}>
				<header>
					<h2>
						Informe os dados do fornecedor
					</h2>		    
					<Image
						src='/images/icons/close.svg'
						width={24}
						height={24}
						alt="Close icon"
						className={Styles.CloseIcon}
						onClick={handleClick}
					/>      
				</header>
				<main className={Styles.Main}>
					<div className={Styles.LabelInputContainer}>
						<label className={Styles.Label}>Nome do fornecedor</label>
						<input 
							className={Styles.Input}
							{...register('name')}
							placeholder="Ex.: fornecedor X"
							required
						/>
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
							onclickFunction={handleClick}
						/>
					</div>
				</main>
			</form>
		</>
	);
}