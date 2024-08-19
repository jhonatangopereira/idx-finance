"use client";

import ButtonForm from "@/app/components/AccountPopups/ButtonForm/ButtonForm";
import CreateCategoryPopup from "@/app/components/CreateCategoryPopup/CreateCategoryPopup";
import CreateCostCenterPopup from "@/app/components/CreateCostCenterPopup/CreateCostCenterPopup";
import CreateSupplierPopup from "@/app/components/CreateSupplierPopup/CreateSupplierPopup";
import StylesContainer from "@/app/page.module.css";
import { createExpense } from "../../../services/api/expenses";
import { createExpenseSchema } from "../../../utils/validations/expenses";
import Styles from "./page.module.css";
import { DataType } from "./types";

import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { parseCookies } from "nookies";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

export default function CreateAccount() {
  // Apportionments
  const [apportionments, setApportionments] = useState<any[]>([]);
  const ap = apportionments;

  // Attachment
  const [attachmentStatus, setAttachmentStatus] = useState({
    message: "Nehum anexo adicionado.",
  });

  // Mark as paid
  const [markAsPaid, setMarkAsPaid] = useState(false);
  const [dueDate, setDueDate] = useState("");

  // Mark installments
  const [hasInstallment, setHasInstallment] = useState(false);
  const [numberOfInstallments, setNumberOfInstallments] = useState(2);
  const [installmentValues, setInstallmentValues] = useState<any[]>([
    {
      due_date: "01/01/2024",
      value: "0",
    },
    {
      due_date: "01/01/2024",
      value: "0",
    },
  ]);

  // Mark bank slip
  const [hasBankSlip, setHasBankSlip] = useState(false);

  // Selects
  const [userBanks, setUserBanks] = useState([{ id: 0, bank_name: "" }]);
  const [userCategories, setUserCategories] = useState([
    { id: 0, description: "" },
  ]);
  const [userCostCenters, setUserCostCenters] = useState([
    { id: 0, description: "" },
  ]);
  const [userSuppliers, setUserSuppliers] = useState([{ id: 0, name: "" }]);

  // Popups
  const [isCreateCategoryPopupVisible, setIsCreateCategoryPopupVisible] =
    useState(false);
  const [isCostCenterPopupVisible, setIsCostCenterPopupVisible] =
    useState(false);
  const [isSupplierPopupVisible, setIsSupplierPopupVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(createExpenseSchema),
    defaultValues: {
      _value: "",
      alternative_due_date: hasInstallment ? "01/01/2024" : "",
      installment: 0,
      bank_slip: hasBankSlip,
      financial_account: 0,
      financial_category: 0,
      cost_center: 0,
      attachment: "",
      supplier: 0,
      document_number: "",
      payment: {
        value: "0",
        payment_method: "",
        due_date: hasInstallment ? "" : "01/01/2024",
        payment_date: "",
        status: false,
      },
      observations: "",
      apportionment: [
        {
          reference_code: "Código de referência",
          financial_category: 0,
          value: "0",
          percentage: "0",
          cost_center: 0,
        },
      ],
    },
  });
  // console.log(errors);

  const attachment = watch("attachment");
  const paymentStatus = watch("payment.status");
  const _value = watch("_value");

  const getData = async (fields: any) => {
    const cookies = parseCookies();

    const data: DataType = {
      supplier: fields.supplier,
      competence: format(
        new Date(fields.competence + "T00:00:00"),
        "dd/MM/yyyy"
      ),
      description: fields.description,
      value: Number(
        parseFloat(fields._value.replace(/\./g, "").replace(",", "."))
          .toFixed(2)
          .toString()
      ),
      code: "code",
      observations: fields.observations,
      status: fields.payment.status === false ? "" : "Pago",
      nsu: "nsu",
      financial_category: fields.financial_category,
      category: fields.financial_category,
      cost_center: Number(fields.cost_center),
      document_number: fields.document_number,
      financial_account: paymentStatus ? fields.financial_account : null,
      interval_between_installments: 0,
      bank_slip: fields.bank_slip,
      payment: {
        payment_method: paymentStatus ? fields.payment.payment_method : null,
        payment_date: paymentStatus
          ? format(
              new Date(fields.payment.payment_date + "T00:00:00"),
              "dd/MM/yyyy"
            )
          : null,
        status: fields.payment.status === false ? "" : "Pago",
        installment_values: hasInstallment
          ? installmentValues.map((installment: any) => {
              return {
                value: Number(
                  parseFloat(
                    installment.value.replace(/\./g, "").replace(",", ".")
                  )
                    .toFixed(2)
                    .toString()
                ),
                due_date: format(
                  new Date(installment.due_date + "T00:00:00"),
                  "dd/MM/yyyy"
                ),
              };
            })
          : [
              {
                value: Number(
                  parseFloat(fields._value.replace(/\./g, "").replace(",", "."))
                    .toFixed(2)
                    .toString()
                ),
                due_date: format(
                  new Date(fields.alternative_due_date + "T00:00:00"),
                  "dd/MM/yyyy"
                ),
              },
            ],
      },
      apportionment:
        apportionments.length > 0
          ? apportionments.map((a) => {
              return {
                financial_category: a.financial_category,
                cost_center: Number(a.cost_center),
                percentage: Number(
                  parseFloat(a.percentage.replace(/\./g, "").replace(",", "."))
                    .toFixed(2)
                    .toString()
                ),
                value: Number(
                  parseFloat(a.value.replace(/\./g, "").replace(",", "."))
                    .toFixed(2)
                    .toString()
                ),
                reference_code: "-",
              };
            })
          : [],
      attachment: "",
    };

    if (fields.attachment.length > 0) {
      const file = fields.attachment[0];
      if (file instanceof File || file instanceof Blob) {
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
        data.attachment = attachmentDataURL as string;
      }

      try {
        await createExpense(data, cookies.authToken);
        alert("Nova despesa criada com sucesso!");
      } catch (err) {
        alert("Falha ao criar a nova despesa.");
      }
    }
  };

  const fetchBanks = async () => {
    const cookies = parseCookies();

    try {
      await fetch(`${"https://idxfinance.com.br"}/api/release-options/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${cookies.authToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserBanks(data.financial_accounts);
          setUserCategories(data.financial_categories);
          setUserCostCenters(data.cost_centers);
          setUserSuppliers(data.suppliers);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, [isCreateCategoryPopupVisible, isCostCenterPopupVisible]);

  useEffect(() => {
    let value = Number(stringToCurrency(_value!))
      .toFixed(2)
      .toString()
      .replace(".", ",");
    const formattedValue = parseFloat(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setValue("payment.value", formattedValue);
  }, [_value, setValue]);

  useEffect(() => {
    if (hasInstallment) {
      setValue("payment.due_date", "");
      // setValue("alternative_due_date", "01/01/2024");
    } else {
      setValue("payment.due_date", "01/01/2024");
      // setValue("alternative_due_date", "");
    }

    if (markAsPaid) {
      setValue("payment.payment_date", "");
      // setValue("alternative_due_date", "01/01/2024");
    } else {
      setValue("payment.payment_date", "01/01/2024");
      // setValue("alternative_due_date", "");
    }
  }, [hasInstallment, markAsPaid]);

  useEffect(() => {
    if (attachment !== null && attachment.length > 0) {
      setAttachmentStatus({
        message: `Anexo adicionado: ${attachment[0].name}`,
      });
    } else {
      setValue("attachment", "");
      setAttachmentStatus({ message: `Nenhum anexo adicionado.` });
    }

    setValue("competence", new Date().toISOString().split("T")[0]);
  }, [attachment, setValue]);

  const addNewApportionment = () => {
    setApportionments((previousValue) => [
      ...previousValue,
      {
        value: "",
        cost_center: "",
        percentage: "",
        financial_category: 0,
        reference_code: "código de referência",
      },
    ]);
  };

  const removeApportionment = (id: number) => {
    let filteredApportionments = apportionments.filter((item, i) => {
      return i !== id;
    });
    setApportionments(filteredApportionments);
  };

  const handle_ValueInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const inputValue = event.target.value.replace(/\D/g, "");
    const formattedValue = formatCurrency(inputValue);
    setValue("_value", formattedValue);
  };

  const handle_PercentageInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    id: number
  ): void => {
    const inputValue = event.target.value.replace(/\D/g, "");
    const formattedValue = formatCurrency(inputValue);
    setValue(`apportionment.${id}.percentage`, formattedValue);
  };

  const formatCurrency = (inputValue: string): string => {
    const numberValue = (parseInt(inputValue, 10) || 0) / 100;
    return numberValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const stringToCurrency = (value: string) => {
    const numberValue = parseFloat(value.replace(/\./g, "").replace(",", "."));
    return numberValue;
  };

  const transformStringToNumber = (str: string) => {
    return parseFloat(str.replace(/\./g, "").replace(",", "."));
  };

  const handleRemoveProof = () => {
    setValue("attachment", null);
  };

  const addInstallment = () => {
    if (numberOfInstallments < 12) {
      setNumberOfInstallments((previousValue) => previousValue + 1);
      setInstallmentValues((previousValues) => [
        ...previousValues,
        { value: "", due_date: "" },
      ]);
    }
  };

  const removeInstallment = () => {
    if (numberOfInstallments > 2) {
      setNumberOfInstallments((previousValue) => previousValue - 1);
      setInstallmentValues((previousValues) => previousValues.slice(0, -1));
    }
  };

  const installmentArray = Array.from(
    { length: numberOfInstallments },
    (_, i) => {
      return i + 1;
    }
  );

  useEffect(() => {
    setValue("number_of_installments", `${numberOfInstallments}x`);
  }, [numberOfInstallments]);

  return (
    <>
      {isCreateCategoryPopupVisible && (
        <div className="ModalBackground">
          <CreateCategoryPopup
            closeFunction={setIsCreateCategoryPopupVisible}
          />
        </div>
      )}
      {isCostCenterPopupVisible && (
        <div className="ModalBackground">
          <CreateCostCenterPopup closeFunction={setIsCostCenterPopupVisible} />
        </div>
      )}
      {isSupplierPopupVisible && (
        <div className="ModalBackground">
          <CreateSupplierPopup closeFunction={setIsSupplierPopupVisible} />
        </div>
      )}
      <form onSubmit={handleSubmit(getData)}>
        <main>
          <div className={StylesContainer.Container}>
            <div className={StylesContainer.BreadCrumb}>
              <h2 className={Styles.Title}>Detalhes da despesa</h2>

              <main className={Styles.Main}>
                <section className={Styles.LaunchInformation}>
                  <h2>Informações de lançamento</h2>
                  <div className={Styles.LabelInputContainer}>
                    <label className={Styles.Label}>
                      Fornecedor <span className={Styles.AsterisckSpan}>*</span>
                    </label>
                    <select className={Styles.Input} {...register("supplier")}>
                      <option value={0}>Selecione o fornecedor</option>
                      {userSuppliers !== undefined &&
                        userSuppliers.length >= 1 &&
                        userSuppliers.map((supplier, index) => (
                          <option value={supplier.id} key={index}>
                            {supplier.name}
                          </option>
                        ))}
                    </select>
                    <a
                      onClick={() =>
                        setIsSupplierPopupVisible(
                          (previousValue) => !previousValue
                        )
                      }
                    >
                      + Criar novo fornecedor
                    </a>
                    {errors.supplier && (
                      <p className={Styles.Error}>{errors.supplier?.message}</p>
                    )}
                  </div>
                  <div className={Styles.LabelInputContainer}>
                    <label className={Styles.Label}>
                      Data de competência{" "}
                      <span className={Styles.AsterisckSpan}>*</span>
                    </label>
                    <input
                      className={Styles.Input}
                      placeholder="Data de competência"
                      type="date"
                      {...register("competence")}
                    />
                    {errors.competence && (
                      <p className={Styles.Error}>
                        {errors.competence.message}
                      </p>
                    )}
                  </div>
                  <div className={Styles.LabelInputContainer}>
                    <label className={Styles.Label}>
                      Descrição <span className={Styles.AsterisckSpan}>*</span>
                    </label>
                    <input
                      className={Styles.Input}
                      placeholder="Descrição"
                      type="text"
                      {...register("description")}
                      maxLength={200}
                    />
                    {errors.description && (
                      <p className={Styles.Error}>
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className={Styles.LabelInputContainer}>
                    <label className={Styles.Label}>
                      Valor <span className={Styles.AsterisckSpan}>*</span>
                    </label>
                    <div className={Styles.ValueInput}>
                      <span>R$</span>
                      <input
                        className={Styles.Input}
                        placeholder="Ex.: 120,50"
                        type="text"
                        name="_value"
                        onChange={handle_ValueInputChange}
                        value={_value}
                        min={0}
                      />
                    </div>
                    {errors._value && (
                      <p className={Styles.Error}>{errors._value.message}</p>
                    )}
                  </div>
                  {paymentStatus && (
                    <>
                      <div className={Styles.LabelInputContainer}>
                        <label className={Styles.Label}>
                          Conta de pagamento{" "}
                          <span className={Styles.AsterisckSpan}>*</span>
                        </label>
                        <select
                          className={Styles.Input}
                          {...register("financial_account")}
                        >
                          <option value={0} selected>
                            Selecione o banco
                          </option>
                          {userBanks.length > 0 &&
                            userBanks.map((bank, index) => (
                              <option value={bank.id} key={index}>
                                {bank.bank_name}
                              </option>
                            ))}
                        </select>
                        {errors.financial_account && (
                          <p className={Styles.Error}>
                            {errors.financial_account.message}
                          </p>
                        )}
                      </div>
                      <div className={Styles.LabelInputContainer}>
                        <label className={Styles.Label}>
                          Forma de pagamento{" "}
                          <span className={Styles.AsterisckSpan}>*</span>
                        </label>
                        <select
                          className={Styles.Input}
                          {...register("payment.payment_method")}
                        >
                          <option value="">
                            Selecione a forma de pagameto
                          </option>
                          <option value="Boleto Bancário">
                            Boleto Bancário
                          </option>
                          <option value="Cashback">Cashback</option>
                          <option value="Cheque">Cheque</option>
                          <option value="Cartão de Crédito">
                            Cartão de Crédito
                          </option>
                          <option value="Cartão de Crédito via Link">
                            Cartão de Crédito via Link
                          </option>
                          <option value="Cartão de Débito">
                            Cartão de Débito
                          </option>
                          <option value="Carteira Digital">
                            Carteira Digital
                          </option>
                          <option value="Pix">Pix</option>
                          <option value="Outro">Outro</option>
                        </select>
                        {errors.payment?.payment_method && (
                          <p className={Styles.Error}>
                            {errors.payment.payment_method.message}
                          </p>
                        )}
                      </div>
                      <div className={Styles.LabelInputContainer}>
                        <label className={Styles.Label}>
                          Data de pagamento{" "}
                          <span className={Styles.AsterisckSpan}>*</span>
                        </label>
                        <input
                          className={Styles.Input}
                          placeholder="Data de pagamento"
                          type="date"
                          {...register("payment.payment_date")}
                        />
                        {errors.payment?.payment_date && (
                          <p className={Styles.Error}>
                            {errors.payment.payment_date.message}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                  {!hasInstallment && (
                    <div className={Styles.LabelInputContainer}>
                      <label className={Styles.Label}>
                        Vencimento{" "}
                        <span className={Styles.AsterisckSpan}>*</span>
                      </label>
                      <input
                        className={Styles.Input}
                        placeholder="Vencimento"
                        type="date"
                        {...register("alternative_due_date")}
                        onChange={(e) => {
                          console.log("DUE DATE ALTERADO: ", e.target.value);
                          // setDueDate(e.target.value);
                        }}
                      />
                      {errors.alternative_due_date && (
                        <p className={Styles.Error}>
                          {errors.alternative_due_date.message}
                        </p>
                      )}
                    </div>
                  )}
                  <div className={Styles.LabelInputContainer}>
                    <label className={Styles.Label}>
                      Categoria <span className={Styles.AsterisckSpan}>*</span>
                    </label>
                    <select
                      className={Styles.Input}
                      {...register("financial_category")}
                    >
                      <option value={0}>Selecione a categoria</option>
                      {userCategories !== undefined &&
                        userCategories.length >= 1 &&
                        userCategories.map((category, index) => (
                          <option value={category.id} key={index}>
                            {category.description}
                          </option>
                        ))}
                    </select>
                    <a
                      onClick={() =>
                        setIsCreateCategoryPopupVisible(
                          (previousValue) => !previousValue
                        )
                      }
                    >
                      + Criar nova categoria
                    </a>
                    {errors.financial_category && (
                      <p className={Styles.Error}>
                        {errors.financial_category?.message}
                      </p>
                    )}
                  </div>
                  <div className={Styles.LabelInputContainer}>
                    <label className={Styles.Label}>
                      Centro de custo{" "}
                      <span className={Styles.AsterisckSpan}>*</span>
                    </label>
                    <select
                      className={Styles.Input}
                      {...register("cost_center")}
                    >
                      <option value={0} selected>
                        Selecione o centro de custo
                      </option>
                      {userCostCenters !== undefined &&
                        userCostCenters.length >= 1 &&
                        userCostCenters.map((category, index) => (
                          <option value={category.id} key={index}>
                            {category.description}
                          </option>
                        ))}
                    </select>
                    <a
                      onClick={() =>
                        setIsCostCenterPopupVisible(
                          (previousValue) => !previousValue
                        )
                      }
                    >
                      + Criar novo centro de custo
                    </a>
                    {errors.cost_center && (
                      <p className={Styles.Error}>
                        {errors.cost_center.message}
                      </p>
                    )}
                  </div>
                  <div className={Styles.LabelInputContainer}>
                    <label className={Styles.Label}>
                      Número do documento{" "}
                      <span className={Styles.AsterisckSpan}>*</span>
                    </label>
                    <input
                      className={Styles.Input}
                      placeholder="Número do documento"
                      type="text"
                      {...register("document_number")}
                      maxLength={200}
                    />
                    {errors.document_number && (
                      <p className={Styles.Error}>
                        {errors.document_number.message}
                      </p>
                    )}
                  </div>
                </section>
                {hasInstallment && (
                  <section className={Styles.PaymentTerms}>
                    <h2>Condições de pagamento</h2>
                    <div className={Styles.LabelInputContainer}>
                      <label className={Styles.Label}>
                        Parcelamento{" "}
                        <span className={Styles.AsterisckSpan}>*</span>
                      </label>
                      <div className={Styles.InstallmentInput}>
                        <input
                          className={Styles.Input}
                          placeholder="Ex.: 3x"
                          type="text"
                          id="installmentsIntervalInput"
                          {...register("number_of_installments")}
                        />
                        <div className={Styles.Icons}>
                          <button type="button" onClick={addInstallment}>
                            <IoMdArrowDropup />
                          </button>
                          <button type="button" onClick={removeInstallment}>
                            <IoMdArrowDropdown />
                          </button>
                        </div>
                      </div>
                      {errors.number_of_installments && (
                        <p className={Styles.Error}>
                          {errors.number_of_installments.message}
                        </p>
                      )}
                    </div>
                    {Array.from(installmentArray, (_, index) => (
                      <div
                        key={index}
                        className={`${Styles.LabelInputContainer} ${Styles.InstallmentContainer}`}
                      >
                        <div className={Styles.ValueInputInstallment}>
                          <label className={Styles.Label}>
                            Valor da parcela {index + 1}{" "}
                            <span className={Styles.AsterisckSpan}>*</span>
                          </label>
                          <div className={Styles.ValueInput}>
                            <span>R$</span>
                            <input
                              className={Styles.Input}
                              placeholder="Ex.: 50,00"
                              type="text"
                              {...register(
                                `payment.installment_values.${index}.value`
                              )}
                              min={0}
                              defaultValue={"0,00"}
                              onChange={(e) => {
                                setValue(
                                  `payment.installment_values.${index}.value`,
                                  formatCurrency(
                                    e.target.value.replace(/\D/g, "")
                                  ).toString()
                                );
                                setInstallmentValues((previousValues) =>
                                  previousValues.map((installment, i) =>
                                    i === index
                                      ? {
                                          ...installment,
                                          value: e.target.value,
                                        }
                                      : installment
                                  )
                                );
                              }}
                            />
                          </div>
                        </div>
                        {errors.payment?.installment_values?.[index]?.value && (
                          <p className={Styles.Error}>
                            {
                              errors.payment?.installment_values[index]?.value
                                ?.message
                            }
                          </p>
                        )}
                        <div className={Styles.DueDateInput}>
                          <label className={Styles.Label}>
                            Data de vencimento da parcela {index + 1}{" "}
                            <span className={Styles.AsterisckSpan}>*</span>
                          </label>
                          <input
                            className={Styles.Input}
                            placeholder="Data de vencimento"
                            type="date"
                            {...register(
                              `payment.installment_values.${index}.due_date`
                            )}
                            onChange={(e) =>
                              setInstallmentValues((previousValues) =>
                                previousValues.map((installment, i) =>
                                  i === index
                                    ? {
                                        ...installment,
                                        due_date: e.target.value,
                                      }
                                    : installment
                                )
                              )
                            }
                          />
                          {errors.payment?.installment_values?.[index]
                            ?.due_date && (
                            <p className={Styles.Error}>
                              {
                                errors.payment?.installment_values[index]
                                  ?.due_date?.message
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </section>
                )}
                <section>
                  <button
                    className={Styles.AddApportionmentButton}
                    type="button"
                    onClick={addNewApportionment}
                  >
                    {ap.length > 0
                      ? "Adicionar novo rateio"
                      : "Adicionar Rateio"}
                  </button>
                </section>
                <section className={Styles.Apportionment}>
                  {ap.length > 0 && <h3>Informe os dados do rateio</h3>}
                  <div id="container">
                    {ap.length > 0 &&
                      ap.map((apportionment, index) => (
                        <div
                          className="ApportionmentsContainer"
                          key={index}
                          id={`apportionment-${index}`}
                        >
                          <div className={Styles.ApportionmentInputs}>
                            <div className={Styles.LabelInputContainer}>
                              <label className={Styles.Label}>
                                Categoria{" "}
                                <span className={Styles.AsterisckSpan}>*</span>
                              </label>
                              <select
                                className={Styles.Input}
                                {...register(
                                  `apportionment.${index}.financial_category`
                                )}
                                defaultValue={0}
                                onChange={(e) =>
                                  setApportionments((prevApportionments) =>
                                    prevApportionments.map(
                                      (apportionment, i) => {
                                        return i === index
                                          ? {
                                              ...apportionment,
                                              financial_category:
                                                e.target.value,
                                            }
                                          : apportionment;
                                      }
                                    )
                                  )
                                }
                              >
                                <option value={0}>Selecione a categoria</option>
                                {userCategories.length >= 1 &&
                                  userCategories.map((category, index) => (
                                    <option value={category.id} key={index}>
                                      {category.description}
                                    </option>
                                  ))}
                              </select>
                              {errors.apportionment?.[index]
                                ?.financial_category && (
                                <p className={Styles.Error}>
                                  {
                                    errors.apportionment[index]
                                      ?.financial_category?.message
                                  }
                                </p>
                              )}
                            </div>

                            <div className={Styles.LabelInputContainer}>
                              <label className={Styles.Label}>
                                Valor total
                                <span className={Styles.AsterisckSpan}>*</span>
                              </label>
                              <div className={Styles.ValueInput}>
                                <div>
                                  <span>R$</span>
                                  <input
                                    className={Styles.Input}
                                    placeholder="Ex.: 100,00"
                                    type="text"
                                    value={apportionment.value}
                                    {...register(
                                      `apportionment.${index}.value`
                                    )}
                                    onChange={(e) =>
                                      setApportionments((prevApportionments) =>
                                        prevApportionments.map(
                                          (apportionment, i) => {
                                            return i === index
                                              ? {
                                                  ...apportionment,
                                                  value: formatCurrency(
                                                    e.target.value.replace(
                                                      /\D/g,
                                                      ""
                                                    )
                                                  ).toString(),
                                                  percentage: (
                                                    (transformStringToNumber(
                                                      formatCurrency(
                                                        e.target.value.replace(
                                                          /\D/g,
                                                          ""
                                                        )
                                                      ).toString()
                                                    ) /
                                                      transformStringToNumber(
                                                        _value!
                                                      )) *
                                                      100 || 0
                                                  ).toLocaleString("pt-BR", {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                  }),
                                                }
                                              : apportionment;
                                          }
                                        )
                                      )
                                    }
                                  />
                                </div>
                                {errors.apportionment?.[index]?.value && (
                                  <p className={Styles.Error}>
                                    {
                                      errors.apportionment[index]?.value
                                        ?.message
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className={Styles.LabelInputContainer}>
                              <label className={Styles.Label}>
                                Porcentagem{" "}
                                <span className={Styles.AsterisckSpan}>*</span>
                              </label>
                              <div className={Styles.ValueInput}>
                                <span>%</span>
                                <input
                                  className={Styles.Input}
                                  placeholder="Ex.: 10"
                                  type="text"
                                  {...register(
                                    `apportionment.${index}.percentage`
                                  )}
                                  value={apportionment.percentage}
                                  onChange={(e) =>
                                    setApportionments((prevApportionments) =>
                                      prevApportionments.map(
                                        (apportionment, i) => {
                                          handle_PercentageInputChange(
                                            e,
                                            index
                                          );
                                          return i === index
                                            ? {
                                                ...apportionment,
                                                percentage: e.target.value,
                                                value: (
                                                  (transformStringToNumber(
                                                    formatCurrency(
                                                      e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                      )
                                                    ).toString()
                                                  ) /
                                                    100) *
                                                  transformStringToNumber(
                                                    formatCurrency(
                                                      _value!.replace(/\D/g, "")
                                                    ).toString()
                                                  )
                                                ).toLocaleString("pt-BR", {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                                }),
                                              }
                                            : apportionment;
                                        }
                                      )
                                    )
                                  }
                                />
                                {errors.apportionment?.[index]?.percentage && (
                                  <p className={Styles.Error}>
                                    {
                                      errors.apportionment[index]?.percentage
                                        ?.message
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className={Styles.LabelInputContainer}>
                              <label className={Styles.Label}>
                                Centro de custo{" "}
                                <span className={Styles.AsterisckSpan}>*</span>
                              </label>
                              <select
                                className={Styles.Input}
                                {...register(
                                  `apportionment.${index}.cost_center`
                                )}
                                onChange={(e) =>
                                  setApportionments((prevApportionments) =>
                                    prevApportionments.map((apportionment, i) =>
                                      i === index
                                        ? {
                                            ...apportionment,
                                            cost_center: e.target.value,
                                          }
                                        : apportionment
                                    )
                                  )
                                }
                              >
                                <option value={0} selected>
                                  Selecione o centro de custo
                                </option>
                                {userCostCenters.length >= 1 &&
                                  userCostCenters.map((category, index) => (
                                    <option value={category.id} key={index}>
                                      {category.description}
                                    </option>
                                  ))}
                              </select>
                              {errors.apportionment?.[index]?.cost_center && (
                                <p className={Styles.Error}>
                                  {
                                    errors.apportionment[index]?.cost_center
                                      ?.message
                                  }
                                </p>
                              )}
                            </div>
                            <button
                              className={Styles.AddApportionmentButton}
                              type="button"
                              onClick={() => removeApportionment(index)}
                            >
                              Remover rateio
                            </button>
                          </div>
                          <div className={Styles.ApportionmentDetails}>
                            <span>
                              Valor rateado:{" "}
                              <b>
                                {apportionments[index].value
                                  ? transformStringToNumber(
                                      apportionments[index].value
                                    ).toLocaleString("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    })
                                  : "0,00"}
                              </b>
                            </span>
                            <span>
                              A ratear:{" "}
                              <b>
                                {apportionments[index].value
                                  ? (
                                      transformStringToNumber(_value || "") -
                                      transformStringToNumber(
                                        apportionments[index].value
                                      )
                                    ).toLocaleString("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    })
                                  : "0,00"}{" "}
                                (
                                {apportionments[index].value
                                  ? (
                                      100 -
                                      transformStringToNumber(
                                        apportionments[index].percentage
                                      )
                                    ).toFixed(2)
                                  : 0}
                                %){" "}
                              </b>
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
                <section className={Styles.AddProff}>
                  <button className={Styles.AddApportionmentButton}>
                    Adicionar anexo
                  </button>
                  <input type="file" id="file" {...register("attachment")} />
                  <p>{attachmentStatus.message}</p>
                  {attachment !== "" && (
                    <a onClick={handleRemoveProof}>- Remover anexo</a>
                  )}
                </section>
                <section>
                  <div className={Styles.MarkAs}>
                    <span>Marcar como</span>
                    <div>
                      <input
                        type="checkbox"
                        onInput={() => {
                          console.log("MARCADO COMO PAGO: ", dueDate);
                          setMarkAsPaid((previousValue) => !previousValue);
                          // setValue("alternative_due_date", dueDate);
                        }}
                        id="receveid"
                        {...register("payment.status")}
                      />
                      <label htmlFor="receveid">Pago</label>
                      <input
                        type="checkbox"
                        id="hasInstallment"
                        onInput={() => {
                          setHasInstallment((previousValue) => !previousValue);
                        }}
                      />
                      <label htmlFor="hasInstallment">Parcelado</label>
                      <input
                        type="checkbox"
                        id="hasBankSlip"
                        onInput={() =>
                          setHasBankSlip((previousValue) => !previousValue)
                        }
                        {...register("bank_slip")}
                      />
                      <label htmlFor="hasBankSlip">Boleto em mãos</label>
                    </div>
                  </div>
                </section>
                <section className={Styles.GeneralComments}>
                  <h2>Observações gerais</h2>
                  <label>Observações</label>
                  <textarea
                    {...register("observations")}
                    maxLength={1500}
                  ></textarea>
                </section>
              </main>
              <footer className={Styles.Footer}>
                <ButtonForm text="Salvar" primary type="submit" />
              </footer>
            </div>
          </div>
        </main>
      </form>
    </>
  );
}
