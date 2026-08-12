import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerSummary,
  searchCustomers
} from "../repositories/customerRepository";

export async function addCustomer(customer: {
  customerName: string;
  mobileNumber: string;
  email?: string;
  businessName: string;
  gstNumber?: string;
  customerType: "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
  address?: string;
  status?: "LEAD" | "ACTIVE" | "INACTIVE";
  followUpDate?: string;
  notes?: string;
}) {
  return await createCustomer(customer);
}

export async function fetchAllCustomers() {
  return await getAllCustomers();
}

export async function fetchCustomerById(id: number) {
  const customers = await getCustomerById(id);

  if ((customers as any[]).length === 0) {
    throw new Error("Customer not found");
  }

  return (customers as any[])[0];
}

export async function editCustomer(
  id: number,
  customer: {
    customerName?: string;
    mobileNumber?: string;
    email?: string;
    businessName?: string;
    gstNumber?: string;
    customerType?: "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
    address?: string;
    status?: "LEAD" | "ACTIVE" | "INACTIVE";
    followUpDate?: string;
    notes?: string;
  }
) {
  const existingCustomer = await getCustomerById(id);

  if ((existingCustomer as any[]).length === 0) {
    throw new Error("Customer not found");
  }

  return await updateCustomer(id, customer);
}

export async function removeCustomer(id: number) {
  const existingCustomer = await getCustomerById(id);

  if ((existingCustomer as any[]).length === 0) {
    throw new Error("Customer not found");
  }

  return await deleteCustomer(id);
}
export async function fetchCustomerSummary(id: number) {
  const summary = await getCustomerSummary(id);

  if (!summary) {
    throw new Error("Customer not found");
  }

  return summary;
}
export async function searchCustomerRecords(search: string) {
  return await searchCustomers(search);
}