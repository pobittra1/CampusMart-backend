import type { Request, Response, NextFunction } from "express";
import { sellerService } from "./seller.service";

const applyForSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const { reason } = req.body;

    const result = await sellerService.applyForSeller(userId, reason);

    res.status(201).json({
      success: true,
      message: "Seller application submitted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const sellerController = {
  applyForSeller,
};
