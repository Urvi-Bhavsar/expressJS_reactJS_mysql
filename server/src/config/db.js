const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "mern_stack_db", //DB_NAME
  "root",// USERNAME
  "root",// PASSWORD
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  });

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to MySQL database.");
  })
  .catch((err) => {
    console.error("Unable to connect:", err);
  });

module.exports = sequelize;