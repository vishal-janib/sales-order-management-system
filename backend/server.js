const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDb Connected"))
  .catch((e) => console.log(e));

app.get("/", (req, res) => {
  res.send("Sales Order management API");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
