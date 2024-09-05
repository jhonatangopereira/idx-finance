import Links from "@/app/components/Navigation/Links/Links";
import Styles from "@/app/page.module.css";

export default function Sidebar() {
  return (
    <div className={Styles.Sidebar}>
      <Links />
    </div>
  );
}
