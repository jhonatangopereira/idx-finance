import { format } from 'date-fns';

const formatFields = (fields: any, hasInstallment: any, apportionments: any, installmentValues: any) => {    
    const data = {
        client: fields.client,
        competence: format(new Date(fields.competence + 'T00:00:00'), 'dd/MM/yyyy'),
        description: fields.description,
        value: Number(parseFloat(fields._value.replace(/\./g, '').replace(',', '.')).toFixed(2).toString()),
        code: "code",
        observations: fields.observations,
        status: fields.payment.status === false ? "" : "Recebido",
        installment: 1,
        nsu: "nsu",
        financial_category: fields.financial_category,
        category: fields.financial_category,
        cost_center: Number(fields.cost_center),
        financial_account: fields.payment.status ? fields.financial_account : null,
        interval_between_installments: hasInstallment ? fields.payment.interval_between_installments : 0,
        payment: {
            number_of_installments: hasInstallment ? Number(fields.payment.number_of_installments.split("x")[0]) : 1,
            value: Number(parseFloat(fields._value.replace(/\./g, '').replace(',', '.')).toFixed(2).toString()) / (hasInstallment ? Number(fields.payment.number_of_installments.split("x")[0]) : 1),
            payment_method: fields.payment.status ? fields.payment.payment_method : null,
            due_date: hasInstallment ? format(new Date(fields.payment.due_date + 'T00:00:00'), 'dd/MM/yyyy') : format(new Date(fields.alternative_due_date + 'T00:00:00'), 'dd/MM/yyyy'),
            payment_date: fields.payment.status ? format(new Date(fields.payment.payment_date + 'T00:00:00'), 'dd/MM/yyyy') : "01/02/2024",
            status: fields.payment.status === false ? "" : "Recebido",
            installment: 1,
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
        attachment: '',
        apportionment: apportionments.length > 0 ? apportionments.map((currentApportionment: any) => {
            return {
              financial_category: currentApportionment.financial_category,
              cost_center: Number(currentApportionment.cost_center),
              percentage: Number(parseFloat(currentApportionment.percentage.replace(/\./g, '').replace(',', '.')).toFixed(2).toString()),
              value: Number(parseFloat(currentApportionment.value.replace(/\./g, '').replace(',', '.')).toFixed(2).toString()),
              reference_code: '-',
            }
        }) : [],
    };

    if (fields.attachment.length > 0) {
      const file = fields.attachment[0];
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        if (event.target) {
            data.attachment = event.target.result as string;
        }

        return data;        
      }
      reader.readAsDataURL(file);
    } 
    
    return data;    
};

export { formatFields };
