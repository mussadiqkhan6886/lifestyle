import { fetchHelper } from "@/lib/helpers/fetchHelper"

export const logout = async () => {
    await fetchHelper<undefined>("/auth/logout", {
        method: "DELETE",
    })
} 