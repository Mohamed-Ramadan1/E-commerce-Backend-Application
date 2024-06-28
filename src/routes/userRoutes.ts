import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  deleteMe,
  deactivateMe,
  updateMyPassword,
  updateMyInfo,
} from "../controllers/userController";

import {
  getShoppingCart,
  addItemToShoppingCart,
  removeItemFromShoppingCart,
  clearShoppingCart,
} from "../controllers/shoppingCartController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import { checkItemValidity } from "../middlewares/shoppingCartMiddleware";
import { upload } from "../middlewares/multerMiddleware";
const router = Router();

router.use(protect);

router.route("/me").get(getMe).delete(deleteMe);

router.patch("/me/deactivate", deactivateMe);
router.patch("/me/password", updateMyPassword);
router.patch("/me/info", upload.single("photo"), updateMyInfo);
router
  .route("/")
  .get(restrictTo("admin"), getAllUsers)
  .post(restrictTo("admin"), createUser);
router
  .route("/:id")
  .get(restrictTo("admin"), getUser)
  .patch(restrictTo("admin"), updateUser)
  .delete(restrictTo("admin"), deleteUser);

router.route("/:id/shopping-cart").get(getShoppingCart);

router
  .route("/:id/shopping-cart/items")
  .post(checkItemValidity, addItemToShoppingCart);
router
  .route("/:id/shopping-cart/items/:productId")
  .delete(removeItemFromShoppingCart);
router.route("/:id/shopping-cart/clear").delete(clearShoppingCart);

export default router;
