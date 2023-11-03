'use client'

import { cls, toPusherKey } from '@/lib/utils'
import { Message } from '@/lib/validations/message'
import { FC, useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import Image from 'next/image'
import { User } from '@/types/db'
import { Session } from 'next-auth'
import { pusherClient } from '@/lib/pusher'

interface MessagesProps {
  initialMessages: Message[]
  session: Session
  chatPartner: User
  chatId: string
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  session,
  chatPartner,
  chatId,
}) => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const formatTimestamp = (timestamp: number) => format(timestamp, 'HH:mm')
  
  useEffect(() => {
    const channel = toPusherKey(`chat:${chatId}`)
    const event = 'incoming-message'

    const messageHandler = (newMessage: Message) => {
      setMessages((prev) => [newMessage, ...prev])
    }

    pusherClient.subscribe(channel)
    pusherClient.bind(event, messageHandler)

    return () => {
      pusherClient.unsubscribe(channel)
      pusherClient.unbind(event, messageHandler)
    }
  }, [chatId])

  return (
    <div
      id="messages"
      className={cls(
        'flex',
        'h-full',
        'flex-1',
        'flex-col-reverse',
        'gap-4',
        'p-4',
        'overflow-y-auto',
        'scrollbar-thumb-blue',
        'scrollbar-thumb-rounded',
        'scrollbar-track-blue-lighter',
        'scrollbar-w-2',
        'scrolling-touch',
      )}
    >
      <div ref={scrollDownRef} />
      {messages.map((msg, i) => {
        const isCurrentUser = msg.sender.id === session.user.id
        const hasFollowingMessage = messages[i - 1]?.sender.id === msg.sender.id

        return (
          <div key={i} className="chat-message">
            <div
              className={cls('flex items-end', {
                'justify-end': isCurrentUser,
              })}
            >
              <div
                className={cls(
                  'flex flex-col space-y-2 text-base max-w-xs mx-2',
                  isCurrentUser ? 'order-1 items-end' : 'order-2 items-start',
                )}
              >
                <p
                  className={cls('px-4 py-2 rounded-lg inline-block', {
                    'bg-indigo-600 text-white': isCurrentUser,
                    'bg-gray-200 text-gray-900': !isCurrentUser,
                    'rounded-br-none': !hasFollowingMessage && isCurrentUser,
                    'rounded-bl-none': !hasFollowingMessage && !isCurrentUser,
                  })}
                >
                  {msg.text}{' '}
                  <span className="ml-2 text-xs text-gray-400">
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </p>
              </div>

              <div
                className={cls('relative w-6 h-6', {
                  'order-2': isCurrentUser,
                  'order-1': !isCurrentUser,
                  invisible: hasFollowingMessage,
                })}
              >
                {((isCurrentUser && session.user.image) ||
                  (!isCurrentUser && chatPartner.image)) && (
                  <Image
                    fill
                    src={
                      isCurrentUser ? session.user.image! : chatPartner.image!
                    }
                    sizes='(max-width: 768px) 20vw, 1.5rem'
                    alt={`${
                      isCurrentUser ? 'Your' : chatPartner.name + "'s"
                    } profile picture`}
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                  />
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Messages
