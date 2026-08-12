import { Request, Response } from "express";

import { fetchDashboardData } from "../services/dashboardService";

export async function getDashboard(
  req: Request,
  res: Response
) {
  try {
    const dashboard = await fetchDashboardData();

    return res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data"
    });
  }
}