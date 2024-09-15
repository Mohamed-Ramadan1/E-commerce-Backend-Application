import { Router } from "express";
import { protect } from "../../middlewares/auth/authMiddleware";
import {
  getWishlist,
  removeItemFromWishlist,
  addItemToWishlist,
  clearWishlist,
} from "../../controllers/wishlist/wishlistController";

const router = Router();
router.use(protect);

router.route("/").get(getWishlist).delete(clearWishlist);
router.route("/:productId").post(addItemToWishlist);

router.route("/:wishlistId").delete(removeItemFromWishlist);
export default router;
