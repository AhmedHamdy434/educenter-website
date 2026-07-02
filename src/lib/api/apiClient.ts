/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestOptions, ApiResponse } from "@/types";
import { cookies } from "next/headers";
import { buildParams } from "./buildParams";
// import { forwardResponseCookies } from "./forwardResponseCookies";

export const serverApiClient = async <T>({
  url,
  method = "GET",
  params,
  body,
  headers,
  cache = "no-store",
}: RequestOptions): Promise<ApiResponse<T>> => {
  const cookieStore = await cookies();

  const token = cookieStore.get("token");

  const query = buildParams(params);
  const queryString = query ? `?${query}` : "";
  const isFormData = body instanceof FormData;

  const headersInit: Record<string, string> = {
    ...(token && {
      Authorization: `Bearer ${token.value}`,
    }),
    ...(headers as Record<string, string>),
  };

  if (!isFormData && !headersInit["Content-Type"]) {
    headersInit["Content-Type"] = "application/json";
  }

  const baseUrl =
    url.startsWith("http://") || url.startsWith("https://")
      ? ""
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  try {
    const res = await fetch(`${baseUrl}${url}${queryString}`, {
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

    //   await forwardResponseCookies(res);
    if (!res.ok) {
      console.error(new Error(data.message || "Something went wrong"));
    }
    return data;
  } catch (error) {
    console.error("Error during API request:", error);
    return {
      success: false,
      message:
        "فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.",
      data: null as any,
    };
  }
};
