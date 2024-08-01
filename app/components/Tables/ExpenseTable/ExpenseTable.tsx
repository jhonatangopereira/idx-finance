import AccountCard from "@/app/components/AccountCard/AccountCard";
import InforCard from '@/app/components/Analytics/InforCards';
import Styles from './component.module.css';
import { Expense, TableComponentProps } from "./types";

export default function Table({ data, linkTo }: Readonly<TableComponentProps> ) {
    function checkAllBoxes() {
        return;
    }

    if (data !== null) {
        const totalValue = data.reduce((current: number, account: Expense) => {
            current += Number(account.value);
            return current
        }, 0);

        const totalOverdue = data.reduce((current: number, account: Expense) => {
            if (account.status == 'Vencido') {  
                current += Number(account.value);
            }
            return current
        }, 0);

        const totalPaid = data.reduce((current: number, account: Expense) => {
            if (account.status == 'Pago') {  
                current += Number(account.value);
            }
            return current
        }, 0);

        const totalExpiring = data.reduce((current: number, account: Expense) => {
            if (account.status == 'À vencer') {  
                current += Number(account.value);
            }
            return current
        }, 0);

        return (
            <>
                <header className={Styles.Header}>
                    <InforCard 
                        title="Valor total"
                        value={totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        tertiary
                    />
                    <InforCard 
                        title="Vencidos"
                        value={totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        secondary
                    />
                    <InforCard 
                        title="Pagos"
                        value={totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        primary
                    />
                    <InforCard     
                        title="À vencer"
                        value={totalExpiring.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        tertiary
                    />     
                </header>       
                <div className={Styles.Table}>
                    <div className={Styles.TableLabel}>
                        <div>
                            <input type='checkbox' onClick={() => checkAllBoxes()} />
                        </div>
                        <div>
                            Descrição
                        </div>
                        <div>
                            Vencimento
                        </div>
                        <div>
                            Valor
                        </div>
                        <div>
                            Situação
                        </div>
                    </div>
                    <div className={Styles.TableContent}>
                        {data.map((account: any, index: number) => (                            
                            <div key={index}>
                                <AccountCard 
                                    description={account.description}
                                    maturity={account.competence}
                                    value={Number(account.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    situation={account.status}
                                    linkTo={`${linkTo}/detalhes/${account.id}`}
                                    id={Number(account.id)}
                                    type="expense"
                                />
                                <div className={Styles.LineSeparator}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )
    } 
    return (
            <>
                <header className={Styles.Header}>
                    <InforCard 
                        title="Valor total"
                        value={"0"}
                        tertiary
                    />
                    <InforCard 
                        title="Vencidos"
                        value={"0"}
                        secondary
                    />
                    <InforCard 
                        title="Pagos"
                        value={"0"}
                        primary
                    />
                    <InforCard     
                        title="À vencer"
                        value={"0"}
                        tertiary
                    />     
                </header>       
                <div className={Styles.Table}>
                    <div className={Styles.TableLabel}>
                        <div>
                            <input type='checkbox' />
                        </div>
                        <div>
                            Descrição
                        </div>
                        <div>
                            Vencimento
                        </div>
                        <div>
                            Valor
                        </div>
                        <div>
                            Situação
                        </div>
                    </div>
                   
                </div>
            </>
        )
}
