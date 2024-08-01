'use client'

import { Suspense } from 'react';
import Styles from '@/app/page.module.css';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import withAuth from './components/withAuth';

function Content() {
    return (
        <div className={Styles.Container}>
            <div className={Styles.BreadCrumb}>
                <h2>Bem-vindo</h2>
            </div>
            <div className={Styles.Notice}>
                <p>
                    Esta é uma versão alpha, destinada apenas aos stakeholders do projeto com recursos limitados. Para bugs, pedimos que sejam reportados através do formulário de <Link target='_blank' href="https://forms.clickup.com/9017108773/f/8cqca95-677/8DZ9C9WKXYM8XL9D18">bug report</Link>. Para solicitar novas features, por favor preencher o formulário de <Link target='_blank' href="https://forms.clickup.com/9017108773/f/8cqca95-2117/JITSMLFTK50D85HHHB">solicitação de produto</Link>, já para feedbacks relacionados a usabilidade, clique <Link target='_blank' href="mailto:team@mindindex.org?subject=Feedback de usabilidade: JSA Finance v0.1.28.2024">aqui</Link>.
                </p>
            </div>
        </div>
    );
}

const Home = () => {
    return (
        <main>
            <Content />
        </main>
    );
}

export default withAuth(Home)