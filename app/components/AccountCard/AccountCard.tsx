import pencilIcon from '@/public/images/icons/pencil.svg';
import downloadIcon from '@/public/images/icons/download.svg';
import trashIcon from '@/public/images/icons/trash.svg';
import Image from 'next/image';
import Link from 'next/link';
import { parseCookies } from 'nookies';
import { deleteExpense } from '../../services/api/expenses';
import { deleteIncomeById } from '../../services/api/incomes';
import Styles from './component.module.css';
import Span from './Span/Span';
import { AccountCardProps } from './types';

export default function AccountCard ({ responsible, description, maturity, situation, value, document_number, linkTo, id, type }: Readonly<AccountCardProps>) {

    const { authToken }  = parseCookies()
    
    const handleClick = async () => {
        try {
            const validation = confirm("Tem certeza que deseja excluir essa despesa?")

            if (validation) {
                if (type === 'expense') {
                    await deleteExpense(authToken, id);
                    alert('Despesa excluída com sucesso!');   
                    window.location.reload();        
                } else {
                    await deleteIncomeById(authToken, id);
                    alert('Despesa excluída com sucesso!');   
                    window.location.reload();
                }
            }
        } catch (err) {
            console.log('Ocorreu um erro ao excluir a despesa')
        }
    }

    return (
        <div className={Styles.Container}>
            <input type="checkbox" />
            <span>{responsible.length > 28 ? responsible.substring(0, 28) + "..." : responsible}</span>
            <span>{description.length > 28 ? description.substring(0, 28) + "..." : description}</span>
            <span>{maturity}</span>
            <span>R$ {value}</span>
            <span>{document_number}</span>
            <div>
                <Span situation={situation}>{situation}</Span>
                <div>
                    <Link href={linkTo}>
                        <Image 
                            src={pencilIcon}
                            alt="Pencil icon"
                            height={28}
                            width={30}
                            className={`${Styles.Icon} ${Styles.EditIcon}`}
                        />
                    </Link>
                    <Image
                        onClick={handleClick}
                        src={downloadIcon}
                        alt="Trash icon"
                        height={28}
                        width={30}
                        className={Styles.Icon}
                    />
                    <Image
                        onClick={handleClick}
                        src={trashIcon}
                        alt="Trash icon"
                        height={28}
                        width={30}
                        className={`${Styles.Icon} ${Styles.TrashIcon}`}
                    />
                </div>
            </div>
        </div>
    );
}