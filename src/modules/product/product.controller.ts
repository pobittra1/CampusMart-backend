import type { Request, Response } from "express";
import { productService } from "./product.service";
import {
  ProductCondition,
  ProductStatus,
} from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

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
    const { search, condition } = req.query;

    const searchStr = typeof search === "string" ? search : undefined;

    const conditionStr =
      typeof condition === "string"
        ? (condition as ProductCondition)
        : undefined;

    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
          ? false
          : undefined
      : undefined;

    const status = req.query.status as ProductStatus;
    const sellerId = req.params.sellerId as string | undefined;

    const options = paginationSortingHelper(req.query);
    const { page, limit, skip, sortBy, sortOrder } = options;

    console.log("options:", options);
    const result = await productService.getAllPost({
      search: searchStr,
      condition: conditionStr,
      isFeatured,
      status,
      sellerId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
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

const toggleFeatured = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID!",
      });
    }

    const result = await productService.toggleFeatured(id);

    res.status(200).json({
      success: true,
      message: "Product featured status updated successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update product featured status!",
      error: error.message,
    });
  }
};
export const productController = {
  createProduct,
  getAllPost,
  toggleFeatured,
};
