export const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
};

export async function adminFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    credentials: "include", // Send session cookie
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return res;
}
