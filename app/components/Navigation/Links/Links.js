"use client";

import Styles from "@/app/page.module.css";
import Logo from "@/app/ui/Logo/jsa";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Links() {
  const pathname = usePathname();

  return (
    <ul>
      <li className={Styles.ProductName}>
        <Logo />
      </li>
      <li>
        <Link
          href="/"
          className={`{Style.unactive} ${pathname == "/" && Styles.active}`}
        >
          <Image
            src="/images/icons/home-2.png"
            width={16}
            height={16}
            alt="Início"
            className={Styles.NavIcon}
          />
          <span>Início</span>
        </Link>
      </li>
      <li>
        <Link
          href="/bancos"
          className={`{Style.unactive} ${
            pathname == "/bancos" && Styles.active
          }`}
        >
          <Image
            src="/images/icons/cards.png"
            width={16}
            height={16}
            alt="Bancos"
            className={Styles.NavIcon}
          />
          <span>Bancos</span>
        </Link>
      </li>
      <li>
        <Link
          href="/receber"
          className={`{Style.unactive} ${
            pathname == "/receber" || pathname == "/receber/receita"
              ? Styles.active
              : ""
          }`}
        >
          <Image
            src="/images/icons/receipt-add.png"
            width={16}
            height={16}
            alt="Contas a Receber"
            className={Styles.NavIcon}
          />
          <span>Contas a Receber</span>
        </Link>
      </li>
      <li>
        <Link
          href="/pagar"
          className={`{Style.unactive} ${
            pathname == "/pagar" || pathname == "/pagar/despesa"
              ? Styles.active
              : ""
          }`}
        >
          <Image
            src="/images/icons/receipt-minus.png"
            width={16}
            height={16}
            alt="Contas a Pagar"
            className={Styles.NavIcon}
          />
          <span>Contas a Pagar</span>
        </Link>
      </li>
    </ul>
  );
}
