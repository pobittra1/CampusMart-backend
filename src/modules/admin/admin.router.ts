import { Router } from "express";
import auth from "../../middlewares/auth";
import { adminController } from "./admin.controller";

const router = Router();

// Get all seller applications
router.get(
  "/seller-applications",
  auth("ADMIN"),
  adminController.getSellerApplications,
);

// Approve seller application
router.patch(
  "/seller-applications/:id/approve",
  auth("ADMIN"),
  adminController.approveSeller,
);

// Reject seller application
router.patch(
  "/seller-applications/:id/reject",
  auth("ADMIN"),
  adminController.rejectSeller,
);

export const adminRouter = router;
