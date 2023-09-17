'use client'

import { buildChatHref, cls } from '@/lib/utils'
import { Message, User } from '@/types/db'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import SidebarList from './SidebarList'
import SidebarLink from './SidebarLink'
import Image from 'next/image'
import { Session } from 'next-auth'

interface SidebarChatListProps {
  friends: User[]
  session: Session
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, session }) => {
  const router = useRouter()
  const path = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])

  useEffect(() => {
    if (path?.includes('chat')) {
      setUnseenMessages((unseen) =>
        unseen.filter((msg) => !path.includes(msg.senderId)),
      )
    }
  }, [path])

  return (
    <SidebarList className="max-h-[25rem] overflow-y-auto" title="Your Chats">
      {friends.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter(
          (msg) => msg.senderId === friend.id,
        ).length

        return (
          <SidebarLink
            href={`/dashboard/chat/${buildChatHref(
              session.user.id,
              friend.id,
            )}`}
            key={friend.id}
          >
            <div className="relative h-5 w-5">
              {session.user.image && (
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  src={session.user.image}
                  alt={`${friend.name}'s profile picture`}
                />
              )}
            </div>
            {friend.name}
            {!!unseenMessagesCount && (
              <div
                className={cls([
                  'bg-indigo-600',
                  'flex',
                  'font-medium',
                  'h-4',
                  'items-center',
                  'justify-center',
                  'rounded-full',
                  'text-white',
                  'text-xs',
                  'w-4',
                ])}
              >
                {unseenMessagesCount}
              </div>
            )}
          </SidebarLink>
        )
      })}
    </SidebarList>
  )
}

export default SidebarChatList
