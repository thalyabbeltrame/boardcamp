import { Router } from "express";

import {
  getRentals,
  createRental,
  finishRental,
  deleteRental,
} from "../controllers/rentalsController.js";

import {
  validateRental,
  validateRentalId,
  checkIfRentalIsAlreadyFinished,
  checkIfRentalIsStillActive,
} from "../middlewares/rentalsMiddleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateRental, createRental);
rentalsRouter.post(
  "/rentals/:id/return",
  validateRentalId,
  checkIfRentalIsAlreadyFinished,
  finishRental
);
rentalsRouter.delete(
  "/rentals/:id",
  validateRentalId,
  checkIfRentalIsStillActive,
  deleteRental
);

export default rentalsRouter;
