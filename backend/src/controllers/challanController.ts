import { Request, Response } from "express";

import {
  addChallan,
  fetchAllChallans,
  fetchChallanById,
  confirmChallan as confirmChallanService,
  cancelChallan as cancelChallanService
} from "../services/challanService";

export async function createChallan(
  req: Request,
  res: Response
) {
  try {
    const user = (req as any).user;

    if (!user || !user.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required"
      });
    }

    const challan = await addChallan({
      challanNumber: req.body.challanNumber,
      customerId: Number(req.body.customerId),
      createdBy: Number(user.userId)
    });

    return res.status(201).json({
      success: true,
      message: "Challan created successfully",
      data: challan
    });

  } catch (error: any) {
    console.error("CREATE CHALLAN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create challan"
    });
  }
}

export async function getChallans(
  req: Request,
  res: Response
) {
  try {
    const challans = await fetchAllChallans();

    return res.status(200).json({
      success: true,
      data: challans
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch challans"
    });
  }
}

export async function getChallan(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid challan ID"
      });
    }

    const challan = await fetchChallanById(id);

    return res.status(200).json({
      success: true,
      data: challan
    });

  } catch (error: any) {
    if (error.message === "Challan not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch challan"
    });
  }
}

export async function confirmChallan(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid challan ID"
      });
    }

    const result = await confirmChallanService(id);

    return res.status(200).json({
      success: true,
      message: "Challan confirmed successfully",
      data: result
    });

  } catch (error: any) {
    console.error(error);

    if (error.message === "Challan not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (
      error.message === "Only DRAFT challans can be confirmed" ||
      error.message === "Cannot confirm challan without items" ||
      error.message.startsWith("Insufficient stock") ||
      error.message.startsWith("Product")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to confirm challan"
    });
  }
}

export async function cancelChallan(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid challan ID"
      });
    }

    const result = await cancelChallanService(id);

    return res.status(200).json({
      success: true,
      message: "Challan cancelled successfully",
      data: result
    });

  } catch (error: any) {
    console.error(error);

    if (error.message === "Challan not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (
      error.message ===
      "Only DRAFT challans can be cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to cancel challan"
    });
  }
}