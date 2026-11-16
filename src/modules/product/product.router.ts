import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { productController } from "./product.controller";
import { auth as betterAuth } from "../../lib/auth";

const router = express.Router();

export enum userRole {
  BUYER = "BUYER",
  SELLER = "SELLER",
  ADMIN = "ADMIN",
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!",
        });
      }

      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Please verify your email!",
        });
      }

      if (roles.length && !roles.includes(session.user.role as userRole)) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission!",
        });
      }

      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

router.post("/", auth(userRole.BUYER), productController.createProduct);
export const productRouter = router;
