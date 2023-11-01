'use client'

import { buildChatHref } from '@/lib/utils'
import { User } from '@/types/db'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  const { data: session } = useSession()
  if (!session) notFound()
  const { data: friendsWithLastMessage } = useSuspenseQuery({
    queryKey: ['dashboard', 'friendsWithLastMessage'],
    queryFn: async () => {
      const friendsData = await (await fetch('/api/user/friends')).json()

      return await Promise.all(
        friendsData.friends.map(async (friend: User) => {
          const messagesData = await (
            await fetch(
              `/api/chat/${buildChatHref(
                session.user.id,
                friend.id,
              )}/messages?start=-1&end=-1`,
            )
          ).json()

          return { ...friend, lastMessage: messagesData.messages[0] }
        }),
      )
    },
  })

  return (
    <div className="container py-12">
      <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
      {friendsWithLastMessage?.length ? (
        friendsWithLastMessage.map((friend, i) => (
          <a
            href={`/dashboard/chat/${buildChatHref(
              session.user.id,
              friend.id,
            )}`}
            className="relative block bg-zinc-50 border border-zinc-200 p-3 rounded-md"
            key={i}
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
          </a>
        ))
      ) : (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      )}
    </div>
  )
}

export default Page
