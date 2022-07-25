import chalk from "chalk";

import connection from "../dbStrategy/postgres.js";

import rentalSchema from "../schemas/rentalSchema.js";

const validateRental = async (req, res, next) => {
  try {
    const { error } = rentalSchema.validate(
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

const validateRentalId = async (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id) || id % 1) return res.sendStatus(400);

  try {
    const { rows: rental } = await connection.query(
      `
        SELECT * FROM rentals 
        WHERE rentals.id = ($1)
      `,
      [id]
    );
    if (rental.length === 0) return res.sendStatus(404);

    next();
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const checkIfRentalIsAlreadyFinished = async (req, res, next) => {
  const { id } = req.params;

  try {
    const { rows: rental } = await connection.query(
      `
        SELECT rentals.*, games."pricePerDay" AS "pricePerDay" 
        FROM rentals
        JOIN games ON games.id = rentals."gameId"
        WHERE rentals.id = ($1)
      `,
      [id]
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
  const { id } = req.params;

  try {
    const { rows: rental } = await connection.query(
      `
        SELECT * FROM rentals 
        WHERE rentals.id = ($1)
      `,
      [id]
    );

    const isRentalStillActive = rental[0].returnDate === null;
    if (isRentalStillActive) return res.sendStatus(400);

    next();
  } catch (error) {
    console.log(chalk.red(error));
    res.sendStatus(500);
  }
};

const checkGameAvailability = async (req, res, next) => {
  const { gameId } = req.body;

  try {
    const { rows: rentals } = await connection.query(
      `
        SELECT * FROM rentals 
        WHERE rentals."gameId" = ($1) AND rentals."returnDate" IS NULL
      `,
      [gameId]
    );

    const { rows: game } = await connection.query(
      `
        SELECT * FROM games 
        WHERE games.id = ($1)
      `,
      [gameId]
    );

    const hasGameInStock = game[0].stockTotal > rentals.length;
    if (!hasGameInStock) return res.sendStatus(400);

    res.locals.game = game[0];
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
  checkGameAvailability,
};
