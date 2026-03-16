const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Designation = sequelize.define(
  "Designation",
  {
    designationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    department: {
      type: DataTypes.INTEGER,
    },

    reportingManager: {
      type: DataTypes.STRING(100),
    },

    jobDescription: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "Designation",
    timestamps: false,
  }
);

const createDesignationTableIfNotExists = async () => {
  await Designation.sync();
};

module.exports = {
  Designation,
  createDesignationTableIfNotExists,
};