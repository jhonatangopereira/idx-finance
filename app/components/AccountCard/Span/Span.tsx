import Styles from './component.module.css';
import { SpanProps } from './types';

export default function Span ({ children, situation }: Readonly<SpanProps>) {
    let situationStyle: string;
    switch (situation.toUpperCase()) {
        case 'PAGO':
        case 'RECEBIDO':
            situationStyle = Styles.PrimarySpan;
            break;
        case 'VENCIDO':
            situationStyle = Styles.SecondarySpan;
            break;
        case 'À VENCER':
            situationStyle = Styles.TertiarySpan;
            break;
        default:
            situationStyle = Styles.PrimarySpan;
            break;
    }

    return <span className={situationStyle}>{children ?? ""}</span>
}