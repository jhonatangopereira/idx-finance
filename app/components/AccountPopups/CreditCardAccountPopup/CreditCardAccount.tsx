import Image from 'next/image'
import closeIcon from '../../../../public/images/icons/close.svg';
import cardIcon from '../../../../public/images/icons/card-blue.png';
import Styles from './page.module.css';
import InputContainer from '../../InputContainer/InputContainer';
import ButtonForm from '../ButtonForm/ButtonForm';
import { CreditCardPopupProps } from './types';

export default function CreditCardAccountPopup({ onCloseFunction }: CreditCardPopupProps) {
	return (
		<form className={Styles.Form}>
				<h2 className={Styles.Title}>
					Cadastre as informações do Cartão de Crédito
	            </h2>
			<header>	            
	            <Image
	                src={closeIcon}
	                width={24}
	                height={24}
	                alt="Close icon"
					className={Styles.CloseIcon}
					onClick={onCloseFunction}
	            />
	            <Image
	                src={cardIcon}
	                width={56}
	                height={56}
	                alt="Bank blue icon"
					className={Styles.CardIcon}
	            />
				<div className={Styles.Inputs}>
					<div className={Styles.DescriptionInput}>
						<InputContainer 
							inputPlaceholder='Descrição'
							inputType='text'
							labelText='Insira uma descrição'
						/>
					</div>
					<div className={Styles.FourLastDigitsInput}>
						<InputContainer 
							inputPlaceholder='Ex.: 1234'
							inputType='number'
							labelText='Últimos 4 digitos do cartão'
						/>
					</div>
					<div className={Styles.CardIssuer}>
						<InputContainer 
							inputPlaceholder='Selecione a empresa'
							inputType='text'
							labelText='Emissor do cartão'
						/>
					</div>
					<div className={Styles.DefaultAccountPayment}>
						<InputContainer 
							inputPlaceholder='Selecione a conta'
							inputType='text'
							labelText='Conta padrão para pagamento'
						/>
					</div>
					<div className={Styles.ClosingDayInput}>
						<InputContainer 
							inputPlaceholder='Dia de fechamento'
							inputType='date'
							labelText='Dia de fechamento'
						/>
					</div>
					<div className={Styles.DueDateInput}>
						<InputContainer 
							inputPlaceholder='Dia de vencimento'
							inputType='date'
							labelText='Dia de vencimento'
						/>
					</div>
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
        	</header>
		</form>
	);
}