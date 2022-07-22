import gameSchema from "../schemas/gameSchema.js";

const validateGame = async (req, res, next) => {
  try {
    const { error } = gameSchema.validate({ ...req.body });

    if (error && error.details[0].type === "any.invalid")
      return res.status(409).send("Game name already exists");

    if (error) return res.status(400).send(error.details[0].message);

    next();
  } catch (error) {
    console.log(chalk.red(error));
  }
};

export default validateGame;
