import Image from "next/image"

export default function Logo(){
    return(
        <Image
            src="/images/jsa/logo.png"
            width={200}
            height={66}
            alt="JSA Logo"
            />
    );
}