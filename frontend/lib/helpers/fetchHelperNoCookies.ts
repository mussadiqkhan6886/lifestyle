'use server'
import { headers } from "next/headers"
import { getBaseUrl } from "./getBaseUrl"

async function resolveBaseUrl(): Promise<string> {
  const base = getBaseUrl()
  if (base && !base.includes("localhost") && !base.includes("127.0.0.1")) {
    return base
  }

  try {
    const headersList = await headers()
    const host = headersList.get("x-forwarded-host") || headersList.get("host")
    if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
      const proto = headersList.get("x-forwarded-proto") || "https"
      return `${proto}://${host}`
    }
  } catch {
    // Outside of request scope
  }

  return base || "http://localhost:4000"
}

export const fetchHelperNoCookies = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const baseUrl = await resolveBaseUrl()
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
