"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import MessagePopup from "../MessagePopup/MessagePopup";

export default function ExportXlsx() {
  const [file, setFile] = useState(null);
  const [importedData, setImportedData] = useState([]);
  const [status, setStatus] = useState("");
  const [inputOn, setInputOn] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [popUpData, setPopUpData] = useState({
    open: false,
    title: "",
    text: "",
  });

  useEffect(() => {
    const cookies = parseCookies();
    setAuthToken(cookies.authToken);
  }, []);

  const handleInput = () => {
    setInputOn(!inputOn);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      setStatus("Por favor, selecione um arquivo.");
      return;
    }

    setStatus("Enviando arquivo...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios
        .post(`${"https://idxfinance.com.br"}/api/import-expenses/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Token ${authToken}`,
            },
          }
        )
        .then(() => {
          setPopUpData({
            open: true,
            title: "Sucesso!",
            text: "Importação realizada com sucesso!",
          });
          setTimeout(() => window.location.reload(), 3000);
        })
        .catch((error) => {
          setPopUpData({
            open: true,
            title: "Ops, algo de errado!",
            text: "Falha ao importar planilha. Tente novamente mais tarde.",
          });
        });

      setImportedData(response.data.data);
      setStatus("Sucesso!");
    } catch (error) {
      setStatus("Erro: " + error.message);
    }
  };

  const handleExport = async () => {
    try {
      await axios
        .get(`${"https://idxfinance.com.br"}/api/export-expenses/`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
          responseType: "json",
        })
        .then(() => {
          setPopUpData({
            open: true,
            title: "Sucesso!",
            text: "Exportação realizada com sucesso! Planilha será enviado por e-mail.",
          });
        })
        .catch((error) => {
          setPopUpData({
            open: true,
            title: "Ops, algo de errado!",
            text: "Falha ao exportar planilha. Tente novamente mais tarde.",
          });
        });

      setStatus("Sucesso!");
    } catch (error) {
      console.error("Erro ao exportar:", error);
    }
  };

  return (
    <div>
      {popUpData.open && (
        <MessagePopup
          title={popUpData.title}
          text={popUpData.text}
          setPopupState={setPopUpData}
        />
      )}
      {inputOn && (
        <div className="ModalBackground">
          <div className="InputFile">
            <div>
              <Image
                src="/images/icons/close.svg"
                width={24}
                height={24}
                alt="Close icon"
                className="CloseIcon"
                onClick={handleInput}
              />
            </div>
            <Image
              src="/images/icons/receipt-minus.svg"
              width={80}
              height={80}
              alt="Receipt add"
            />
            <h2>Importe suas despesas</h2>
            <p>
              Preencha o{" "}
              <Link
                href="/spreadsheets/Planilha_Modelo_Finance.xls"
                download="Contas_a_Pagar.xls"
              >
                modelo
              </Link>{" "}
              e envie-nos o arquivo .xlsx
            </p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              required
            />
            <button className="InputFileBtn" onClick={handleImport}>
              Importar
            </button>
            {status && <p>{status}</p>}
          </div>
        </div>
      )}

      <div className="ExcelActions">
        <button className="InputFileBtn" onClick={handleInput}>
          Importar
        </button>
        <button className="InputFileBtn" onClick={handleExport}>
          Exportar
        </button>
      </div>
    </div>
  );
}
