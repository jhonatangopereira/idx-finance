import Styles from './component.module.css';
import { SpanProps } from './types';

export default function Span ({ children, situation }: SpanProps) {
    if(situation.toUpperCase() === 'PAGO' || situation.toUpperCase() === 'RECEBIDO') {
        return <span className={Styles.PrimarySpan}>{children}</span>
    }

    if(situation.toUpperCase() === 'VENCIDO') {
        return <span className={Styles.SecondarySpan}>{children}</span>
    }

    if(situation.toUpperCase() === 'À VENCER' || situation.toUpperCase() === "VENCIDO") {
        return <span className={Styles.TertiarySpan}>{children}</span>
    }

    return <span></span>
}