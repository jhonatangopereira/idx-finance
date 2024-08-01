import Styles from "@/app/(pages)/bancos/page.module.css"
import { useState } from "react"
import Image from "next/image"
import AccountOptList from '@/app/components/Modal/AddAccountOptList'
import AccountForm from '@/app/components/Modal/AddAccountForm'

interface AddAccountProp{
    onClick: () => void;
}

const AddAccounts: React.FC<AddAccountProp> = ({ onClick }) => {

    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)
    const [selectedAccountIconPath, setSelectedAccountIconPath] = useState<string | null>(null)

    const handleSelectAccount = (accountId: string, accountPathIcon: string) => {
        setSelectedAccountId(accountId)
        setSelectedAccountIconPath(accountPathIcon)
    }

    return (
        <div className={Styles.AddAccountModal}>
            <div className={Styles.AddAccount}>
                <div className={Styles.Close}>
                    <button onClick={onClick}>
                        <Image
                            src="/images/icons/close-square.png"
                            width={24}
                            height={24}
                            alt='Close button'
                        />
                    </button>
                </div>
                {
                    selectedAccountId === null ? (
                        <AccountOptList onSelectAccount={handleSelectAccount} />
                    ) : (
                        <AccountForm accountName={selectedAccountId} accountPathIcon={selectedAccountIconPath} />
                    )
                }
            </div>
        </div>
    )
}

export default AddAccounts