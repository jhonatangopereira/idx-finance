import Link from "next/link"
import Image from "next/image"

interface AccountOpt {
    id: number;
    name: string;
    pathIcon: string;
}

interface AccountOptProp {
    onSelectAccount: (accountName: string, accountPathIcon: string) => void
}

const accounts: AccountOpt[] = [
    { id: 0, name: 'Conta corrente', pathIcon: 'bank-blue.png' },
    { id: 1, name: 'Caixinha', pathIcon: 'strongbox-blue.png' },
    { id: 2, name: 'Cartão de crédito', pathIcon: 'card-blue.png' },
    { id: 3, name: 'Investimento', pathIcon: 'money-blue.png' },
    { id: 4, name: 'Aplicação automática', pathIcon: 'money-change-blue.png' },
    { id: 5, name: 'Poupança', pathIcon: 'dollar-circle-blue.png' },
    { id: 6, name: 'Outro tipo de conta', pathIcon: 'question-blue.png' },
];

const AccountOptList: React.FC<AccountOptProp> = ({ onSelectAccount }) => {
    return (
        <>
            <>
                <strong>Qual o tipo de conta você quer cadastrar?</strong>
            </>
            <ul>
                {
                    accounts.map(account => (
                        <li key={account.name}>
                            <Image
                                key={account.pathIcon}
                                src={`/images/icons/${account.pathIcon}`}
                                width={24}
                                height={24}
                                alt='Bank icon'
                            />
                            <Link
                                href="#"
                                key={account.name}
                                onClick={() => onSelectAccount(account.name, account.pathIcon)}
                            >
                                {account.name}
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </>
    )
}

export default AccountOptList