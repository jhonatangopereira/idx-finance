"use client";

import ButtonForm from "@/app/components/AccountPopups/ButtonForm/ButtonForm";
import CreateCategoryPopup from "@/app/components/CreateCategoryPopup/CreateCategoryPopup";
import CreateCostCenterPopup from "@/app/components/CreateCostCenterPopup/CreateCostCenterPopup";
import CreateSupplierPopup from "@/app/components/CreateSupplierPopup/CreateSupplierPopup";
import StylesContainer from "@/app/page.module.css";
import { createExpenseSchema } from "../../../../utils/validations/expenses";
import Styles from "./page.module.css";

import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { parseCookies } from "nookies";
import {
  ChangeEvent,
  useEffect,
  useState
} from "react";
import { useForm } from "react-hook-form";

export default function Pagar() {
  type ApportionmentType = {
    reference_code: string;
    financial_category: number;
    value: string;
    percentage: string;
    cost_center: number;
  };
  const [apportionments, setApportionments] = useState<ApportionmentType[]>([
    {
      reference_code: "",
      financial_category: 0,
      value: "",
      percentage: "",
      cost_center: 0,
    },
  ]);
  const ap = apportionments;
  const { id } = useParams();
  const [markAs, setMarkAs] = useState(false);
  const [isApportionmentInputChecked, setIsApportionmentInputChecked] =
    useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [hasInstallment, setHasInstallment] = useState(false);
  const [userBanks, setUserBanks] = useState([{ id: 0, bank_name: "" }]);
  const [hasBankSlip, setHasBankSlip] = useState(false);
  const [useCategories, setUserCategories] = useState([
    { id: 0, description: "" },
  ]);
  const [userCostCenters, setUserCostCenters] = useState([
    { id: 0, description: "" },
  ]);
  const [userSuppliers, setUserSuppliers] = useState([{ id: 0, name: "" }]);
  const [isCreateCategoryPopupVisible, setIsCreateCategoryPopupVisible] =
    useState(false);
  const [isCostCenterPopupVisibe, setIsCostCenterPopupVisible] =
    useState(false);
  const [isSupplierPopupVisible, setIsSupplierPopupVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(createExpenseSchema),
    defaultValues: {
      _value: "0",
      alternative_due_date: hasInstallment ? "01/01/2024" : "",
      installment: 0,
      financial_account: 0,
      number_of_installments: "2x",
      supplier: 0,
      document_number: "",
      bank_slip: false,
      payment: {
        value: "0",
        payment_method: "",
        due_date: hasInstallment ? "" : "01/01/2024",
        payment_date: hasInstallment ? "" : "01/01/2024",
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

  const getData = async (fields: any) => {
    console.log(fields.bank_slip);
    const data = {
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
      document_number: fields.document_number,
      nsu: "nsu",
      financial_category: fields.financial_category,
      category: fields.financial_category,
      cost_center: Number(fields.cost_center),
      financial_account: fields.financial_account ?? 0,
      interval_between_installments: hasInstallment
        ? Number(fields.interval_between_installments)
        : 0,
      bank_slip: fields.bank_slip,
      payment: {
        number_of_installments: hasInstallment
          ? Number(fields.number_of_installments.split("x")[0])
          : 1,
        value: Number(
          parseFloat(fields.payment.value.replace(/\./g, "").replace(",", "."))
            .toFixed(2)
            .toString()
        ),
        payment_method: fields.payment.payment_method,
        due_date: hasInstallment
          ? format(
              new Date(fields.payment.due_date + "T00:00:00"),
              "dd/MM/yyyy"
            )
          : format(
              new Date(fields.alternative_due_date + "T00:00:00"),
              "dd/MM/yyyy"
            ),
        payment_date: hasInstallment
          ? format(
              new Date(fields.payment.payment_date + "T00:00:00"),
              "dd/MM/yyyy"
            )
          : format(
              new Date(fields.alternative_due_date + "T00:00:00"),
              "dd/MM/yyyy"
            ),
        status: fields.payment.status === false ? "" : "Pago",
        installment_values: hasInstallment
          ? fields.installment_values.map((installment: any) => {
              return {
                value: Number(
                  parseFloat(
                    installment.value.replace(/\./g, "").replace(",", ".")
                  )
                    .toFixed(2)
                    .toString()
                ),
                due_date: format(
                  new Date(installment.payment + "T00:00:00"),
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
      apportionment: isApportionmentInputChecked
        ? apportionments.map((a) => {
            return {
              financial_category: a.financial_category,
              cost_center: Number(a.cost_center),
              percentage: parseFloat(a.percentage.replace(",", ".")),
              value: Number(
                parseFloat(a.value.replace(/\./g, "").replace(",", "."))
                  .toFixed(2)
                  .toString()
              ),
              reference_code: "-",
            };
          })
        : [],
    };

    try {
      await updateExpense(data);
      alert("Despesa editada com sucesso!");
    } catch (err) {
      alert("Falha ao editar a desesa.");
    }
  };

  const updateExpense = async (values: any) => {
    const cookies = parseCookies();
    await fetch(`${"https://idxfinance.com.br"}/api/expenses/update/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${cookies.authToken}`,
      },
      body: JSON.stringify(values),
    });
  };

  const fetchAccountData = async () => {
    const cookies = parseCookies();

    try {
      await fetch(`${"https://idxfinance.com.br"}/api/expenses/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${cookies.authToken}`,
        },
      })
        .then((repsonse) => repsonse.json())
        .then((data) => {
          setValue("supplier", data.supplier);
          setValue("competence", data.competence);
          setValue("description", data.description);
          setValue(
            "_value",
            parseFloat(data.value).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          );
          setValue(
            "payment.value",
            parseFloat(data.payment[0].value).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          );
          setValue("payment.due_date", data.payment[0].due_date);
          setValue("alternative_due_date", data.payment[0].due_date);
          setValue("payment.payment_method", data.payment[0].payment_method);
          setValue("financial_account", data.payment[0].payment_account ?? 0);
          setValue("observations", data.observations);
          setValue("cost_center", Number(data.cost_center));
          setValue("financial_category", data.financial_category);
          setValue("document_number", data.document_number);

          if (data.apportionment.length > 0) {
            setApportionments((previousValue) =>
              data.apportionment.map((a: ApportionmentType, index: number) => {
                setValue(
                  `apportionment.${index}.financial_category`,
                  a.financial_category
                );
                setValue(
                  `apportionment.${index}.percentage`,
                  parseFloat(a.percentage).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                );
                setValue(`apportionment.${index}.cost_center`, a.cost_center),
                  setValue(
                    `apportionment.${index}.value`,
                    parseFloat(a.value).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  );
                return a;
              })
            );
            setIsApportionmentInputChecked(true);
          } else {
            setIsApportionmentInputChecked(false);
          }

          if (data.interval_between_installments !== 0) {
            setHasInstallment(true);
          }

          if (data.status !== "Pago") {
            setMarkAs(false);
          } else if (data.status === "Pago") {
            setMarkAs(true);
          }
          setValue("payment.payment_date", data.payment[0].payment_date);
          const bankSlipInput = document.getElementById("hasBankSlip") as HTMLInputElement;
          if (bankSlipInput !== null || bankSlipInput !== undefined) {
            setHasBankSlip(data.bank_slip);
            bankSlipInput.checked = data.bank_slip;
            // bankSlipInput.checked = ;
            console.log(hasBankSlip);
            console.log("AAAAAAAAAAAAAAAA");
          }

          if (
            data.value !== data.payment[0].value &&
            data.interval_between_installments !== 0
          ) {
            setHasInstallment(true);

            if ((data.value !== data.payment[0].value) === data.payment) {
              setValue("number_of_installments", "2x");
            } else {
              setValue(
                "number_of_installments",
                Math.floor(
                  Number(data.value) / Number(data.payment[0].value)
                ).toString()
              );
            }
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const addNewApportionment = () => {
    setApportionments((previousValue) => [
      ...previousValue,
      {
        value: "",
        cost_center: 0,
        percentage: "",
        financial_category: 0,
        reference_code: "-",
      },
    ]);
  };

  const removeApportionment = (id: number) => {
    let filteredApportionments = apportionments.filter((item, i) => {
      return i !== id;
    });
    setApportionments(filteredApportionments);
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
        .then((repsonse) => repsonse.json())
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
    fetchAccountData();
  }, []);

  useEffect(() => {
    fetchBanks();
  }, [isCreateCategoryPopupVisible, isCostCenterPopupVisibe]);

  const _value = watch("_value");
  const number_of_installments = watch("number_of_installments");

  useEffect(() => {
    let value = (
      stringToCurrency(_value!) / Number(number_of_installments.split("x")[0])
    )
      .toFixed(2)
      .toString()
      .replace(".", ",");
    const formattedValue = parseFloat(value).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setValue("payment.value", formattedValue);
  }, [_value, number_of_installments, setValue]);

  const [firstValue, setFirstValue] = useState("");

  const handle_ValueInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const inputValue = event.target.value.replace(/\D/g, "");
    const formattedValue = formatCurrency(inputValue);
    setFirstValue(formattedValue);
    setValue("_value", formattedValue);
  };

  const handle_PercentageInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    id: number
  ): void => {
    const inputValue = event.target.value.replace(/\D/g, "");
    const formattedValue = formatCurrency(inputValue);
    setFirstValue(formattedValue);
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

  return (
    <>
      {isCreateCategoryPopupVisible && (
        <div className="ModalBackground">
          <CreateCategoryPopup
            closeFunction={setIsCreateCategoryPopupVisible}
          />
        </div>
      )}
      {isCostCenterPopupVisibe && (
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
                    <input
                      className={Styles.Input}
                      placeholder="Ex.: 120,50"
                      type="text"
                      name="_value"
                      onChange={handle_ValueInputChange}
                      value={_value}
                      min={0}
                    />
                    {errors._value && (
                      <p className={Styles.Error}>{errors._value.message}</p>
                    )}
                  </div>
                  {markAs && (
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
                          <option value={0}>
                            Selecione o banco
                          </option>
                          {userBanks.length >= 0 &&
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
                      {useCategories.length >= 1 &&
                        useCategories.map((category, index) => (
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
                      {userCostCenters.length >= 1 &&
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
                    {Array.from(
                      {
                        length: parseInt(
                          getValues("number_of_installments") || "0"
                        ),
                      },
                      (_, index) => (
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
                              />
                            </div>
                          </div>
                          {errors.payment?.installment_values?.[index]
                            ?.value && (
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
                      )
                    )}
                  </section>
                )}
                <section>
                  <div className={Styles.ApportionmentInput}>
                    <span>Habilitar rateio</span>
                    <div>
                      <div>
                        <input
                          type="radio"
                          name="apportionment"
                          id="yes"
                          onChange={(e) => {
                            setIsApportionmentInputChecked(true);
                          }}
                          checked={isApportionmentInputChecked === true}
                        />
                        <label htmlFor="yes">Sim</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="apportionment"
                          id="no"
                          onChange={(e) =>
                            setIsApportionmentInputChecked(false)
                          }
                          checked={isApportionmentInputChecked === false}
                        />
                        <label htmlFor="no">Não</label>
                      </div>
                    </div>
                  </div>
                  <button
                    className={Styles.AddApportionmentButton}
                    type="button"
                    onClick={addNewApportionment}
                  >
                    Adicionar novo rateio
                  </button>
                </section>
                {isApportionmentInputChecked === true && (
                  <section className={Styles.Apportionment}>
                    <h3>Informe os dados do rateio</h3>
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
                                  <span className={Styles.AsterisckSpan}>
                                    *
                                  </span>
                                </label>
                                <select
                                  className={Styles.Input}
                                  {...register(
                                    `apportionment.${index}.financial_category`
                                  )}
                                  onChange={(e) =>
                                    setApportionments((prevApportionments) =>
                                      prevApportionments.map(
                                        (apportionment, i) => {
                                          return i === index
                                            ? {
                                                ...apportionment,
                                                financial_category: Number(
                                                  e.target.value
                                                ),
                                              }
                                            : apportionment;
                                        }
                                      )
                                    )
                                  }
                                >
                                  <option value={0}>
                                    Selecione a categoria
                                  </option>
                                  {useCategories.length >= 1 &&
                                    useCategories.map((category, index) => (
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
                                  <span className={Styles.AsterisckSpan}>
                                    *
                                  </span>
                                </label>
                                <div className={Styles.ValueInput}>
                                  <div>
                                    <span>R$</span>
                                    <input
                                      className={Styles.Input}
                                      placeholder="Ex.: 100,00"
                                      type="text"
                                      {...register(
                                        `apportionment.${index}.value`
                                      )}
                                      onChange={(e) =>
                                        setApportionments(
                                          (prevApportionments) =>
                                            prevApportionments.map(
                                              (apportionment, i) => {
                                                setValue(
                                                  `apportionment.${index}.value`,
                                                  formatCurrency(
                                                    e.target.value.replace(
                                                      /\D/g,
                                                      ""
                                                    )
                                                  ).toString()
                                                );
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
                                                      ).toLocaleString(
                                                        "pt-BR",
                                                        {
                                                          minimumFractionDigits: 2,
                                                          maximumFractionDigits: 2,
                                                        }
                                                      ),
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
                                  <span className={Styles.AsterisckSpan}>
                                    *
                                  </span>
                                </label>
                                <div className={Styles.ValueInput}>
                                  <span>%</span>
                                  <input
                                    className={Styles.Input}
                                    placeholder="Ex.: 10"
                                    type="text"
                                    value={formatCurrency(
                                      apportionment.percentage.replace(
                                        /\D/g,
                                        ""
                                      )
                                    ).toString()}
                                    {...register(
                                      `apportionment.${index}.percentage`
                                    )}
                                    onChange={(e) =>
                                      setApportionments((prevApportionments) =>
                                        prevApportionments.map(
                                          (apportionment, i) => {
                                            handle_PercentageInputChange(
                                              e,
                                              index
                                            );
                                            setValue(
                                              `apportionment.${index}.value`,
                                              (
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
                                              })
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
                                                        _value!.replace(
                                                          /\D/g,
                                                          ""
                                                        )
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
                                  {errors.apportionment?.[index]
                                    ?.percentage && (
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
                                  <span className={Styles.AsterisckSpan}>
                                    *
                                  </span>
                                </label>
                                <select
                                  className={Styles.Input}
                                  {...register(
                                    `apportionment.${index}.cost_center`
                                  )}
                                  onChange={(e) =>
                                    setApportionments((prevApportionments) =>
                                      prevApportionments.map(
                                        (apportionment, i) =>
                                          i === index
                                            ? {
                                                ...apportionment,
                                                cost_center: Number(
                                                  e.target.value
                                                ),
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
                                  {transformStringToNumber(
                                    formatCurrency(
                                      apportionments[index].value.replace(
                                        /\D/g,
                                        ""
                                      )
                                    ).toString()
                                  ).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                                </b>
                              </span>
                              <span>
                                A ratear:{" "}
                                <b>
                                  {" "}
                                  {(
                                    transformStringToNumber(_value || "") -
                                    transformStringToNumber(
                                      formatCurrency(
                                        apportionments[index].value.replace(
                                          /\D/g,
                                          ""
                                        )
                                      ).toString()
                                    )
                                  ).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}{" "}
                                  (
                                  {100 -
                                    transformStringToNumber(
                                      formatCurrency(
                                        apportionments[
                                          index
                                        ].percentage.replace(/\D/g, "")
                                      )
                                    )}
                                  %){" "}
                                </b>
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </section>
                )}
                <section>
                  <div className={Styles.MarkAs}>
                    <span>Marcar como</span>
                    <div>
                      <input
                        type="checkbox"
                        id="receveid"
                        {...register("payment.status")}
                        checked={markAs}
                        onChange={() =>
                          setMarkAs((previousValue) => !previousValue)
                        }
                      />
                      <label htmlFor="receveid">Pago</label>
                      <input
                        type="checkbox"
                        id="hasInstallment"
                        checked={hasInstallment}
                        onChange={() =>
                          setHasInstallment((previousValue) => !previousValue)
                        }
                      />
                      <label htmlFor="hasInstallment">Parcelado</label>

                      <input
                        type="checkbox"
                        id="hasBankSlip"
                        checked={hasBankSlip}
                        {...register("bank_slip")}
                        onChange={() =>
                          {setHasBankSlip((previousValue) => !previousValue)
                            console.log(hasBankSlip)
                          }
                        }
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
