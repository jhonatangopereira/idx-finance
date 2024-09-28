import AccountCard from "@/app/components/AccountCard/AccountCard";
import InforCard from '@/app/components/Analytics/InforCards';
import { format } from "date-fns";
import Styles from './component.module.css';
import { Income, Payment, TableComponentProps } from "./types";

// type Payment = {
//     created_at: string,
//     due_date: string,
//     expense: string | null,
//     id: number,
//     income: string | null,
//     installment: number,
//     payment_account: number,
//     payment_date: string,
//     payment_method: string,
//     release: string | null,
//     status: string,
//     value: number
// }

// type Income = {
//     id: number,
//     client: string,
//     competence: string,
//     description: string,
//     value: string,
//     department: string,
//     cost_center: string,
//     code: string,
//     observations: string,
//     status: string,
//     created_at: string,
//     financial_account: string,
//     payment: Payment[],
//     category: string | null,
//     apportionment: string | null,
//     attachment: string | null,
//     document_number: string | null,
//     user: number,
// }

// interface TableComponentProps {
//     data: Income[] | null;
//     linkTo: string,
// }

export default function IncomeTable({ data, linkTo }: Readonly<TableComponentProps>) {
 
    if (data !== null){
        data = data.map(account => {
            account.payment = account.payment.map(payment => {
                const date = new Date(payment.due_date);
                payment.due_date_formatted = format(new Date(date.getTime() + date.getTimezoneOffset()*60*1000), "dd/MM/yyyy");
                if (payment.status !== "Recebido") {   
                    if (date.getTime() < new Date().getTime() - 86400000) {
                        payment.status = "Vencido"
                    } else {
                        payment.status = "À vencer"
                    }
                }
                return payment;
            });

            account.payment = account.payment.toSorted((a: Payment, b: Payment) => {
                if (a.status === "Recebido" && b.status !== "Recebido") return 1;
                if (a.status !== "Recebido" && b.status === "Recebido") return -1;
                return b.due_date.localeCompare(a.due_date);
            });
            
            let statusForInstallments: string = "Recebido";
            account.payment.forEach(payment => {
                if (payment.status === "Vencido" || payment.status === "À vencer") {
                    statusForInstallments = payment.status;
                }
            });
            account.status = statusForInstallments;
            return account;
        });
        console.log("data", data);

        const sortedData = data.toSorted((a: Income, b:Income) => {
            const order = ["Vencido", "À vencer", "Recebido"];
            return order.indexOf(a.status) - order.indexOf(b.status) ||
                (a.payment.length ? new Date(a.payment[0].due_date).getTime() : 0) - (b.payment.length ? new Date(b.payment[0].due_date).getTime() : 0);
        });

        console.log("sortedData", sortedData);

        const totalValue = data.reduce((current, account) => {
                current += Number(account.value);
            return current
        }, 0);

        const totalOverdue = data.reduce((current, account) => {
            if (account.status == 'Vencido') {  
                current += Number(account.value);
            }

            return current
        }, 0);

        const totalPaid = data.reduce((current, account) => {
            if (account.status == 'Recebido') {  
                current += Number(account.value);
            }

            return current
        }, 0);

        const totalExpiring = data.reduce((current, account) => {
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
                        title="Recebidos"
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
                            <input type='checkbox' />
                        </div>
                        <div>
                            Cliente
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
                        {sortedData.map((account : any, index) => (
                            <div key={index}>
                                <AccountCard 
                                    id={account.id}
                                    description={account.description}
                                    maturity={account.payment.length > 0 ? format(new Date(account.payment[account.payment[0].installment - 1].due_date), 'dd/MM/yyyy') : "-"}
                                    value={Number(account.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    situation={account.status}
                                    installment_number={account.payment.length}
                                    current_installment={account.payment.length > 0 ? account.payment[0].installment : 0}
                                    linkTo={`${linkTo}/detalhes/${account.id}`}
                                    type="income"
                                    responsible={account.client ?? "-"}
                                    document_number={account.document_number ?? "-"}
                                    attachment_data={account.attachment}
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
