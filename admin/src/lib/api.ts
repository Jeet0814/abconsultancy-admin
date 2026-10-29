export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

const BASE_URL = import.meta.env.VITE_API_URL || "";

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Send httpOnly cookies automatically
  });

  let data: any;
  try {
    data = await response.json();
  } catch {
    data = { success: response.ok, message: response.statusText };
  }

  if (!response.ok) {
    if (response.status === 401 && !endpoint.includes("/api/auth/login") && !endpoint.includes("/api/auth/me")) {
      // Automatic session redirect to login
      window.location.href = "/login";
    }
    const errorMsg = data.message || data.errors?.[0]?.message || "Request failed";
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: "DELETE" }),
};
