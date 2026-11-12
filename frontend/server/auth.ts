export const login = async (email: string, password:string) => {
    const res = await fetch(`/api/auth/login`, {
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
    const res = await fetch(`/api/auth/logout`, {method: "POST", credentials: "include"})
    return res.json()
}
