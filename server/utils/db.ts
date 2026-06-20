import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from '../database/schema'

function getDb() {
  const config = useRuntimeConfig()
  const client = createClient({ url: config.databaseUrl })
  return drizzle(client, { schema })
}

export { getDb }