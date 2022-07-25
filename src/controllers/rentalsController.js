import chalk from "chalk";
import dayjs from "dayjs";

import connection from "../dbStrategy/postgres.js";

const getRentals = async (req, res) => {
  const { customerId, gameId, limit, offset } = req.query;

  try {
    const filter =
      customerId && gameId
        ? `WHERE customers.id = ${customerId} AND games.id = ${gameId}`
        : customerId
        ? `WHERE customers.id = ${customerId}`
        : gameId
        ? `WHERE games.id = ${gameId}`
        : "";

    const { rows: rentals } = await connection.query(
      `
        SELECT 
          rentals.*,
          rentals."rentDate"::VARCHAR,
          rentals."returnDate"::VARCHAR,
          jsonb_build_object(
              'id', customers.id,
              'name', customers.name
          ) as customer,
          jsonb_build_object(
              'id', games.id,
              'name', games.name,
              'categoryId', categories.id,
              'categoryName', categories.name
          ) as game
        FROM rentals
        JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id
        JOIN categories ON categories.id = games."categoryId"
        ${filter}
        LIMIT ($1) OFFSET ($2)
      `,
      [limit, offset]
    );

    res.status(200).send(rentals);
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const createRental = async (req, res) => {
  const { customerId, gameId, daysRented } = req.body;
  const { game } = res.locals;

  try {
    const rentDate = dayjs().format("YYYY-MM-DD");
    const originalPrice = game.pricePerDay * daysRented;

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
  const { id } = req.params;
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
      [returnDate, delayFee, id]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const deleteRental = async (req, res) => {
  const { id } = req.params;

  try {
    await connection.query(
      `
        DELETE FROM rentals 
        WHERE rentals.id = ($1)
      `,
      [id]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const getStoreBilling = async (_req, res) => {
  try {
    const { rows: rental } = await connection.query(
      `
        SELECT 
          COALESCE(SUM("originalPrice") + SUM("delayFee"), 0)::double precision AS revenue, 
          COUNT(id)::double precision AS rentals, 
          COALESCE((SUM("originalPrice") + SUM("delayFee")) / COUNT(id), 0)::double precision AS average 
        FROM rentals 
        WHERE rentals."returnDate" IS NOT NULL
      `
    );

    res.status(200).send(rental);
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

export {
  getRentals,
  createRental,
  finishRental,
  deleteRental,
  getStoreBilling,
};
