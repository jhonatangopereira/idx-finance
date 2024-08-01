import Styles from "./page.module.css"

export default function Cadastro() {
    return (
        <main>
            <div className={Styles.Container}>
                <div className={Styles.BreadCrumb}>
                    <h2>Cadastro</h2>
                </div>
                <div>
                    <div className={Styles.Cadastro}>
                        <h2>Dados gerais</h2>
                        <form>
                            <div className={Styles.SecaoCadastro}>
                                <label>
                                    Tipo de pessoa
                                </label>
                                <select name="entity">
                                    <option>
                                        Pessoa Jurídica
                                    </option>
                                    <option>
                                        Pessoa Física
                                    </option>
                                    <option>
                                        Estrangeira
                                    </option>
                                </select>
                                <label>
                                    CNPJ
                                </label>
                                <input type="text" />
                                <label>
                                    Nome fantasia
                                </label>
                                <input type="text" />
                                <div className={Styles.SubSecaoCadastro}>
                                    <strong>
                                        Tipo de cliente
                                    </strong>
                                    <input type="radio" name="tipo-cliente" />
                                    <label>
                                        Cliente
                                    </label>
                                    <input type="radio" name="tipo-cliente" />
                                    <label>
                                        Fornecedor
                                    </label>
                                    <input type="radio" name="tipo-cliente" />
                                    <label>
                                        Transportadora
                                    </label>

                                    <label>
                                        Código de cadastro
                                    </label>
                                    <input type="text" />
                                </div>
                            </div>
                            <div className={Styles.SecaoCadastro}>
                                <h2>Informações adicionais</h2>
                                <label>
                                    E-mail principal
                                </label>
                                <input type="text" />
                                <label>
                                    Telefone comercial
                                </label>
                                <input type="text" />
                                <label>
                                    Telefone celular
                                </label>
                                <input type="text" />
                                <label>
                                    Abertura da empresa
                                </label>
                                <input type="text" />
                            </div>
                            <div className={Styles.SecaoCadastro}>
                                <h2>Informações fiscais</h2>
                                <label>
                                    Razão social
                                </label>
                                <input type="text" />

                                <strong>
                                    Optante pelo simples?
                                </strong>
                                <input type="radio" name="tipo-cliente" />
                                <label>
                                    Sim
                                </label>
                                <input type="radio" name="tipo-cliente" />
                                <label>
                                    Não
                                </label>
                                <strong>
                                    Orgão público?
                                </strong>
                                <input type="radio" name="tipo-cliente" />
                                <label>
                                    Sim
                                </label>
                                <input type="radio" name="tipo-cliente" />
                                <label>
                                    Não
                                </label>
                                <label>
                                    Indicador de inscrição estadual
                                </label>
                                <select>
                                    <option>
                                        Não contribuinte
                                    </option>
                                    <option>
                                        Contribuinte
                                    </option>
                                    <option>
                                        Contribuinte isento
                                    </option>
                                </select>
                                <label>
                                    Inscrição estadual
                                </label>
                                <input type="text" />
                                <label>
                                    Inscrição municipal
                                </label>
                                <input type="text" />
                            </div>
                            <div className={Styles.SecaoCadastro}>
                                <h2>Endereço</h2>
                                <label>
                                    Pessoa de contato
                                </label>
                                <input type="text" />
                                <label>
                                    Telefone comercial
                                </label>
                                <input type="text" />
                                <label>
                                    Telefone celular
                                </label>
                                <input type="text" />
                                <label>
                                    E-mail
                                </label>
                                <input type="text" />
                                <label>
                                    Cargo
                                </label>
                                <input type="text" />
                                <button>
                                    Adicionar contato
                                </button>
                            </div>
                            <div className={Styles.SecaoCadastro}>
                                <h2>Observações gerais</h2>
                                <label>
                                    Observações
                                </label>
                                <input type="text" />
                            </div>
                            <button type="submit">
                                Salvar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}