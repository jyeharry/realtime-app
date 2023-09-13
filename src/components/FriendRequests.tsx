'use client'

import { User } from '@/types/db'
import { Check, UserPlus, X } from 'lucide-react'
import { FC, useState } from 'react'
import Button from './ui/Button'
import { useRouter } from 'next/navigation'

interface FriendRequestsProps {
  incomingFriendRequests: User[]
  sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const router = useRouter()
  const [friendRequests, setFriendRequests] = useState<User[]>(
    incomingFriendRequests,
  )

  const acceptFriend = async (senderId: string) => {
    await fetch('/api/friends/accept', {
      method: 'POST',
      body: JSON.stringify({ id: senderId }),
    })
    setFriendRequests((prev) => prev.filter((user) => user.id !== senderId))
    router.refresh()
  }

  const denyFriend = async (senderId: string) => {
    await fetch('/api/friends/deny', {
      method: 'POST',
      body: JSON.stringify({ id: senderId }),
    })
    setFriendRequests((prev) => prev.filter((user) => user.id !== senderId))
    router.refresh()
  }

  return (
    friendRequests.length ? (
      <ul>
        {friendRequests.map((req, i) => (
          <li key={i} className="flex gap-4 items-center">
            <UserPlus className="text-black" />
            <p className="font-medium text-lg">{req.email}</p>
            <Button
              aria-label="accept request"
              variant="primary"
              rounding="full"
              size="icon"
              onClick={() => acceptFriend(req.id)}
            >
              <Check className="w-3/4 h-3/4" />
            </Button>

            <Button
              aria-label="deny request"
              variant="error"
              rounding="full"
              size="icon"
              onClick={() => denyFriend(req.id)}
            >
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </Button>
          </li>
        ))}
      </ul>
    ) : (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      )
  )
}

export default FriendRequests
