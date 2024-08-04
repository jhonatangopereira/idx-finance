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
                    Teste.
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