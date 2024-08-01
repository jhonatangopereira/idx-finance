import { InforCardsProps } from "./inforCardsTypes";
import Styles from './component.module.css'
import Span from "./Span/Span";

export default function InforCard({ title, value, primary, secondary, tertiary }: Readonly<InforCardsProps>){

    return (
        <div className={Styles.InforCard}>
            <div className={Styles.InforCardPlaceholder}>
                <span>{title}</span>
            </div>
            <div className={Styles.InforCardData}>
                {primary && <Span primary>R$ {value}</Span >}
                {secondary && <Span secondary>R$ {value}</Span >}
                {tertiary && <Span tertiary>R$ {value}</Span >}
            </div>
        </div>
    );
}