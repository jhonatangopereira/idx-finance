import Image from 'next/image'
import closeIcon from '../../../../public/images/icons/close.svg';
import blueQuestionIcon from '../../../../public/images/icons/blue-question.svg';
import Styles from './page.module.css';
import InputContainer from '../../InputContainer/InputContainer';
import ButtonForm from '../ButtonForm/ButtonForm';
import { AnotherAccountPopupProps } from './types';

export default function AnotherAccountPopup({ onCloseFunction }: AnotherAccountPopupProps) {
	return (
		<form className={Styles.Form}>
			<header>
	            <h2>
					Cadastre uma descrição para criar a sua conta.
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
	                src={blueQuestionIcon}
	                width={56}
	                height={56}
	                alt="Bank blue icon"
					className={Styles.BankIcon}
	            />
				<div className={Styles.InputDescription}>
					<InputContainer 
						inputPlaceholder='Descrição'
						inputType='text'
						labelText='Descrição da conta'
					/>
				</div>
        	</header>
        	<main className={Styles.Main}>
				<InputContainer 
					inputPlaceholder='R$0,00'
					inputType='number'
					labelText='Saldo inicial da conta'
				/>				
				<InputContainer 
					inputPlaceholder='DD/MM/AA'
					inputType='date'
					labelText='Data do saldo'
				/>
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
	);
}