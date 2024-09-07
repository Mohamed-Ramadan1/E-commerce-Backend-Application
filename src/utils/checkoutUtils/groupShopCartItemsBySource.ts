import { ICartItem } from "../../models/cartItem/cartItem.interface";
import {
  IProduct,
  ProductSourceType,
} from "../../models/product/product.interface";

export type GroupedItems = {
  shopOrders: { shopId: string | null; items: ICartItem[] }[];
  websiteItems: ICartItem[];
};

export const groupItemsByShop = (items: ICartItem[]): GroupedItems => {
  // Initialize the groups
  const groups: GroupedItems = {
    shopOrders: [],
    websiteItems: [],
  };

  // Helper function to find or create a shop group
  const findOrCreateShopGroup = (shopId: string | null) => {
    let group = groups.shopOrders.find((g) => g.shopId === shopId);
    if (!group) {
      group = { shopId: shopId, items: [] };
      groups.shopOrders.push(group);
    }
    return group;
  };

  // Process each item
  items.forEach((item) => {
    const product = item.product as IProduct;

    if (product.sourceType === ProductSourceType.Website) {
      // Add item to website items
      groups.websiteItems.push(item);
    } else {
      // Group items by shop
      const shopGroup = findOrCreateShopGroup(
        product.shopId?.toString() || null
      );
      shopGroup.items.push(item);
    }
  });

  return groups;
};
