'use server'
export const fetchHelperNoCookies = async <T>(path: string, options: RequestInit = {}): Promise<T> => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${path}`, {
        ...options,
        next: { revalidate: 60},
        headers: { ...(options.headers || {}) },
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