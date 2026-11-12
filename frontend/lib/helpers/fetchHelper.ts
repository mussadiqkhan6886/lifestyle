'use server'
import { cookies, headers } from "next/headers"
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

export const fetchHelper = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
    const cookiesStore = await cookies()
    const token = cookiesStore.toString()
    const baseUrl = await resolveBaseUrl()

    const res = await fetch(`${baseUrl}/api/${path}`, {
        ...options,
        headers: { Cookie: token, ...(options.headers || {}) },
    })

    if(res.status === 204){
        return undefined as T
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
