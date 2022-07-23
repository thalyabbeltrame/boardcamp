import { Router } from "express";

import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
} from "../controllers/customersController.js";

import {
  validateCustomer,
  validateCustomerId,
  checkIfCpfAlreadyExists,
  checkIfCpfAlreadyExistsAndIsNotTheSameUser,
} from "../middlewares/customersMiddleware.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", validateCustomerId, getCustomerById);
customersRouter.post(
  "/customers",
  validateCustomer,
  checkIfCpfAlreadyExists,
  createCustomer
);
customersRouter.put(
  "/customers/:id",
  validateCustomerId,
  validateCustomer,
  checkIfCpfAlreadyExistsAndIsNotTheSameUser,
  updateCustomer
);

export default customersRouter;
