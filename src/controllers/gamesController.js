import chalk from "chalk";

import connection from "../dbStrategy/postgres.js";

const getGames = async (req, res) => {
  const name = req.query.name || "";
  const { limit, offset } = req.query;

  try {
    const { rows: games } = await connection.query(
      `
        SELECT 
          games.*, 
          categories.name as "categoryName" 
        FROM games 
        JOIN categories ON games."categoryId" = categories.id
        WHERE games.name ILIKE ($1)
        LIMIT ($2) OFFSET ($3)
      `,
      [`${name}%`, limit, offset]
    );
    res.status(200).send(games);
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const createGame = async (req, res) => {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  try {
    await connection.query(
      `
        INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
        VALUES ($1, $2, $3, $4, $5)
      `,
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

export { getGames, createGame };
