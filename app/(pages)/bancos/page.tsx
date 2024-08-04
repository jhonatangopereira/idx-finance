'use client'

import withAuth from '@/app/components/withAuth';
import Image from 'next/image';
import Link from 'next/link';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import closeIcon from '../../../public/images/icons/close.svg';
import { deleteAccountById } from '../../services/api/banks';
import Styles from './page.module.css';

// Account Popups
import AnotherAccountPopup from '../../components/AccountPopups/AnotherAccountPopup/AnotherAccount';
import AutomaticApplicationAccountPopup from '../../components/AccountPopups/AutomaticApplicationAccountPopup/AutomaticApplicationPopup';
import BoxAccountPopup from '../../components/AccountPopups/Box/BoxAccountPopup';
import CreditCardAccountPopUp from '../../components/AccountPopups/CreditCardAccountPopup/CreditCardAccount';
import EditAccountPopup from '../../components/AccountPopups/EditAccountPopup/EditAccountPopup';
import FinancialAccountPopup from '../../components/AccountPopups/FinancialAccountPopup/FinancialAccountPopup';
import InvestmentAccountPopup from '../../components/AccountPopups/InvestmentAccountPopup/InvestmentAccountPopup';
import SavingAccountPopup from '../../components/AccountPopups/SavingAccountPopup/SavingAccountPopup';
import ConfirmPopup from '../../components/ConfirmPopup/ConfirmPopup';
import { AccountData, ApiResponse } from './types';

const Bancos = () => {

    const Banks = {
        "Banco do Brasil": "001",
        "Bradesco": "237",
        "Itaú": "341",
        "Caixa Econômica Federal": "104",
        "Santander": "033",
        "Citibank": "745",
        "HSBC": "399",
        "Banco Safra": "422",
        "Banco Votorantim": "655",
        "Banrisul": "041",
        "Banco Original": "212",
        "Banco Inter": "077",
        "Banco de Brasília (BRB)": "070",
        "Banco Ribeirão Preto": "741",
        "Banco Mercantil do Brasil": "389",
        "Bancoob": "756",
        "Banestes": "021",
        "Unicred": "136",
        "Banco Semear": "743",
        "Banco Pottencial": "735",
        "Banco A.J. Renner": "654",
        "Banco INBURSA": "012",
        "Banco Sofisa": "637",
        "Banco Pine": "643",
        "Central Bank of Brazil": "091",
        "Outros": "000"
    };

    const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
    const [addAccountOpen, setAddAccountOpen] = useState<boolean>(false);
    const [financialAccountOpen, setFinancialAccountOpen] = useState<boolean>(false);
    const [boxAccountOpen, setBoxAccountOpen] = useState<boolean>(false);
    const [creditCardAccountOpen, setCreditCardAccountOpen] = useState<boolean>(false);
    const [investmentAccountOpen, setInvestmentAccountOpen] = useState<boolean>(false);
    const [automaticApplicationAccountOpen, setAutomaticApplicationAccountOpen] = useState<boolean>(false);
    const [savingAccountOpen, setSavingAccountOpenAccountOpen] = useState<boolean>(false);
    const [anotherAccountOpen, setAnotherAccountOpenAccountOpen] = useState<boolean>(false);
    const [editAccountOpen, setEditAccountOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [accountData, setAccountData] = useState<AccountData[]>([]);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [popupData, setPopupData] = useState({
        id: 0,
        account_name: '',
        description: '',
        account_account_modality: '',
        account_bank_name: '',
        account_account_type: '',
        finalBalance: ''
    })

    useEffect(() => {
        const cookies = parseCookies();
        console.log(cookies)
        setAuthToken(cookies.authToken);
        setUserId(cookies.userId);
    }, []);

    const cookies = parseCookies();

    useEffect(() => {
        if (authToken) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`${"https://idxfinance.com.br"}/api/financial-accounts/all/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${authToken}`,
                        },
                    });


                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const text = await response.text();
                    try {
                        const result: ApiResponse = JSON.parse(text);
                        if (result && Array.isArray(result.dados)) {
                            setAccountData(result.dados);

                        } else if (result && Array.isArray(result)) {
                            setAccountData(result);
                        } else {
                            console.error('A resposta da API não contém a estrutura esperada:', result);
                        }
                    } catch (jsonError) {
                        console.error('Erro ao analisar o JSON:', jsonError, 'Resposta recebida:', text);
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados:', error);
                } finally {
                    setIsLoading(false)
                }
            };
            fetchData();
        }
    }, [authToken]);


    const openEditPopup = (id: any, bankName: any, accountName: any, modality: any, type: any, description: any, finalBalance: any) => {
        setPopupData({
            id: id,
            account_name: accountName,
            account_bank_name: bankName,
            account_account_type: type,
            account_account_modality: modality,
            description: description,
            finalBalance: finalBalance
        })
        setEditAccountOpen(true);
    }

    const toggleAccountOpen = (): void => {
        setAddAccountOpen(previousValue => !previousValue);
    };

    const openPopUp = (name: string): void => {
        if (name === 'financialAccount') {
            setFinancialAccountOpen(true);
        } else if (name === 'boxAccount') {
            setBoxAccountOpen(true);
        } else if (name === 'creditCardAccount') {
            setCreditCardAccountOpen(true);
        } else if (name === 'investmentAccount') {
            setInvestmentAccountOpen(true);
        } else if (name === 'automaticApplicationAccount') {
            setAutomaticApplicationAccountOpen(true)
        } else if (name === 'savingAccount') {
            setSavingAccountOpenAccountOpen(true)
        } else if (name === 'anotherAccount') {
            setAnotherAccountOpenAccountOpen(true)
        } else if (name === 'editAccount') {
            setEditAccountOpen(true)
        }
    }

    const closePopUp = (name: string): void => {
        switch (name) {
            case 'financialAccount':
                setFinancialAccountOpen(false);
                break;
            case 'boxAccount':
                setBoxAccountOpen(false);
                break;
            case 'creditCardAccount':
                setCreditCardAccountOpen(false);
                break;
            case 'investmentAccount':
                setInvestmentAccountOpen(false);
                break;
            case 'automaticApplicationAccount':
                setAutomaticApplicationAccountOpen(false);
                break;
            case 'savingAccount':
                setSavingAccountOpenAccountOpen(false);
                break;
            case 'anotherAccount':
                setAnotherAccountOpenAccountOpen(false);
                break;
            case 'editAccount':
                setEditAccountOpen(false);
                break;
            default:
                break;
        }
    }
    const [accountIdToDelete, setAccountIdToDelete] = useState<number>(0);
    const handleDelete = async (id: number) => {
        setIsConfirmPopupOpen(true);
        setAccountIdToDelete(id)
    }

    const handleConfirmPopupClose = async (result: boolean) => {
        setIsConfirmPopupOpen(false);
        if (result) {
            try {
                const response = await deleteAccountById(cookies.authToken, accountIdToDelete);
                if (response.ok) {
                    alert('Conta excluída com sucesso');
                    window.location.reload();
                } else {
                    const errorData = await response.json();
                    alert('Falha ao excluir a conta. Erro: ' + errorData.message);
                }
            } catch (err) {
                alert('Falha ao excluir a conta.')
            }
        }
    }

    return (
        <main>
          {isConfirmPopupOpen && (
                <div className="ModalBackground">
                    <ConfirmPopup
                        text="Tem certeza que deseja excluir essa conta bancária?"
                        onClose={handleConfirmPopupClose}
                    />
                </div>
            )}
            <div className={Styles.Container}>
                <div className={Styles.BreadCrumb}>
                    <h2>Bancos</h2>
                </div>
                <div className={Styles.Section}>
                    <div className={Styles.OverviewBankAccounts}>
                        <span className={Styles.TextHeader}>Suas contas</span>
                        {accountData.length === 0 && isLoading === false && <p className={Styles.Loading}>Não há contas para mostrar.</p>}
                        {isLoading && <p className={Styles.Loading}>Carregando suas contas....</p>}
                        <ul>
                            <li className={Styles.BankAccount}>
                                <div className={Styles.TheBank}>
                                    <span className={Styles.AccountBankName}>
                                        Saldo total
                                    </span>
                                </div>
                                <span className={Styles.AccountBalanceDisplay}>
                                    R$ <strong>0,00</strong>
                                </span>
                                <Link href="#" className={Styles.AccountAction}>
                                    Obter extrato
                                </Link>
                            </li>
                            <li className={Styles.BankAccount} onClick={toggleAccountOpen}>
                                <Link href="" className={Styles.BankAccountButton}>
                                    <Image
                                        src="/images/icons/add-2.svg"
                                        width={32}
                                        height={32}
                                        alt='Add new account'
                                    />
                                    <span>
                                        Nova conta
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={Styles.Table}>
                    <div className={Styles.TableLabel}>
                        <div>
                            Conta
                        </div>
                        <div>
                            Banco
                        </div>
                        <div>
                            Tipo de conta
                        </div>
                        <div>
                            Status de cobrança
                        </div>
                        {/* <div>
                            Conciliação
                        </div> */}
                        <div>
                            Ações
                        </div>
                    </div>
                    {accountData.map((account, index) => (
                        <div className={Styles.TableData} key={index}>
                            <p>
                                {account.bank_name}
                            </p>
                            <p>
                                {Banks[(account.bank_name.toString()) as keyof typeof Banks]}
                            </p>
                            <p>
                                {account.account_type}
                            </p>
                            <p>
                                {account.status}
                            </p>
                            {/*  <p>
                                ver qual campo**
                            </p> */}
                            <div className={Styles.Actions}>
                                <Image
                                    alt="pencil icon"
                                    src="/images/icons/pencil.svg"
                                    width={29}
                                    height={29}
                                    onClick={() => {
                                        openEditPopup(account.id,
                                            account.bank_name,
                                            account.bank_name,
                                            account.account_modality,
                                            account.account_type,
                                            account.description,
                                            account.balance,
                                        )
                                    }}
                                />
                                <Image
                                    alt="pencil icon"
                                    src="/images/icons/trash.svg"
                                    width={29}
                                    height={29}
                                    onClick={() => handleDelete(account.id)}
                                />
                            </div>
                        </div>
                    ))}
                    {editAccountOpen && (
                        <EditAccountPopup
                            id={popupData.id}
                            description={popupData.description}
                            finalBalance={popupData.finalBalance}
                            onCloseFunction={() => closePopUp('editAccount')}
                            accountName={popupData.account_name}
                            modality={popupData.account_account_modality}
                            bank={popupData.account_bank_name}
                            type={popupData.account_account_type}
                        />
                    )}
                </div>
                {
                    addAccountOpen && (

                        <div className="ModalBackground">
                            <div className={Styles.AddAccountModal}>
                                <div className={Styles.AddAccount}>
                                    <header>
                                        <strong>
                                            Qual o tipo de conta que você quer cadastrar?
                                        </strong>
                                        <Image
                                            src={closeIcon}
                                            width={24}
                                            height={24}
                                            alt="Close icon"
                                            onClick={toggleAccountOpen}
                                        />
                                    </header>
                                    <ul>
                                        <li onClick={() => openPopUp('financialAccount')}>
                                            <Link href="#">
                                                <Image
                                                    src="/images/icons/bank-blue.svg"
                                                    width={24}
                                                    height={24}
                                                    alt='Bank icon'
                                                />
                                                Conta corrente
                                            </Link>
                                        </li>
                                        {/*   <li onClick={() => openPopUp('boxAccount')}>
                                        <Link href="#">
                                            <Image
                                                src="/images/icons/strongbox-blue.png"
                                                width={24}
                                                height={24}
                                                alt='Bank icon'
                                            />
                                            Caixinha
                                        </Link>
                                    </li>
                                    <li onClick={() => openPopUp('creditCardAccount')}>
                                        <Link href="#">
                                            <Image
                                                src="/images/icons/card-blue.png"
                                                width={24}
                                                height={24}
                                                alt='Bank icon'
                                            />
                                            Cartão de crédito
                                        </Link>
                                    </li>
                                    <li onClick={() => openPopUp('investmentAccount')}>
                                        <Link href="#">
                                            <Image
                                                src="/images/icons/money-blue.png"
                                                width={24}
                                                height={24}
                                                alt='Bank icon'
                                            />
                                            Investimento
                                        </Link>
                                    </li>
                                    <li onClick={() => openPopUp('automaticApplicationAccount')}>
                                        <Link href="#">
                                            <Image
                                                src="/images/icons/money-change-blue.png"
                                                width={24}
                                                height={24}
                                                alt='Bank icon'
                                            />
                                            Aplicação automática
                                        </Link>
                                    </li>
                                    <li onClick={() => openPopUp('savingAccount')} >
                                        <Link href="#">
                                            <Image
                                                src="/images/icons/dollar-circle-blue.png"
                                                width={24}
                                                height={24}
                                                alt='Bank icon'
                                            />
                                            Poupança
                                        </Link>
                                    </li>
                                    <li onClick={() => openPopUp('anotherAccount')}>
                                        <Link href="">
                                            <Image
                                                src="/images/icons/question-blue.png"
                                                width={14}
                                                height={24}
                                                alt='Bank icon'
                                            />
                                            Outro tipo de conta
                                        </Link>
                                    </li> */}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )
                }
                {financialAccountOpen && (

                    <FinancialAccountPopup onCloseFunction={() => closePopUp('financialAccount')} />
                )}
                {boxAccountOpen && (

                    <BoxAccountPopup onCloseFunction={() => closePopUp('boxAccount')} />
                )}
                {creditCardAccountOpen && (

                    <CreditCardAccountPopUp onCloseFunction={() => closePopUp('creditCardAccount')} />
                )}
                {investmentAccountOpen && (

                    <InvestmentAccountPopup onCloseFunction={() => closePopUp('investmentAccount')} />
                )}
                {automaticApplicationAccountOpen && (

                    <AutomaticApplicationAccountPopup onCloseFunction={() => closePopUp('automaticApplicationAccount')} />
                )}
                {savingAccountOpen && (

                    <SavingAccountPopup onCloseFunction={() => closePopUp('savingAccount')} />
                )}
                {anotherAccountOpen && (

                    <AnotherAccountPopup onCloseFunction={() => closePopUp('anotherAccount')} />
                )}
            </div>
        </main>
    );
}

export default withAuth(Bancos);
