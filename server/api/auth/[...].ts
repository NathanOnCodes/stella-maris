import { authHandler } from '../../utils/auth'

export default defineEventHandler((event) => {
  return authHandler(event)
})