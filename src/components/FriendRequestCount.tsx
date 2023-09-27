'use client'

import { pusherClient } from '@/lib/pusher'
import { cls, toPusherKey } from '@/lib/utils'
import { FC, useEffect, useState } from 'react'

interface FriendRequestLinkProps {
  sessionId: string
  initialUnseenRequestCount: number
}

const FriendRequestLink: FC<FriendRequestLinkProps> = ({
  sessionId,
  initialUnseenRequestCount,
}) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState(
    initialUnseenRequestCount,
  )
  
  useEffect(() => {
    const channel = toPusherKey(`user:${sessionId}:incoming_friend_requests`)

    const event = 'incoming_friend_requests'

    const friendRequestHandler = () => {
      setUnseenRequestCount((prev) => prev + 1)
    }

    pusherClient.subscribe(channel)
    pusherClient.bind(event, friendRequestHandler)

    return () => {
      pusherClient.unsubscribe(channel)
      pusherClient.unbind(event, friendRequestHandler)
    }
  }, [sessionId])

  return (
    <>
      {!!unseenRequestCount && (
        <div
          className={cls(
            'bg-indigo-600',
            'flex',
            'h-5',
            'items-center',
            'justify-center',
            'rounded-full',
            'text-white',
            'text-xs',
            'w-5',
          )}
        >
          {unseenRequestCount}
        </div>
      )}
    </>
  )
}

export default FriendRequestLink
