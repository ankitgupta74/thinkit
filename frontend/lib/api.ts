// API Request Flow:
//
// Component
// → api()
// → Add /api prefix + cookies
// → Send request
// → Handle 401 redirect if needed
// → Return data or throw error

// Shared browser API helper.
// Uses same-origin requests, so HTTP-only auth cookies are automatically included with every request.

// Extends normal fetch options so this helper can also accept plain JSON objects.
type ApiOptions = Omit<RequestInit, "body"> & {
  // Supports normal JSON objects and native fetch body types.
  body?: BodyInit | Record<string, unknown> | null;
};

// Reusable API helper.
// Adds "/api", includes session cookies, converts JSON bodies, and turns failed API responses into normal JavaScript errors.
export async function api<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  // Separate body and headers because they need special handling before fetch.
  const { body, headers, ...restOptions } = options;

  // Plain objects need JSON.stringify().
  // FormData and other native body types must be sent unchanged.
  const shouldSerializeBody =
    body &&
    typeof body === "object" &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer);

  // Create editable headers without changing the caller's original headers.
  const requestHeaders = new Headers(headers);

  // JSON requests need this header.
  // FormData creates its own multipart header automatically.
  if (!(body instanceof FormData) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  // Send request through one shared path so API behavior stays consistent.
  const response = await fetch(`/api${endpoint}`, {
    ...restOptions,
    // Include HTTP-only login cookies with every browser request.
    credentials: "include",
    headers: requestHeaders,
    // Convert plain objects to JSON; keep FormData and other body types unchanged.
    body: shouldSerializeBody ? JSON.stringify(body) : body,
  });

  // A protected API route rejected the current session.
  // Redirect only when a protected request fails.
  // Auth-check endpoints intentionally return 401 when no session exists.
  const isAuthCheckRequest =
    endpoint === "/auth/me" || endpoint === "/deliveryPartners/auth/me";

  // Expired or missing session on a protected request: send the user back to the correct login page.
  if (
    response.status === 401 &&
    !isAuthCheckRequest &&
    typeof window !== "undefined"
  ) {
    // Delivery partners and customers use separate login pages.
    const isDeliveryRoute = window.location.pathname.startsWith("/delivery");

    window.location.href = isDeliveryRoute ? "/delivery/login" : "/login";
  }

  const data = await response.json();

  // Convert failed API responses into errors that calling components can handle.
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  // Return typed success data to the component.
  return data as T;
}
