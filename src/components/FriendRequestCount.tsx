'use client'

import { cls } from '@/lib/utils'
import { FC, useState } from 'react'

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

  return (
    <>
      {!!unseenRequestCount && (
        <div
          className={cls(
            'rounded-full',
            'w-5',
            'h-5',
            'text-xs',
            'flex',
            'justify-center',
            'items-center',
            'text-white',
            'bg-indigo-600',
          )}
        >
          {unseenRequestCount}
        </div>
      )}
    </>
  )
}

export default FriendRequestLink
