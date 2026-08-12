import { getDashboardData } from "../repositories/dashboardRepository";

export async function fetchDashboardData() {
  return await getDashboardData();
}