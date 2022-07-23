import { Router } from "express";

import {
  getCategories,
  createCategory,
} from "../controllers/categoriesController.js";

import {
  validateCategory,
  checkIfCategoryNameAlreadyExists,
} from "../middlewares/categoriesMiddleware.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post(
  "/categories",
  validateCategory,
  checkIfCategoryNameAlreadyExists,
  createCategory
);

export default categoriesRouter;
