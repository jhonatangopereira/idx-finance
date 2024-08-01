import Styles from './component.module.css';
import { SpanProps } from './types';

export default function Span ({ primary, secondary, tertiary, children }: SpanProps) {

    if (primary) {
        return <span className={Styles.PrimarySpan}>{children}</span>
    }

    if (secondary) {
        return <span className={Styles.SecondarySpan}>{children}</span>
    }

    if (tertiary) {
        return <span className={Styles.TertiarySpan}>{children}</span>
    }
}