import chalk from "chalk";

import connection from "../dbStrategy/postgres.js";

const getGames = async (req, res) => {
  const { name } = req.query || "";

  try {
    const { rows: games } = await connection.query(
      `SELECT games.*, categories.name as "categoryName" FROM games 
       JOIN categories ON games."categoryId" = categories.id
       WHERE games.name ILIKE ($1)`,
      [`${name}%`]
    );
    res.status(200).send(games);
  } catch (error) {
    console.log(chalk.red(error));
  }
};

const createGame = async (req, res) => {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
  try {
    await connection.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
       VALUES ($1, $2, $3, $4, $5)`,
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(chalk.red(error));
  }
};

export { getGames, createGame };
