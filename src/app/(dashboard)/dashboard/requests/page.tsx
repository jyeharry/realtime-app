import { User } from '@/types/db'
import FriendRequests from '@/components/FriendRequests'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'

const Page: FC = async () => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const incomingFriendRequestUserIds = await fetchRedis<string[]>(
    'smembers',
    `user:${session.user.id}:incoming_friend_requests`,
  )

  const incomingFriendRequests = await Promise.all(
    incomingFriendRequestUserIds.map((id) =>
      fetchRedis<string>('get', `user:${id}`).then((res) => JSON.parse(res)),
    ),
  )

  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  )
}

export default Page
