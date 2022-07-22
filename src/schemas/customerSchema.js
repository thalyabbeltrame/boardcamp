import JoiBase from "@hapi/joi";
import JoiDate from "@hapi/joi-date";

import connection from "../dbStrategy/postgres.js";

const Joi = JoiBase.extend(JoiDate);

const { rows: customerCPFs } = await connection.query(
  `SELECT cpf FROM customers`
);
const invalidCustomerCPFs = customerCPFs?.map(({ cpf }) => cpf);

const customerSchema = Joi.object({
  name: Joi.string().trim().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .required(),
  cpf: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .invalid(...invalidCustomerCPFs)
    .required(),
  birthday: Joi.date().format("YYYY-MM-DD").required(),
});

export default customerSchema;
