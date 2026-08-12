import { Request, Response } from "express";

import {
  addCustomer,
  fetchAllCustomers,
  fetchCustomerById,
  editCustomer,
  removeCustomer,
  fetchCustomerSummary,
  searchCustomerRecords
} from "../services/customerService";

export async function createCustomer(
  req: Request,
  res: Response
) {
  try {
    const customer = await addCustomer(req.body);

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create customer"
    });
  }
}

export async function getCustomers(
  req: Request,
  res: Response
) {
  try {
    const customers = await fetchAllCustomers();

    return res.status(200).json({
      success: true,
      data: customers
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers"
    });
  }
}

export async function getCustomer(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID"
      });
    }

    const customer = await fetchCustomerById(id);

    return res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error: any) {
    if (error.message === "Customer not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer"
    });
  }
}

export async function updateCustomer(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID"
      });
    }

    const customer = await editCustomer(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer
    });
  } catch (error: any) {
    if (error.message === "Customer not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update customer"
    });
  }
}
export async function deleteCustomer(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID"
      });
    }

    await removeCustomer(id);

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully"
    });

  } catch (error: any) {

    if (error.message === "Customer not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete customer"
    });
  }
}
export async function getCustomerSummary(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID"
      });
    }

    const summary = await fetchCustomerSummary(id);

    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error: any) {
    if (error.message === "Customer not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer summary"
    });
  }
}
export async function searchCustomersController(
  req: Request,
  res: Response
) {
  try {
    const search = String(req.query.search || "").trim();

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Search value is required"
      });
    }

    const customers = await searchCustomerRecords(search);

    return res.status(200).json({
      success: true,
      data: customers
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to search customers"
    });
  }
}