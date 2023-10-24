import { getFriendsByUserId } from '@/helpers/getFriendsByUserId'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { buildChatHref } from '@/lib/utils'
import { Message } from '@/lib/validations/message'
import { ChevronRight } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const friends = await getFriendsByUserId(session.user.id)

  const friendsWithLastMessage = await Promise.all(
    friends.map((friend) =>
      db
        .zrange<Message[]>(
          `chat:${buildChatHref(
            '1e7c72c8-9bf6-4364-a9d7-aedfc71c2be3',
            '7a8d4c1e-99b4-41a4-a2a9-3f906a725b39',
          )}:messages`,
          -1,
          -1,
        )
        .then(([lastMessage]) => ({ ...friend, lastMessage })),
    ),
  )

  return (
    <div className="container py-12">
      <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
      {friendsWithLastMessage.length ? (
        friendsWithLastMessage.map((friend) => (
          <Link
            href={`/dashboard/chat/${buildChatHref(
              session.user.id,
              friend.id,
            )}`}
            className="relative block bg-zinc-50 border border-zinc-200 p-3 rounded-md"
          >
            <div className="absolute right-4 inset-y-0 flex items-center">
              <ChevronRight className="h-7 w-7 text-zinc-400" />
            </div>

            <div className="relative sm:flex items-center sm:gap-4">
              <div className="mb-4 flex-shrink-0 sm:mb-0 basis-12">
                <div className="relative h-12 w-12">
                  {friend.image && (
                    <Image
                      referrerPolicy="no-referrer"
                      className="rounded-full"
                      alt={`${friend.name}'s profile picture`}
                      src={friend.image}
                      sizes="50vw"
                      fill
                    />
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold">{friend.name}</h4>
                <p className="mt-1 max-w-md">
                  {friend.lastMessage.sender.id === session.user.id && (
                    <span className="text-zinc-400">You: </span>
                  )}
                  {friend.lastMessage.text}
                </p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      )}
    </div>
  )
}

export default Page
