import express from "express";
import { productRouter } from "./modules/product/product.router";
import { categoryRouter } from "./modules/category/category.router";
const app = express();
app.use(express.json());

// for product
app.use("/products", productRouter);

// for category
app.use("/category", categoryRouter);

app.get("/", (req, res) => {
  res.send("Hello World !");
});
export default app;
