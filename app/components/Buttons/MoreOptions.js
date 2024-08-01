import Image from "next/image"

export default function MoreOptions() {
    return (
        <div className="MoreOptions">
            <button>
                <Image
                    src="/images/icons/arrow-down.png"
                    width={24}
                    height={24}
                    alt="Mês anterior"
                />
            </button>
        </div>
    )
}