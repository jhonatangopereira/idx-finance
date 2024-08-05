'use client'

import Styles from './component.module.css';
import ButtonForm from '@/app/components/AccountPopups/ButtonForm/ButtonForm';
import { FormTypes, CreateCostCenterPopupProps, ErrorType } from './types';
import { createCostCenter } from '@/app/services/api/costCenter';
import MessagePopup from '@/app/components/MessagePopup/MessagePopup';

import { useForm } from 'react-hook-form';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import Image from 'next/image';

export default function CreateCostCenter ({ closeFunction }: CreateCostCenterPopupProps) {

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
			department: ','
		};

		try {
			const response = await createCostCenter(data, cookies.authToken);

			if (response.ok) {
				return setPopupData({
					open: true,
					title: 'Sucesso!',
					text: 'Centro de custo criado com sucesso.'
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
			                Informe os dados do centro de custo
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
							<label className={Styles.Label}>Nome do centro de custo</label>
							<input 
								className={Styles.Input}
								{...register('description')}
								placeholder="Ex.: material de escritório"
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