import { Router } from "express";

import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
} from "../controllers/customersController.js";

import validateCustomer from "../middlewares/customersMiddleware.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", validateCustomer, createCustomer);
customersRouter.put("/customers/:id", validateCustomer, updateCustomer);

export default customersRouter;
