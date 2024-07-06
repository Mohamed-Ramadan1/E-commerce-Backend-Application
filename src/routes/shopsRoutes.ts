import { Router } from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import { validateBeforeUpdateShopEmailAddress } from "../middlewares/shopSettingsMiddleware";
import {
  updateShopInformation,
  updateShopEmailAddress,
  verifyChangedShopEMail,
  resetShopEmailAddressToDefault,
  getMyShop,
  activateShop,
  deactivateShop,
  deleteShopRequest,
} from "../controllers/shopSettingsController";
const router = Router();

router.use(protect);

router.route("/my-shop").get(getMyShop);

router.route("/my-shop/activate").patch(activateShop);

router.route("/my-shop/un-active").patch(deactivateShop);

router.route("/my-shop/delete-request").patch(deleteShopRequest);

router.route("/my-shop/reset-email").patch(resetShopEmailAddressToDefault);

router.route("/my-shop/update-information").patch(updateShopInformation);

router
  .route("/my-shop/update-email")
  .post(validateBeforeUpdateShopEmailAddress, updateShopEmailAddress);

router.route("/my-shop/verify-changed-email").post(verifyChangedShopEMail);

export default router;
