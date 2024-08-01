'use client'

import Link from "next/link"
import Styles from "./page.module.css"
import Image from "next"
import { usePathname } from "next/navigation"

const NavLink = ({ item }) => {
    const pathname = usePathname()

    return(
        <Link
            ref={item.path}
            className={`${Style.unactive} ${pathname === item.path && Styles.active}`}>
                <Image
                    src={item.icon}
                    width={16}
                    height={16}
                    alt={item.title}
                />
        </Link>
    );
}

export default NavLink