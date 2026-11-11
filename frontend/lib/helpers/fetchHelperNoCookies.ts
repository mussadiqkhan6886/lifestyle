'use server'

export const fetchHelperNoCookies = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not configured")
  }

  const url = `${baseUrl}/api/${path}`

  const res = await fetch(url, {
    ...options,
    next: { revalidate: 60 },
    headers: {
      ...options.headers,
    },
  })

  if (res.status === 204) {
    return undefined as T
  }

  const contentType = res.headers.get("content-type")

  if (!contentType?.includes("application/json")) {
    const body = await res.text()

    throw new Error(
      `Expected JSON from ${url}. Status: ${res.status}. Content-Type: ${contentType}. Response: ${body.slice(0, 300)}`
    )
  }

  const result = await res.json()

  if (!res.ok) {
    throw new Error(
      result.message ||
      result.error?.message ||
      "Something went wrong"
    )
  }

  return result
}