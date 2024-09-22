import Product from "../../../models/product/productModel";

export const getProductsAnalytics = async () => {
  const endDate = new Date(); // Current date
  const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  const [
    totalProducts,
    totalShopProducts,
    totalWebsiteProducts,
    newProducts,
    totalOutOfStockProducts,
    totalInStockProducts,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ sourceType: "shop" }),
    Product.countDocuments({ sourceType: "website" }),
    Product.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    Product.countDocuments({ availability_status: "available" }),
    Product.countDocuments({ availability_status: "inStock" }),
  ]);

  return {
    totalProducts,
    totalShopProducts,
    totalWebsiteProducts,
    newProducts,
    totalOutOfStockProducts,
    totalInStockProducts,
  };
};
