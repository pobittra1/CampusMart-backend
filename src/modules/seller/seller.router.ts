import express from "express";
import auth from "../../middlewares/auth";
import { userRole } from "../../types/auth";
import { sellerController } from "./seller.controller";

const router = express.Router();
router.post("/apply", auth(userRole.BUYER), sellerController.applyForSeller);

export const sellerRouter = router;
