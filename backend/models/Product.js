const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    returnable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    productType: {
        type: DataTypes.ENUM("Physical", "Digital"),
        allowNull: false,
        defaultValue: "Physical"
    },
    availability: {
        type: DataTypes.ENUM("Available", "Unavailable"),
        allowNull: false,
        defaultValue: "Available"
    },
    availableDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

module.exports = Product;
