import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { productController } from "./product.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../../types/auth";

const router = express.Router();
router.get("/", productController.getAllPost);
router.get("/:productId", productController.getProductById);
router.post("/", auth(userRole.BUYER), productController.createProduct);
router.patch("/:id/featured", auth("ADMIN"), productController.toggleFeatured);
export const productRouter = router;
