
import Label from './Label/Label';
import Input from './Input/Input';
import Styles from './page.module.css';
import { InputContainerProps } from './types';

export default function InputContainer({ labelText, inputType, inputPlaceholder, value, name, onInput }: InputContainerProps) {
    return (
        <div className={Styles.InputContainer}>
            <Label>{labelText}</Label>
            <Input 
                type={inputType} 
                placeholder={inputPlaceholder} 
                onInput={onInput}
                required 
                value={value}
                name={name}
            />
        </div>
    );
}
