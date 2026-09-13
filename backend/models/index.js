const Category = require("./Category");
const Product = require("./Product");
Category.hasMany(Product, {
    foreignKey: "categoryId"
});

Product.belongsTo(Category, {
    foreignKey: "categoryId"
});


module.exports = {
    Category,
    Product
};