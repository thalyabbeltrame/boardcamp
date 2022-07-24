import { Router } from "express";

import {
  getRentals,
  createRental,
  finishRental,
  deleteRental,
  getStoreBilling,
} from "../controllers/rentalsController.js";

import {
  validateRental,
  validateRentalId,
  checkIfRentalIsAlreadyFinished,
  checkIfRentalIsStillActive,
  checkGameAvailability,
} from "../middlewares/rentalsMiddleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post(
  "/rentals",
  validateRental,
  checkGameAvailability,
  createRental
);
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
rentalsRouter.get("/rentals/metrics", getStoreBilling);

export default rentalsRouter;
