import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  activateUser,
  deactivateUser,
  deleteUser,
  getMe,
  deleteMe,
  deactivateMe,
  updateMyPassword,
  updateMyInfo,
  convertLoyaltyPointsIntoBalance,
} from "../../controllers/users/userController";

import {
  getShoppingCart,
  addItemToShoppingCart,
  removeItemFromShoppingCart,
  decreaseItemQuantity,
  clearShoppingCart,
} from "../../controllers/shoppingCart/shoppingCartController";

// middlewares imports.
import { protect, restrictTo } from "../../middlewares/auth/authMiddleware";
import { checkItemValidity } from "../../middlewares/shoppingCart/shoppingCartMiddleware";
import { upload } from "../../config/multer.config";
import {
  validateBeforeUpdateUserInfo,
  validateBeforeUpdateUserPassword,
} from "../../middlewares/user/userMiddleware";

const router = Router();

router.use(protect);

router.route("/me").get(getMe).delete(deleteMe);
// convert loyalty points into balance
router.route("/me/loyalty-points").patch(convertLoyaltyPointsIntoBalance);

router.patch("/me/deactivate", deactivateMe);
router.patch(
  "/me/password",
  validateBeforeUpdateUserPassword,
  updateMyPassword
);
router.patch(
  "/me/info",
  upload.single("photo"),
  validateBeforeUpdateUserInfo,
  updateMyInfo
);

router
  .route("/")
  .get(restrictTo("admin"), getAllUsers)
  .post(restrictTo("admin"), createUser);
router
  .route("/:id")
  .get(restrictTo("admin"), getUser)
  .patch(restrictTo("admin"), updateUser)
  .delete(restrictTo("admin"), deleteUser);

// activate and deactivate for users-accounts
router.patch("/:id/activate", restrictTo("admin"), activateUser);
router.patch("/:id/deactivate", restrictTo("admin"), deactivateUser);

// shopping cart routes for the user
router.route("/:id/shopping-cart").get(getShoppingCart);

router
  .route("/:id/shopping-cart/items")
  .post(checkItemValidity, addItemToShoppingCart);
router
  .route("/:id/shopping-cart/items/:productId")
  .delete(removeItemFromShoppingCart);
router.route("/:id/shopping-cart/decrement").patch(decreaseItemQuantity);
router.route("/:id/shopping-cart/clear").delete(clearShoppingCart);

export default router;
