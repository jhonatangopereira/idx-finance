import Image from "next/image"

export default function Logo(){
    return(
        <Image
            src="/images/idx/logo_IDX.png"
            width={190}
            height={120}
            alt="IDX Logo"
            />
    );
}