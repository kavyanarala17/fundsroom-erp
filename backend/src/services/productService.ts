import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../repositories/productRepository";

export async function addProduct(product: {
  productName: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock?: number;
  minimumStockAlertQuantity?: number;
  locationWarehouse?: string;
}) {
  return await createProduct(product);
}

export async function fetchAllProducts() {
  return await getAllProducts();
}

export async function fetchProductById(id: number) {
  const products = await getProductById(id);

  if ((products as any[]).length === 0) {
    throw new Error("Product not found");
  }

  return (products as any[])[0];
}

export async function editProduct(
  id: number,
  product: {
    productName?: string;
    sku?: string;
    category?: string;
    unitPrice?: number;
    currentStock?: number;
    minimumStockAlertQuantity?: number;
    locationWarehouse?: string;
  }
) {
  const existingProduct = await getProductById(id);

  if ((existingProduct as any[]).length === 0) {
    throw new Error("Product not found");
  }

  return await updateProduct(id, product);
}

export async function removeProduct(id: number) {
  const existingProduct = await getProductById(id);

  if ((existingProduct as any[]).length === 0) {
    throw new Error("Product not found");
  }

  return await deleteProduct(id);
}