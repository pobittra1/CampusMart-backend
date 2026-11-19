import type { Request, Response } from "express";
import { productService } from "./product.service";

const createProduct = async (req: Request, res: Response) => {
  try {
    console.log(req.user);
    const result = await productService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully !",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: "Product creation failed",
      details: error,
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const result = await productService.getAllPost();
    res.status(200).json({
      success: true,
      message: "All Products retrive successfully!",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      error: "Product retrive failed!",
      details: error,
    });
  }
};

export const productController = {
  createProduct,
  getAllPost,
};
