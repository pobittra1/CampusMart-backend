import type { Request, Response, NextFunction } from "express";
import { adminService } from "./admin.service";

const getSellerApplications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await adminService.getSellerApplications();

    res.status(200).json({
      success: true,
      message: "Seller applications retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const approveSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }
    const result = await adminService.approveSeller(id);

    res.status(200).json({
      success: true,
      message: "Seller application approved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const rejectSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }
    const result = await adminService.rejectSeller(id);

    res.status(200).json({
      success: true,
      message: "Seller application rejected successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const adminController = {
  getSellerApplications,
  approveSeller,
  rejectSeller,
};
