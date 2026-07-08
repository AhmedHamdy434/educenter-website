/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestOptions, ApiResponse } from "@/types";
import { buildParams } from "./buildParams";

export const serverApiClient = async <T>({
  url,
  method = "GET",
  params,
  body,
  headers,
  cache = "no-store",
}: RequestOptions): Promise<ApiResponse<T>> => {
  let token: string | undefined;

  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value;
    } catch (e) {
      console.error("Error accessing server cookies:", e);
    }
  } else {
    // Client-side: read token from cookies
    token = document.cookie
      .split("; ")
      .find((row) => row.trim().startsWith("token="))
      ?.split("=")[1];
  }

  const query = buildParams(params);
  const queryString = query ? `?${query}` : "";
  const isFormData = body instanceof FormData;

  const headersInit: Record<string, string> = {
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
    ...(headers as Record<string, string>),
  };

  if (!isFormData && !headersInit["Content-Type"]) {
    headersInit["Content-Type"] = "application/json";
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  try {
    const res = await fetch(`${baseUrl}/api${url}${queryString}`, {
      method,
      headers: headersInit,
      body: body
        ? isFormData
          ? (body as any)
          : JSON.stringify(body)
        : undefined,
      cache,
    });
    const data = await res.json();

    if (!res.ok) {
      console.error(new Error(data.message || "Something went wrong"));
    }
console.log("getttt",url,data)
    return data;
  } catch (error) {
    console.error("Error during API request:", error);
    const errorMessage =
      "فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.";


    return {
      success: false,
      message: errorMessage,
      data: null as any,
    };
  }
};
