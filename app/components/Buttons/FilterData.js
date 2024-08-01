import Image from "next/image"
import MoreOptions from "@/app/components/Buttons/MoreOptions"

export default function FilterData() {
    return (
        <div className="Filters">
            <div className="SelecionarPeriodo">
                <button>
                    <Image
                        src="/images/icons/arrow-left.png"
                        width={24}
                        height={24}
                        alt="Mês anterior"
                    />
                </button>
                <button className="btnFilter">
                    <strong>
                        Últimos 7 dias
                    </strong>
                    <Image
                        src="/images/icons/arrow-down.png"
                        width={24}
                        height={24}
                        alt="Mês anterior"
                    />
                </button>
                <button>
                    <Image
                        src="/images/icons/arrow-right.png"
                        width={24}
                        height={24}
                        alt="Próximo mês"
                    />
                </button>
            </div>
            <div>
                <button className="OtherFilters">
                    <span>
                        Filtros
                    </span>
                    <Image
                        src="/images/icons/arrow-down.png"
                        width={24}
                        height={24}
                        alt="Mês anterior"
                    />
                </button>
            </div>
            <MoreOptions />
        </div>
    )
}