import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { productController } from "./product.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../../types/auth";

const router = express.Router();

router.post("/", auth(userRole.BUYER), productController.createProduct);
export const productRouter = router;
