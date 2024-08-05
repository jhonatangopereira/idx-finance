'use client'

import IncomeTable from '@/app/components/Tables/IncomeTable/IncomeTable';
import Styles from '@/app/page.module.css';
import ImportXlsx from '@/app/components/Buttons/import-export-xlsx';
import withAuth from '@/app/components/withAuth';
import { DataItem, ApiResponse } from './types';
import MessagePopup from '../../components/MessagePopup/MessagePopup';

import React, { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';

const Receber = () => {
    const [data, setData] = useState<DataItem[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [popUpData, setPopUpData] = useState({
        open: false,
        title: '',
        text: ''
    });

    useEffect(() => {
        const cookies = parseCookies();
        setAuthToken(cookies.authToken);
    }, []);

    useEffect(() => {
        if (authToken) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`${"https://idxfinance.com.br"}/api/incomes/all/`, {
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
                            setData(result.dados);
                        } else if (result && Array.isArray(result)) {
                            setData(result);
                        } else {
                            setPopUpData({
                                open: true,
                                title: `Ops, algo deu errado!`,
                                text: `A resposta da API não contém a estrutura esperada: ${result}`
                            });
                        }
                    } catch (jsonError) {
                        setPopUpData({
                            open: true,
                            title: `Erro ao analisar o JSON: ${jsonError}`,
                            text: `Resposta recebida: ${text}`
                        });
                    }
                } catch (error) {
                    setPopUpData({
                        open: true,
                        title: 'Ops, algo deu errado!',
                        text: `Erro ao buscar dados: ${error}`
                    });
                } finally {
                    setIsLoading(false)
                }
            };
            fetchData();
        }
    }, [authToken]);

    return (
        <main>         
            {popUpData.open && <MessagePopup title={popUpData.title} text={popUpData.text} setPopupState={setPopUpData}/>}   
            <div className={Styles.Container}>
                <div className={Styles.BreadCrumb}>
                    <h2>Contas a Receber</h2>
                </div>
                <ImportXlsx />
                {isLoading && <p className={Styles.Loading}>Carregando receitas....</p>}   
                {data.length === 0 && isLoading === false && <p className={Styles.Loading}>Não há receitas para mostrar.</p>}            
                {data.length > 0 ? <IncomeTable data={data} linkTo='receber' /> : <IncomeTable data={null} linkTo='receber' />}
            </div>
        </main>
    );
}

export default withAuth(Receber);
