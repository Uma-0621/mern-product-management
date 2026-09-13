const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/database");

const app = express();

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

const PORT = 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");

        await sequelize.sync({ alter: true });
        console.log("Database synchronized successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection/sync failed:", error);
    }
};

startServer();