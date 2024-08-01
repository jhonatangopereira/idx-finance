import Styles from './component.module.css';
import Image from 'next/image';
import pencilIcon from '@/public/images/icons/pencil.svg';
import trashIcon from '@/public/images/icons/trash.svg';
import Span from './Span/Span';
import { AccountCardProps } from './types';
import Link from 'next/link';
import { parseCookies } from 'nookies';
import { revalidatePath } from 'next/cache';
import { deleteExpense } from '../../services/api/expenses';
import { deleteIncomeById } from '../../services/api/incomes';

export default function AccountCard ({ description, maturity, situation, value, linkTo, id, type }: AccountCardProps) {

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
            <span>{description.length > 28 ? description.substring(0, 28) + "..." : description}</span>
            <span>{maturity}</span>
            <span>R$ {value}</span>
            <div>
                <Span situation={situation}>{situation}</Span>
                <Link href={linkTo}>
                    <Image 
                        src={pencilIcon}
                        alt="Pencil icon"
                        height={28}
                        width={30}
                        className={Styles.PencilIcon}
                    />
                </Link>
                <Image
                    onClick={handleClick}
                    src={trashIcon}
                    alt="Trash icon"
                    height={28}
                    width={30}
                    className={Styles.TrashIcon}
                />
            </div>
        </div>
    );
}