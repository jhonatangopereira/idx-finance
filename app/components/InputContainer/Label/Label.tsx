import Styles from './page.module.css';
import { LabelProps } from './types';

export default function Label({ children }: LabelProps) {
	return (
		<label className={Styles.Label}>
			{children}
		</label>
	); 
}