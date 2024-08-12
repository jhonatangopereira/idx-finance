'use client'

import ExportXlsx from '@/app/components/Buttons/import-expenses';
import ExpenseTable from '@/app/components/Tables/ExpenseTable/ExpenseTable';
import withAuth from '@/app/components/withAuth';
import Styles from '@/app/page.module.css';
import { getAllExpenses } from '../../services/api/expenses';
import { ApiResponse, Expense } from './types';

import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';

const Pagar = () => {

    const [data, setData] = useState<Expense[] | []>([]);
    const [isLoading, setIsLoading] = useState(true)
    const [authToken, setAuthToken] = useState<string | null>(null);

    useEffect(() => {
        const { authToken } = parseCookies();
        setAuthToken(authToken);
    }, []);

    useEffect(() => {
        if (authToken) {
            const fetchData = async () => {
                try {
                    const response = await getAllExpenses(authToken);

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const text = await response.text();
                    try {
                        const result: ApiResponse = JSON.parse(text);
                        if (result && Array.isArray(result.dados)) {
                            setData(result.dados);
                        } else if (result && Array.isArray(result)) {
                            setData(result);
                        } else {
                            console.error('A resposta da API não contém a estrutura esperada:', result);
                        }
                    } catch (jsonError) {
                        console.error('Erro ao analisar o JSON:', jsonError, 'Resposta recebida:', text);
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [authToken]);

    return (
        <main>
            <div className={Styles.Container}>
                <div className={Styles.BreadCrumb}>
                    <h2>Contas a Pagar</h2>
                </div>
                <ExportXlsx />
                {data.length === 0 && isLoading === false && <p className={Styles.Loading}>Não há despesas para mostrar.</p>}
                {isLoading && <p className={Styles.Loading}>Carregando despesas...</p>}               
                {data.length > 0 ? <ExpenseTable data={data} linkTo='pagar' /> : <ExpenseTable data={null} linkTo='pagar' />}
            </div>
        </main>
    );
}

export default withAuth(Pagar);
