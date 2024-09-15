import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth/authMiddleware";
import { upload } from "../../config/multer.config";
import {
  validateBeforeUpdateShopEmailAddress,
  validateBeforeConfirmUpdateShopEmailAddress,
  validateBeforeUpdateShopInfo,
  validateBeforeUpdateBanner,
} from "../../middlewares/shop/shopSettingsMiddleware";

import {
  validateBeforeAddNewProduct,
  validateBeforeUpdateProduct,
  validateBeforeDeleteProduct,
  validateBeforeFreezeProduct,
  validateBeforeUnFreezeProduct,
} from "../../middlewares/shop/shopProductsMiddleware";

// shop settings controller
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
} from "../../controllers/shop/shopSettingsController";

// shop products controller
import {
  addProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  freezeProduct,
  unfreezeProduct,
} from "../../controllers/shop/shopProductsController";

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

//---------------------------------------------------------------------

// Shop products controller.
// get all products on shop
router.route("/my-shop/products/:shopId").get(getAllProducts);

//add new product to the shop
router.route("/my-shop/products").post(validateBeforeAddNewProduct, addProduct);

router
  .route("/my-shop/products/:productId")
  .patch(validateBeforeUpdateProduct, updateProduct)
  .delete(validateBeforeDeleteProduct, deleteProduct);

// Freeze a product
router
  .route("/my-shop/products/:productId/freeze")
  .patch(validateBeforeFreezeProduct, freezeProduct);

// Unfreeze a product
router
  .route("/my-shop/products/:productId/unfreeze")
  .patch(validateBeforeUnFreezeProduct, unfreezeProduct);

//---------------------------------------------------------------------

// Shop Orders controller routes

export default router;
