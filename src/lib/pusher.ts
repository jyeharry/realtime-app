import PusherServer from 'pusher'
import PusherClient from 'pusher-js'
import env from './env'

export const pusherServer = new PusherServer({
  appId: env.pusher.PUSHER_APP_ID,
  key: env.pusher.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: env.pusher.PUSHER_APP_SECRET,
  cluster: env.pusher.PUSHER_CLUSTER,
})
