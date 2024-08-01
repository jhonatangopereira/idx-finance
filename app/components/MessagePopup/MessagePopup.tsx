import Styles from './component.module.css';
import { Dispatch, SetStateAction } from 'react';

export default function MessagePopup ({ title, text, setPopupState }: { title: string, text: string, setPopupState: any }) {

	setTimeout(() => {	
		setPopupState({
			open: false
		})
	}, 5000);

	return (
		<div className={Styles.Popup}>
			<h1>{title}</h1>
			<p>{text}</p>
		</div>
	);
}