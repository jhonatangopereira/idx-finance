import AccountCard from "@/app/components/AccountCard/AccountCard";
import InforCard from '@/app/components/Analytics/InforCards';
import { format } from "date-fns";
import Styles from './component.module.css';
import { Expense, Payment, TableComponentProps } from "./types";

export default function Table({ data, linkTo }: Readonly<TableComponentProps> ) {
    function checkAllBoxes() {
        return;
    }

    if (data !== null) {
        data = data.map(account => {
            account.payment = account.payment.toSorted((a: Payment, b: Payment) => {
                if (a.status === "Pago" && b.status !== "Pago") return 1;
                if (a.status !== "Pago" && b.status === "Pago") return -1;
                return a.due_date.localeCompare(b.due_date);
            });
            let statusForInstallments: string = "Pago";
            account.payment.forEach(payment => {
                if (payment.status === "À vencer" || payment.status === "Vencido") statusForInstallments = payment.status;
            })
            account.status = statusForInstallments;
            return account;
        });
        console.log("data", data);

        const sortedData = data.toSorted((a: Expense, b:Expense) => {
            const order = ["Vencido", "À vencer", "Pago"];
            return order.indexOf(a.status) - order.indexOf(b.status);
        });

        console.log("sortedData", sortedData);

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
                            Fornecedor
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
                            Número do documento
                        </div>
                        <div>
                            Situação
                        </div>
                    </div>
                    <div className={Styles.TableContent}>
                        {sortedData.map((account: any, index: number) => (
                            <div key={index}>
                                <AccountCard 
                                    responsible={account.supplier_name ?? "-"}
                                    description={account.description ?? "-"}
                                    maturity={account.payment.length > 0 ? format(new Date(account.payment[account.payment[0].installment - 1].due_date), 'dd/MM/yyyy') : "-"}
                                    value={Number(account.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    situation={account.status}
                                    document_number={account.document_number ?? "-"}
                                    attachment_data={account.attachment ?? null}
                                    installment_number={account.payment.length}
                                    current_installment={account.payment.length ? account.payment[0].installment : 0}
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
