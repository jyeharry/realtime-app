import { buildChatHref, cls } from '@/lib/utils'
import { Message } from '@/lib/validations/message'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { Toast, toast } from 'react-hot-toast'

interface MessageToastProps {
  messageToast: Toast
  sessionId: string
  message: Message
}

const MessageToast: FC<MessageToastProps> = ({
  messageToast,
  sessionId,
  message,
}) => {
  return (
    <div
      className={cls(
        'max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5',
        messageToast.visible ? 'animate-enter' : 'animate-leave',
      )}
    >
      <Link
        className="flex-1 w-0 p-4"
        onClick={() => toast.dismiss()}
        href={`/dashboard/chat/${buildChatHref(sessionId, message.sender.id)}`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0-5">
            <div className="relative h-10 w-10">
              {message.sender.image && (
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  src={message.sender.image}
                  alt={`${message.sender.name}'s profile picture}`}
                />
              )}
            </div>
          </div>

          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {message.sender.name}
            </p>
            <p className="mt-1 text-sm text-gray-500">{message.text}</p>
          </div>
        </div>
      </Link>

      <div className="flex border-l border-gray-200">
        <button
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={() => toast.dismiss(messageToast.id)}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default MessageToast
