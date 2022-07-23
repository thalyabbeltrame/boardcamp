import chalk from "chalk";
import dayjs from "dayjs";

import connection from "../dbStrategy/postgres.js";

const getRentals = async (req, res) => {
  const { customerId, gameId } = req.query;
  if ((customerId && isNaN(customerId)) || (gameId && isNaN(gameId)))
    return res.sendStatus(400);

  try {
    const { rows: rentals } = await connection.query(
      `
        SELECT 
          rentals.*, 
          customers.id AS "customerId", 
          customers.name AS "customerName",
          games.id AS "gameId",
          games.name AS "gameName",
          categories.id AS "categoryId",
          categories.name AS "categoryName"
        FROM rentals
          JOIN customers ON rentals."customerId" = customers.id
          JOIN games ON rentals."gameId" = games.id
          JOIN categories ON categories.id = games."categoryId"
        ${
          customerId && gameId
            ? `WHERE customers.id = ${customerId} AND games.id = ${gameId}`
            : customerId
            ? `WHERE customers.id = ${customerId}`
            : gameId
            ? `WHERE games.id = ${gameId}`
            : ""
        }
      `
    );

    const rentalsResult = rentals?.map((rental) => {
      const entry = {
        ...rental,
        rentDate: dayjs(rental.rentDate).format("YYYY-MM-DD"),
        customer: {
          id: rental.customerId,
          name: rental.customerName,
        },
        game: {
          id: rental.gameId,
          name: rental.gameName,
          categoryId: rental.categoryId,
          categoryName: rental.categoryName,
        },
      };

      delete entry.customerName;
      delete entry.gameName;
      delete entry.categoryId;
      delete entry.categoryName;

      return entry;
    });

    res.status(200).send(rentalsResult);
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const createRental = async (req, res) => {
  const { customerId, gameId, daysRented } = req.body;

  try {
    const { rows: game } = await connection.query(
      `SELECT * FROM games WHERE games.id = ($1)`,
      [gameId]
    );

    const rentDate = dayjs().format("YYYY-MM-DD");
    const originalPrice = game[0].pricePerDay * daysRented;

    await connection.query(
      `
        INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [customerId, gameId, daysRented, rentDate, originalPrice, null, null]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const finishRental = async (req, res) => {
  const { id: rentalId } = req.params;
  const { daysRented, rentDate, pricePerDay } = res.locals.rental;

  try {
    const returnDate = dayjs().format("YYYY-MM-DD");
    const delayDays = dayjs().diff(dayjs(rentDate), "day") - daysRented;
    const delayFee = delayDays > 0 ? pricePerDay * delayDays : 0;

    await connection.query(
      `
        UPDATE rentals SET "returnDate" = ($1), "delayFee" = ($2)
        WHERE id = ($3)
      `,
      [returnDate, delayFee, rentalId]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const deleteRental = async (req, res) => {
  const { id: rentalId } = req.params;

  try {
    await connection.query(`DELETE FROM rentals WHERE rentals.id = ($1)`, [
      rentalId,
    ]);

    res.sendStatus(200);
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

export { getRentals, createRental, finishRental, deleteRental };
