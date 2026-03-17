const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Department = sequelize.define(
  "Department",
  {
    departmentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "Department",
    timestamps: false,
  }
);


const createDepartmentTableIfNotExists = async () => {
  await Department.sync();
};

module.exports = {
  Department,
  createDepartmentTableIfNotExists,
};