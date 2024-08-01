'use client'

import Link from "next/link"
import Logo from '@/app/ui/Logo/jsa'
import Image from "next/image"
import Styles from "@/app/page.module.css"
import { usePathname } from "next/navigation"

export default function Links() {
    const pathname = usePathname()

    return (
        <ul>
            <li className={Styles.ProductName}>
                <Logo />
            </li>
            <li>
                <Link
                    href="/"
                    className={`{Style.unactive} ${pathname == '/' && Styles.active}`}>
                    <Image
                        src="/images/icons/home-2.png"
                        width={16}
                        height={16}
                        alt="Início"
                        className={Styles.NavIcon}
                    />
                    Início
                </Link>
            </li>
            <li>
                <Link
                    href="/bancos"
                    className={`{Style.unactive} ${pathname == '/bancos' && Styles.active}`}>
                    <Image
                        src="/images/icons/cards.png"
                        width={16}
                        height={16}
                        alt="Bancos"
                        className={Styles.NavIcon}
                    />
                    Bancos
                </Link>
            </li>
            <li>
                <Link
                    href="/receber"
                    className={`{Style.unactive} ${pathname == '/receber' || pathname == '/receber/receita' ? Styles.active : ''}`}>
                    <Image
                        src="/images/icons/receipt-add.png"
                        width={16}
                        height={16}
                        alt="Contas a Receber"
                        className={Styles.NavIcon}
                    />
                    Contas a Receber
                </Link>
            </li>
            <li>
                <Link
                    href="/pagar"
                    className={`{Style.unactive} ${pathname == '/pagar' || pathname == '/pagar/despesa' ? Styles.active : ''}`}>
                    <Image
                        src="/images/icons/receipt-minus.png"
                        width={16}
                        height={16}
                        alt="Contas a Pagar"
                        className={Styles.NavIcon}
                    />
                    Contas a Pagar
                </Link>
            </li>
            {/*<li>
                <Link
                    href="/demonstrativo"
                    className={`{Style.unactive} ${pathname == '/demonstrativo' && Styles.active}`}>
                    <Image
                        src="/images/icons/chart.png"
                        width={16}
                        height={16}
                        alt="DRE"
                        className={Styles.NavIcon}
                    />
                    DRE
                </Link>
            </li>
            <li>
                <Link
                    href="/caixa"
                    className={`{Style.unactive} ${pathname == '/caixa' && Styles.active}`}>
                    <Image
                        src="/images/icons/note-2.png"
                        width={16}
                        height={16}
                        alt="Fluxo de Caixa"
                        className={Styles.NavIcon}
                    />
                    Fluxo de Caixa
                </Link>
            </li>
            <li>
                <Link
                    href="/orcamento"
                    className={`{Style.unactive} ${pathname == '/orcamento' && Styles.active}`}>
                    <Image
                        src="/images/icons/receipt.png"
                        width={16}
                        height={16}
                        alt="Orçamento"
                        className={Styles.NavIcon}
                    />
                    Orçamento
                </Link>
    </li>*/}
        </ul>
    );
}