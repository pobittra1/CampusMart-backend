import express from "express";
import { productRouter } from "./modules/product/product.router";
import { categoryRouter } from "./modules/category/category.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();
app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

// for product
app.use("/products", productRouter);

// for category
app.use("/category", categoryRouter);

app.get("/", (req, res) => {
  res.send("Hello World !");
});
export default app;
