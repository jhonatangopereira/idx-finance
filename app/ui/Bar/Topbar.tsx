'use client'

import Link from "next/link";
import Styles from "@/app/page.module.css";
import Image from "next/image";
import New from "@/app/components/Menu/New";
import { useState } from "react";
import AcoesUsuario from "@/app/components/Menu/AcoesUsuario";

export default function Topbar() {

    const userProfilePicture = "/images/users/profile/user.png"
    const [newOn, setNewOn] = useState(false)
    const [acoesUsuario, setAcoesUsuariosOn] = useState(false)

    const handleNew = () => {
        if (newOn === false) {
            setNewOn(true)
        } else {
            setNewOn(false)
        }
    }

    const handleAcoesUsuario = () => {
        if (acoesUsuario === false) {
            setAcoesUsuariosOn(true)
        } else {
            setAcoesUsuariosOn(false)
        }
    }

    return (
        <div className={Styles.Topbar}>
            <div>
                <ul>
                    <li>
                        <Link href="#" className={Styles.TopButton} id="novoBtn" onClick={handleNew}>
                            <Image
                                src="/images/icons/add.png"
                                width={12}
                                height={12}
                                alt="Add"
                            />
                            Novo
                        </Link>
                        {
                            newOn && (
                                <New setState={setNewOn}/>
                            )
                        }
                    </li>
                    {/* 
                    <li>
                        <Link href="#" className={Styles.TopButton}>
                        <Image
                                src="/images/icons/search.png"
                                width={12}
                                height={12}
                                alt="Search"
                            />
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className={Styles.TopButton}>
                        <Image
                                src="/images/icons/bell.png"
                                width={12}
                                height={12}
                                alt="Bell"
                            />
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className={Styles.TopButton}>
                        <Image
                                src="/images/icons/settings.png"
                                width={12}
                                height={12}
                                alt="Setting"
                            />
                        </Link>
                    </li>
                    
                    <li>
                        <Link href="#" className={Styles.TopButton}>
                            <Image
                                src="/images/icons/launch.png"
                                width={12}
                                height={12}
                                alt="Launch"
                            />
                        </Link>
                    </li> */}
                    <li>
                        <Link href="#" className={Styles.TopButton} onClick={handleAcoesUsuario}>
                            <Image
                                src={userProfilePicture}
                                width={40}
                                height={40}
                                alt="User profile picture"
                                className={Styles.ProfilePicture}
                            />
                        </Link>
                        {
                            acoesUsuario && (
                                <AcoesUsuario />
                            )
                        }
                    </li>
                </ul>
            </div>
        </div>
    );
}