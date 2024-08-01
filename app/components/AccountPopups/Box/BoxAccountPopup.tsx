import Image from 'next/image'
import closeIcon from '../../../../public/images/icons/close.svg';
import strongBoxIcon from '../../../../public/images/icons/strongbox-blue.png';
import Styles from './page.module.css';
import InputContainer from '../../InputContainer/InputContainer';
import ButtonForm from '../ButtonForm/ButtonForm';
import { BoxPopupProps } from './types';

export default function BoxAccountPopup({ onCloseFunction }: BoxPopupProps) {
	return (
		<form className={Styles.Form}>
			<header>
	            <h2>
					Cadastre as informações da Caixinha
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
	                src={strongBoxIcon}
	                width={56}
	                height={56}
	                alt="Bank blue icon"
					className={Styles.BankIcon}
	            />
				<div className={Styles.InputDescription}>
					<InputContainer 
						inputPlaceholder='Descrição'
						inputType='text'
						labelText='Insira uma descrição'
					/>
				</div>
        	</header>
        	<main className={Styles.Main}>
				<InputContainer 
					inputPlaceholder='DD/MM/AA'
					inputType='date'
					labelText='Início dos lançamentos'
				/>
				<InputContainer 
					inputPlaceholder='R$0,00'
					inputType='number'
					labelText='Saldo final bancáro'
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