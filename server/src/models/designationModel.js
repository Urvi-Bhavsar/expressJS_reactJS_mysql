const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const designationMaster = sequelize.define(
  "designationMaster",
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
    tableName: "designationMaster",
    timestamps: false,
  }
);

const createDesignationTableIfNotExists = async () => {
  await designationMaster.sync();
};

module.exports = {
  designationMaster,
  createDesignationTableIfNotExists,
};