import { Router } from "express";

import { getGames, createGame } from "../controllers/gamesController.js";

import {
  validateGame,
  checkIfGameNameAlreadyExists,
} from "../middlewares/gamesMiddleware.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post(
  "/games",
  validateGame,
  checkIfGameNameAlreadyExists,
  createGame
);

export default gamesRouter;
