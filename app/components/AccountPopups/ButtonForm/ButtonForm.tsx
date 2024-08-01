import { ButtonFormProps } from "./types";
import Styles from './page.module.css';

export default function ButtonForm({ text, type, primary, secondary, onclickFunction }: ButtonFormProps) {
    
    if(primary === true) {
        return (
            <button onClick={onclickFunction} className={Styles.PrimaryButton} type={type}>
                {text}
            </button>
        )
    }
    
    return (
        <button  onClick={onclickFunction} className={Styles.SecondaryButton} type={type}>
            {text}
        </button>
    )
}