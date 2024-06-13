import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import {
  getShoppingCart,
  addItemToShoppingCart,
  removeItemFromShoppingCart,
  clearShoppingCart,
} from "../controllers/shoppingCartController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
const router = Router();

router.use(protect);

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

router.route("/:id/shopping-cart/items").post(addItemToShoppingCart);
router
  .route("/:id/shopping-cart/items/:itemId")
  .delete(removeItemFromShoppingCart);
router.route("/:id/shopping-cart/clear").delete(clearShoppingCart);

export default router;
