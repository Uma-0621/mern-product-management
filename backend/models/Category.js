const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = sequelize.define("Category", {
    name: {
    type: DataTypes.STRING,
    allowNull: false
},
    status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
}
});
module.exports = Category;