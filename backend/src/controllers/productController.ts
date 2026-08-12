import { Request, Response } from "express";

import {
  addProduct,
  fetchAllProducts,
  fetchProductById,
  editProduct,
  removeProduct
} from "../services/productService";

export async function createProduct(
  req: Request,
  res: Response
) {
  try {
    const product = await addProduct(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error: any) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "SKU already exists"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create product"
    });
  }
}

export async function getProducts(
  req: Request,
  res: Response
) {
  try {
    const products = await fetchAllProducts();

    return res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products"
    });
  }
}

export async function getProduct(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await fetchProductById(id);

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error: any) {
    if (error.message === "Product not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product"
    });
  }
}

export async function updateProduct(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await editProduct(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (error: any) {
    if (error.message === "Product not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "SKU already exists"
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product"
    });
  }
}

export async function deleteProduct(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    await removeProduct(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error: any) {
    if (error.message === "Product not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product"
    });
  }
}