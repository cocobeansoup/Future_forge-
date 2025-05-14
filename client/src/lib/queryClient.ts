import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || res.statusText || "An unknown error occurred";
    throw new Error(errorMessage);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  body?: any,
  options?: RequestInit,
) {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn = <TData>(options: {
  on401: UnauthorizedBehavior;
}) => {
  return async ({ queryKey }: { queryKey: [string] }): Promise<TData | null> => {
    const [url] = queryKey;
    
    try {
      const res = await fetch(url);
      
      if (res.status === 401) {
        if (options.on401 === "returnNull") {
          return null;
        }
        throw new Error("Unauthorized");
      }
      
      await throwIfResNotOk(res);
      return res.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      queryFn: getQueryFn({ on401: "returnNull" }),
    },
  },
});