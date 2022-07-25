import chalk from "chalk";
import { stripHtml } from "string-strip-html";

import connection from "../dbStrategy/postgres.js";

import gameSchema from "../schemas/gameSchema.js";

const validateGame = async (req, res, next) => {
  try {
    const { error } = gameSchema.validate(
      { ...req.body },
      { abortEarly: false }
    );
    if (error)
      return res.status(400).send(error.details.map(({ message }) => message));

    next();
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const checkIfGameNameAlreadyExists = async (req, res, next) => {
  const name = stripHtml(req.body.name).result.trim();

  try {
    const { rows: game } = await connection.query(
      `
        SELECT * FROM games 
        WHERE name = ($1)
      `,
      [name]
    );
    if (game.length > 0) return res.sendStatus(409);

    next();
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

export { validateGame, checkIfGameNameAlreadyExists };
