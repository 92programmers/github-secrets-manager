
import axios from 'axios'

const getAccessToken = async (code: string, state: string) => {
  const auth = localStorage.getItem('auth')
  const oldToken: { token: string } = auth && JSON.parse(auth)
  const token = await axios.post(`${import.meta.env.VITE_API_URL}/access-token`, {
    code,
    state,
    accessToken: oldToken?.token
  })
  return token?.data?.authentication
}

const logout = async () => {
  const auth = localStorage.getItem('auth')
  const oldToken: { token: string } = auth && JSON.parse(auth)
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {
    accessToken: oldToken?.token
  })
  return response
}
export default { getAccessToken, logout }