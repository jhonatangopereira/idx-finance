import Styles from '@/app/page.module.css'

export default function Caixa() {
    return (
        <main>
            <div className={Styles.Container}>
                <div className={Styles.BreadCrumb}>
                    <h2>Fluxo de Caixa</h2>
                </div>
            </div>
        </main>
    );
}