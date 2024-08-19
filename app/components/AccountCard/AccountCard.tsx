import downloadIcon from "@/public/images/icons/download.svg";
import pencilIcon from "@/public/images/icons/pencil.svg";
import trashIcon from "@/public/images/icons/trash.svg";
import Image from "next/image";
import Link from "next/link";
import { parseCookies } from "nookies";
import { deleteExpense } from "../../services/api/expenses";
import { deleteIncomeById } from "../../services/api/incomes";
import Styles from "./component.module.css";
import Span from "./Span/Span";

type AccountCardProps = {
  responsible: string;
  description: string;
  maturity: string;
  value: string;
  situation: string;
  document_number: string;
  attachment_data: File | Blob | string | null;
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
  linkTo,
  id,
  type,
}: Readonly<AccountCardProps>) {
  const { authToken } = parseCookies();

  const handleClick = async () => {
    try {
      const validation = confirm(
        "Tem certeza que deseja excluir essa despesa?"
      );

      if (validation) {
        if (type === "expense") {
          await deleteExpense(authToken, id);
          alert("Despesa excluída com sucesso!");
          window.location.reload();
        } else {
          await deleteIncomeById(authToken, id);
          alert("Despesa excluída com sucesso!");
          window.location.reload();
        }
      }
    } catch (err) {
      console.log("Ocorreu um erro ao excluir a despesa");
    }
  };

  const readFile = async () => {
    console.log("readFile")
    if (attachment_data) {
      const file = new Blob([attachment_data]);
      console.log(file);
      if (file instanceof File || file instanceof Blob) {
        console.log("readFile")
        const attachmentDataURL = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target) {
              resolve(event.target.result);
            } else {
              reject(new Error("Failed to load file"));
            }
          };
          reader.readAsDataURL(file);
        });
        const attachment_file = attachmentDataURL as string;
        console.log(attachment_file);
        const link = document.createElement("a");
        link.href = attachment_file;
        link.download = "Anexo";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log("readFile")
      }
    }
  };

  return (
    <div className={Styles.Container}>
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
            onClick={readFile}
            src={downloadIcon}
            alt="Download icon"
            height={28}
            width={30}
            className={`${Styles.Icon} ${attachment_data ? "" : Styles.Disabled}`}
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
