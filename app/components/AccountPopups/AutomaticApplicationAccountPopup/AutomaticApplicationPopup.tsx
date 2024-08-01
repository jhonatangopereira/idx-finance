import Image from 'next/image'
import closeIcon from '../../../../public/images/icons/close.svg';
import blueDollarIcon from '../../../../public/images/icons/blue-dollar.svg';
import Styles from './page.module.css';
import InputContainer from '../../InputContainer/InputContainer';
import ButtonForm from '../ButtonForm/ButtonForm';
import { AutomaticaApplicationopupProps } from './types';

export default function AutomaticApplicationAccountPopup({ onCloseFunction }: AutomaticaApplicationopupProps) {
	return (
		<form className={Styles.Form}>
			<header>
	            <h2>
					Cadastre as informações da Aplicação Automática
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
	                src={blueDollarIcon}
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
				<div className={Styles.SelectBank}>
					<label className={Styles.SelectLabel} htmlFor="bankType">Banco</label>
					<select name="banks">
					    <option value="001">Banco do Brasil</option>
					    <option value="237">Bradesco</option>
					    <option value="341">Itaú</option>
					    <option value="104">Caixa Econômica Federal</option>
					    <option value="033">Santander</option>
					    <option value="745">Citibank</option>
					    <option value="399">HSBC</option>
					    <option value="422">Banco Safra</option>
					    <option value="655">Banco Votorantim</option>
					    <option value="422">Banco Safra</option>
					    <option value="033">Banco Santander</option>
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
					    <option value="001">Banco Agiplan</option>
					    <option value="637">Banco Sofisa</option>
					    <option value="655">Banco Votorantim</option>
					    <option value="643">Banco Pine</option>
					    <option value="741">Banco Ribeirão Preto</option>
					    <option value="091">Central Bank of Brazil</option>
					    <option value="000">Outros</option>
					</select>
				</div>
				<div className={Styles.LinkedCurrentAccount}>
					<InputContainer 
						inputPlaceholder='Selecione a conta'
						inputType='text'
						labelText='Conta corrente para veiculada'
					/>
				</div>
				<InputContainer 
					inputPlaceholder='Ex.: R$0,00'
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