'use client'

import { buildChatHref, cls, toPusherKey } from '@/lib/utils'
import { User } from '@/types/db'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import SidebarList from './SidebarList'
import SidebarLink from './SidebarLink'
import Image from 'next/image'
import { Session } from 'next-auth'
import { pusherClient } from '@/lib/pusher'
import { toast } from 'react-hot-toast'
import MessageToast from './MessageToast'
import { Message } from '@/lib/validations/message'

interface SidebarChatListProps {
  friends: User[]
  session: Session
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, session }) => {
  const router = useRouter()
  const path = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([])

  useEffect(() => {
    const chatChannel = toPusherKey(`user:${session.user.id}:chats`)
    const friendChannel = toPusherKey(`user:${session.user.id}:friends`)

    pusherClient.subscribe(chatChannel)
    pusherClient.subscribe(friendChannel)

    const chatHandler = (message: Message) => {
      const shouldNotify =
        path !==
        `/dashboard/chat/${buildChatHref(session.user.id, message.sender.id)}`

      if (!shouldNotify) return

      toast.custom((toast) => (
        <MessageToast
          messageToast={toast}
          sessionId={session.user.id}
          message={message}
        />
      ))

      setUnseenMessages(prev => [...prev, message])
    }

    const newFriendHandler = () => {
      router.refresh()
    }

    const chatEvent = 'new_message'
    const friendEvent = 'new_friend'

    pusherClient.bind(chatEvent, chatHandler)
    pusherClient.bind(friendEvent, newFriendHandler)

    return () => {
      pusherClient.unsubscribe(chatChannel)
      pusherClient.unsubscribe(friendChannel)

      pusherClient.unbind(chatEvent, chatHandler)
      pusherClient.unbind(friendEvent, newFriendHandler)
    }
  }, [path, session.user.id])

  useEffect(() => {
    if (path?.includes('chat')) {
      setUnseenMessages((unseen) =>
        unseen.filter((msg) => !path.includes(msg.sender.id)),
      )
    }
  }, [path])

  return (
    <SidebarList className="max-h-[25rem] overflow-y-auto" title="Your Chats">
      {friends.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter(
          (msg) => msg.sender.id === friend.id,
        ).length

        return (
          <SidebarLink
            aTag
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
                  sizes="(max-width: 768px) 20vw, 1.25rem"
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
