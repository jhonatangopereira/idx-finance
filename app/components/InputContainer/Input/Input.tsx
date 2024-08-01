import Styles from './page.module.css';
import { InputProps } from './types';

export default function Input({ type, placeholder, required, value, name, onInput }: InputProps) {
    return (
        <input 
            className={Styles.Input} 
            type={type}
            placeholder={placeholder}
            required={required}
            value={value}
            onInput={onInput}
            name={name}
        />
    );
}