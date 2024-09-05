import downloadIcon from "@/public/images/icons/download.svg";
import pencilIcon from "@/public/images/icons/pencil.svg";
import trashIcon from "@/public/images/icons/trash.svg";
import collectionIcon from "@/public/images/icons/collection.svg";
import Image from "next/image";
import Link from "next/link";
import { parseCookies } from "nookies";
import { deleteExpense } from "../../services/api/expenses";
import { deleteIncomeById } from "../../services/api/incomes";
import Styles from "./component.module.css";
import Span from "./Span/Span";


type AttachmentDataProps = {
  data: string;
  type: string;
}

type AccountCardProps = {
  responsible: string;
  description: string;
  maturity: string;
  value: string;
  situation: string;
  document_number: string;
  attachment_data: AttachmentDataProps | null;
  installment_number: number;
  current_installment: number;
  linkTo: string;
  id: number;
  type: "income" | "expense";
};

export default function AccountCard({
  responsible,
  description,
  maturity,
  situation,
  value,
  document_number,
  attachment_data,
  installment_number,
  current_installment,
  linkTo,
  id,
  type,
}: Readonly<AccountCardProps>) {
  const { authToken } = parseCookies();

  const handleClick = async () => {
    try {
      const validation = confirm(
        `Tem certeza que deseja excluir essa ${type === "expense" ? "despesa" : "receita"}?`
      );

      if (validation) {
        if (type === "expense") {
          await deleteExpense(authToken, id);
          alert("Despesa excluída com sucesso!");
          window.location.reload();
        } else {
          await deleteIncomeById(authToken, id);
          alert("Receita excluída com sucesso!");
          window.location.reload();
        }
      }
    } catch (err) {
      console.log(`Ocorreu um erro ao excluir a ${type === "expense" ? "despesa" : "receita"}`);
    }
  };

  const readFile = async () => {
    if (attachment_data) {
        const link = document.createElement("a");
        link.href = attachment_data.data;
        link.download = `IDXFinance-${id}-${type}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

  return (
    <div className={`${Styles.Container} ${situation === "Vencido" ? Styles.Expired : ""}`}>
      <input type="checkbox" />
      <span>
        {responsible.length > 28
          ? responsible.substring(0, 28) + "..."
          : responsible}
      </span>
      <span>
        {description.length > 28
          ? description.substring(0, 28) + "..."
          : description}
      </span>
      <div>
        <div>
          {installment_number > 1 &&
          <>
            <Image
              src={collectionIcon}
              alt="Pencil icon"
              height={28}
              width={30}
              className={`${Styles.Icon} ${Styles.EditIcon}`}
            />
            <span>{current_installment}/{installment_number}</span>
          </>
          }
        </div>
        <span>{maturity}</span>
      </div>
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
          {attachment_data && 
            <Image
              onClick={readFile}
              src={downloadIcon}
              alt="Download icon"
              height={28}
              width={30}
              className={`${Styles.Icon} ${attachment_data ? "" : Styles.Disabled}`}
            />
          }
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
