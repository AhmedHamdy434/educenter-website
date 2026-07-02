import { ApiResponse } from "@/types";
import { SubscriptionPlan } from "../types/subscription-plan";

export async function getSubscriptionPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(
    `${baseUrl}/api/subscription-plans`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch subscription plans: ${res.statusText}`);
  }
const result = await res.json();

  return result;
}
