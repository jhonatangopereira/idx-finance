'use client'

import Styles from '@/app/page.module.css';
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