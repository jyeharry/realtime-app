const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN

type Command = 'zrange' | 'sismember' | 'get' | 'smembers'

export async function fetchRedis<T = any>(
  command: Command,
  ...args: (string | number)[]
): Promise<T> {
  const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join('/')}`

  const res = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Error executing Redis command: ${res.statusText}`)
  }

  const data = await res.json()
  return data.result
}
