export default {
  google: {
    GOOGLE_CLIENT_ID: getEnvOrThrow('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: getEnvOrThrow('GOOGLE_CLIENT_SECRET'),
  },
  pusher: {
    PUSHER_APP_ID: getEnvOrThrow('PUSHER_APP_ID'),
    NEXT_PUBLIC_PUSHER_APP_KEY: getEnvOrThrow('NEXT_PUBLIC_PUSHER_APP_KEY'),
    PUSHER_APP_SECRET: getEnvOrThrow('PUSHER_APP_SECRET'),
    PUSHER_CLUSTER: getEnvOrThrow('PUSHER_CLUSTER'),
  },
}

export function getEnvOrThrow(name: any) {
  let val = process.env[name]
  if (val === undefined || val === null) {
    throw 'Missing ' + name
  }
  return val
}
