import Styles from "@/app/page.module.css"
import Links from '@/app/components/Navigation/Links/Links'

export default function Sidebar(){
    return(
        <div className={Styles.Sidebar}>
            <Links />
        </div>
    );
}