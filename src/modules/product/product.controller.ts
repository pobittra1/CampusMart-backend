import type { Request, Response } from "express";
import { productService } from "./product.service";

const createProduct = async (req: Request, res: Response) => {
  try {
    const result = await productService.createProduct(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Product creation failed",
      details: error,
    });
  }
};

export const productController = {
  createProduct,
};
