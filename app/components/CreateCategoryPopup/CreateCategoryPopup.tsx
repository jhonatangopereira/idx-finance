'use client'

import ButtonForm from '@/app/components/AccountPopups/ButtonForm/ButtonForm';
import MessagePopup from '@/app/components/MessagePopup/MessagePopup';
import { createFinancialCategory } from '@/app/services/api/financialCategory';
import Styles from './component.module.css';
import { CreateCategoryPopupProps, FormTypes } from './types';

import Image from 'next/image';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function CreateCategoryPopup ({ closeFunction }: CreateCategoryPopupProps) {

	const { handleSubmit, register } = useForm<FormTypes>();
	const cookies = parseCookies();
	const [popupData, setPopupData] = useState({
		open: false,
		text: '',
		title: ''
	});

	const getData = async (fields: FormTypes) => {
		const data = {
			description: fields.description,
			status: '-',
			code: ','
		};

		try {
			const response = await createFinancialCategory(data, cookies.authToken);

			if (response.ok) {
				handleClick();
				return setPopupData({
					open: true,
					title: 'Sucesso!',
					text: 'Categoria criada com sucesso.'
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
			                Informe os dados da categoria
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
							<label className={Styles.Label}>Nome da categoria</label>
							<input 
								className={Styles.Input}
								{...register('description')}
								placeholder="Insira a categoria"
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