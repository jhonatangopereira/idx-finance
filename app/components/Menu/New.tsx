import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

export default function New({ setState }: Readonly<{ setState: Dispatch<SetStateAction<boolean>> }>) {
    function updateState() {
        setState(previousValue => !previousValue);
    }

    return (
        <div className="New">
            <ul>
                <li>
                    <Link href="/receber/criar" onClick={updateState}>
                        Receita
                    </Link>
                </li>
                <li>
                    <Link href="/pagar/criar" onClick={updateState}>
                        Despesa
                    </Link>
                </li>
            </ul>
        </div>
    )
}