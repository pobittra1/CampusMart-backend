import express from "express";
import { productRouter } from "./modules/product/product.router";
const app = express();
app.use(express.json());

app.use("/products", productRouter);

app.get("/", (req, res) => {
  res.send("Hello World !");
});
export default app;
