import JoiImport from "joi";
import JoiDate from "@joi/date";

const Joi = JoiImport.extend(JoiDate);

const phoneRegex = /^[0-9]{10,11}$/;
const cpfRegex = /^[0-9]{11}$/;

const customerSchema = Joi.object({
  name: Joi.string().trim().required(),
  phone: Joi.string().pattern(phoneRegex).required(),
  cpf: Joi.string().pattern(cpfRegex).required(),
  birthday: Joi.date().max("now").format("YYYY-MM-DD").required(),
});

export default customerSchema;
