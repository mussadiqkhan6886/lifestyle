import { fetchHelperNoCookies } from "@/lib/helpers/fetchHelperNoCookies"
import { ContactPayload } from "@/types"

export const sendContact = async (data: ContactPayload) => {
  const res = await fetchHelperNoCookies(`contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  return res
}