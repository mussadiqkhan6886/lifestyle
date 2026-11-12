import { getBaseUrl } from "@/lib/helpers/getBaseUrl"

export const login = async (email: string, password:string) => {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            email,
            password
        }),
        headers: {"Content-Type": "application/json"}
    })

    const result = await res.json();

    if(!res.ok){
        throw new Error(result.message)
    }
    return result
}

export const logout = async () => {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/auth/logout`, {method: "POST", credentials: "include"})
    return res.json()
}
