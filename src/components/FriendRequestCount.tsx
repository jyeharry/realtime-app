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
