import { Router } from "express";

import {
  getShoppingCart,
  addItemToShoppingCart,
  removeItemFromShoppingCart,
  decreaseItemQuantity,
  clearShoppingCart,
  getAllShoppingCarts,
  getShoppingCartById,
  deleteShoppingCart,
  updateShoppingCart,
} from "../../controllers/shopping/shoppingCartController";

// middlewares imports.
import { restrictTo, protect } from "../../middlewares/auth/authMiddleware";

import {
  checkItemValidity,
  validateBeforeRemoveItem,
  validateBeforeDecrementItem,
} from "../../middlewares/shoppingCart/shoppingCartMiddleware";

const router = Router();

router.use(protect);

// shopping cart routes for the user
router.route("/me").get(getShoppingCart);
router.route("/items").post(checkItemValidity, addItemToShoppingCart);
router
  .route("/items/:productId")
  .delete(validateBeforeRemoveItem, removeItemFromShoppingCart);
router
  .route("/decrement")
  .patch(validateBeforeDecrementItem, decreaseItemQuantity);
router.route("/clear").delete(clearShoppingCart);

router.use(protect, restrictTo("admin"));
router.route("/").get(getAllShoppingCarts);
router
  .route("/:id")
  .get(getShoppingCartById)
  .delete(deleteShoppingCart)
  .patch(updateShoppingCart);

export default router;
