import Link from "next/link";

export default function AcoesUsuario() {
    return (
        <div className="New">
            <ul>
                <li>
                    <Link href="/logout">
                        Sair
                    </Link>
                </li>
            </ul>
        </div>
    )
}