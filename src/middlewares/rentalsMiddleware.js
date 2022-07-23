import chalk from "chalk";

import rentalSchema from "../schemas/rentalSchema.js";

const validateRental = async (req, res, next) => {
  try {
    const { error } = rentalSchema.validate({ ...req.body });

    if (error) return res.status(400).send(error.details[0].message);
    next();
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const validateRentalId = async (req, res, next) => {
  const { id } = req.params;

  try {
    const rental = await connection.query(
      "SELECT * FROM rentals WHERE rentals.id = ($1)",
      [id]
    );

    if (!rental.length) return res.sendStatus(404);

    next();
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const checkIfRentalIsAlreadyFinished = async (req, res, next) => {
  const { id: rentalId } = req.params;

  try {
    const { rows: rental } = await connection.query(
      `
        SELECT rentals.*, games."pricePerDay" AS "pricePerDay" 
        FROM rentals
        JOIN games ON games.id = rentals."gameId"
        WHERE rentals.id = ($1)
      `,
      [rentalId]
    );

    const isRentalFinished = rental[0].returnDate !== null;
    if (isRentalFinished) return res.sendStatus(400);

    res.locals.rental = rental[0];
    next();
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const checkIfRentalIsStillActive = async (req, res, next) => {
  const { id: rentalId } = req.params;

  try {
    const { rows: rental } = await connection.query(
      `SELECT * FROM rentals WHERE rentals.id = ($1)`,
      [rentalId]
    );

    const isRentalStillActive = rental[0].returnDate === null;
    if (isRentalStillActive) return res.sendStatus(400);

    next();
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

export {
  validateRental,
  validateRentalId,
  checkIfRentalIsAlreadyFinished,
  checkIfRentalIsStillActive,
};
