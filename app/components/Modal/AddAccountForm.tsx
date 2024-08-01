import React from 'react'
import Styles from '@/app/(pages)/bancos/page.module.css'
import Image from 'next/image';

interface AccountFormProps {
    accountName: string | null;
    accountPathIcon: string | null;
}

const AccountForm: React.FC<AccountFormProps> = ({ accountName, accountPathIcon }) => {

    return (
        <>
            <strong>
                {`Cadastre as informações: ${accountName}`}
            </strong>
            <>
                <>
                    <form>
                        <div className={Styles.BankDetails}>
                            <Image
                                src={`/images/icons/${accountPathIcon}`}
                                width={56}
                                height={56}
                                alt="Bank icon"
                            />
                            <div>
                                {
                                    accountName === "Conta corrente" ? (
                                        <>
                                            <label htmlFor='banco'>
                                                Selecione o banco
                                            </label>
                                            <select name='banco' id='banco'>
                                                <option value="001">Banco do Brasil</option>
                                                <option value="104">Caixa Econômica Federal</option>
                                                <option value="237">Bradesco</option>
                                                <option value="341">Itaú Unibanco</option>
                                                <option value="033">Santander</option>
                                                <option value="422">Banco Safra</option>
                                                <option value="208">Banco BTG Pactual</option>
                                                <option value="655">Banco Votorantim</option>
                                                <option value="041">Banco Banrisul</option>
                                                <option value="212">Banco Original</option>
                                                <option value="077">Banco Inter</option>
                                                <option value="623">Banco Pan</option>
                                                <option value="707">Banco Daycoval</option>
                                                <option value="746">Banco Modal</option>
                                                <option value="633">Banco Rendimento</option>
                                                <option value="389">Banco Mercantil do Brasil</option>
                                                <option value="246">Banco ABC Brasil</option>
                                                <option value="643">Banco Pine</option>
                                                <option value="336">Banco C6</option>
                                                <option value="260">Nubank</option>
                                                <option value="260">Outros</option>
                                            </select>
                                        </>
                                    ) : (
                                        <>
                                            <label htmlFor="descricao">
                                                Insira uma descrição
                                            </label>
                                            <input type="text" placeholder="Descrição" name="descricao" id='descricao' />
                                        </>
                                    )
                                }

                            </div>
                        </div>
                        <div className={Styles.OtherDetails}>
                            {
                                accountName === "Caixinha" ? (
                                    <>
                                        <label htmlFor="descricao">
                                            Início dos lançamentos
                                        </label>
                                        <input type="text" placeholder="DD/MM/AAAA" name="inicioLancamento" id='inicioLancamento' />
                                    </>
                                ) : (
                                    <>
                                        <label htmlFor="descricao">
                                            Insira uma descrição
                                        </label>
                                        <input type="text" placeholder="Descrição" name="descricao" id='descricao' />
                                    </>
                                )
                            }
                            <label htmlFor="saldo">
                                Saldo final bancário
                            </label>
                            <input type="text" placeholder="R$ 0,00" name="saldo" id='saldo' />
                        </div>
                        {
                            accountName === "Conta corrente" ? (
                                <>
                                    <div className={Styles.CheckArea}>
                                        <input type="checkbox" name="contapadrao" id='contapadrao' />
                                        <label htmlFor='contapadrao'>
                                            Quero que essa seja minha conta padrão
                                        </label>
                                    </div>
                                    <div className={Styles.DetalhesConta}>
                                        <span>Modalidade da conta</span>
                                        <div className={Styles.RadioArea}>
                                            <input type="radio" name='tipoconta' id='pj' />
                                            <label htmlFor='pj'>
                                                Conta Pessoa Jurídica - PJ
                                            </label>
                                        </div>
                                        <div className={Styles.RadioArea}>
                                            <input type="radio" name='tipoconta' id='pf' />
                                            <label htmlFor='pf'>
                                                Conta Pessoa Física - PF
                                            </label>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <></>
                            )
                        }
                        {
                            accountName === "Cartão de crédito" ? (
                                <>
                                    <div className={Styles.OtherDetails}>
                                        <label htmlFor="numCartao">
                                            Ultímos 4 dígitos do cartão
                                        </label>
                                        <input type="text" placeholder="Ex: 1234" name="numCartao" id='numCartao' />
                                    </div>
                                    <div className={Styles.OtherDetails}>
                                        <label htmlFor="emissorCartao">
                                            Emissor do cartão
                                        </label>
                                        <input type="text" placeholder="Mastercard, Visa..." name="emissorCartao" id='emissorCartao' />
                                    </div>
                                    <div className={Styles.OtherDetails}>
                                        <label htmlFor="emissorCartao">
                                            Fechamento do cartão
                                        </label>
                                        <input type="text" placeholder="DD/MM/AAAA" name="emissorCartao" id='emissorCartao' />
                                    </div>
                                    <div className={Styles.OtherDetails}>
                                        <label htmlFor="emissorCartao">
                                            Vencimento do cartão
                                        </label>
                                        <input type="text" placeholder="DD/MM/AAAA" name="emissorCartao" id='emissorCartao' />
                                    </div>
                                </>
                            ) : (
                                <></>
                            )
                        }
                        <div className={Styles.AcoesForm}>
                            <input type='submit' value="Salvar" />
                            <button>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </>
            </>
        </>
    )
}

export default AccountForm