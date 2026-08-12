import {
  createChallan,
  getAllChallans,
  getChallanById,
  confirmChallan as confirmChallanRepository,
  cancelChallan as cancelChallanRepository
} from "../repositories/challanRepository";

export async function addChallan(challan: {
  challanNumber?: string;
  customerId: number;
  createdBy: number;
}) {
  const challanNumber =
    challan.challanNumber ||
    `CH-${Date.now()}`;

  return await createChallan({
    challanNumber,
    customerId: challan.customerId,
    createdBy: challan.createdBy
  });
}

export async function fetchAllChallans() {
  return await getAllChallans();
}

export async function fetchChallanById(id: number) {
  const challans = await getChallanById(id);

  if ((challans as any[]).length === 0) {
    throw new Error("Challan not found");
  }

  return (challans as any[])[0];
}

export async function confirmChallan(id: number) {
  return await confirmChallanRepository(id);
}

export async function cancelChallan(id: number) {
  return await cancelChallanRepository(id);
}