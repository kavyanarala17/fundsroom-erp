import {
  createChallanItem,
  getChallanItems
} from "../repositories/challanItemRepository";

import {
  updateChallanTotalQuantity
} from "../repositories/challanRepository";

import { getChallanById } from "../repositories/challanRepository";
import { getCustomerById } from "../repositories/customerRepository";
import { getProductById } from "../repositories/productRepository";

export async function addChallanItem(item: {
  challanId: number;
  productId: number;
  quantity: number;
}) {
  const challan = await getChallanById(item.challanId);

  if ((challan as any[]).length === 0) {
    throw new Error("Challan not found");
  }

  const challanData = (challan as any[])[0];

  if (challanData.status !== "DRAFT") {
    throw new Error("Cannot add items to confirmed or cancelled challan");
  }

  const product = await getProductById(item.productId);

  if ((product as any[]).length === 0) {
    throw new Error("Product not found");
  }

  const productData = (product as any[])[0];

  if (item.quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  if (Number(productData.current_stock) < item.quantity) {
    throw new Error("Insufficient stock");
  }

  const unitPrice = Number(productData.unit_price);
  const subtotal = unitPrice * item.quantity;

  const result = await createChallanItem({
  challanId: item.challanId,
  productId: item.productId,
  productNameSnapshot: productData.product_name,
  skuSnapshot: productData.sku,
  unitPriceSnapshot: unitPrice,
  quantity: item.quantity,
  subtotal
});

await updateChallanTotalQuantity(item.challanId);

return result;
}

export async function fetchChallanItems(challanId: number) {
  const challan = await getChallanById(challanId);

  if ((challan as any[]).length === 0) {
    throw new Error("Challan not found");
  }

  return await getChallanItems(challanId);
}