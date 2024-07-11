import { Router } from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";
import {
  validateBeforeUpdateShopEmailAddress,
  validateBeforeConfirmUpdateShopEmailAddress,
  validateBeforeUpdateShopInfo,
  validateBeforeUpdateBanner,
} from "../middlewares/shopSettingsMiddleware";

import {
  updateShopInformation,
  updateShopEmailAddress,
  verifyChangedShopEMail,
  resetShopEmailAddressToDefault,
  getMyShop,
  activateShop,
  deactivateShop,
  deleteShopRequest,
  updateShopBanner,
} from "../controllers/shopSettingsController";
const router = Router();

router.use(protect);

// Shop setting controller routes

// get my shop
router.route("/my-shop").get(getMyShop);

// activate shop
router.route("/my-shop/activate").patch(activateShop);

// un activate shop
router.route("/my-shop/un-active").patch(deactivateShop);

// update shop information
router
  .route("/my-shop/update-information")
  .patch(
    validateBeforeUpdateShopInfo,
    upload.single("photo"),
    updateShopInformation
  );

// Update shop banner
router
  .route("/my-shop/banner")
  .patch(validateBeforeUpdateBanner, upload.single("banner"), updateShopBanner);

// delete shop request routes

// create shop delete request.
router.route("/my-shop/delete-request").post(deleteShopRequest);

// update shop email.
router
  .route("/my-shop/update-email")
  .post(validateBeforeUpdateShopEmailAddress, updateShopEmailAddress);

// Reset the email address to the default email.
router.route("/my-shop/reset-email").patch(resetShopEmailAddressToDefault);

// verify the changed email address.
router
  .route("/my-shop/verify-changed-email/:token")
  .get(validateBeforeConfirmUpdateShopEmailAddress, verifyChangedShopEMail);

// Shop products controller.

// Shop Orders controller routes

export default router;
