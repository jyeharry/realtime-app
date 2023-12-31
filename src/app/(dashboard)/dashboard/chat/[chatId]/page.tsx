import MessageInput from '@/components/MessageInput'
import Messages from '@/components/Messages'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { messageArrayValidator } from '@/lib/validations/message'
import { User } from '@/types/db'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface PageProps {
  params: {
    chatId: string
  }
}

const getChatMessages = async (chatId: string) => {
  try {
    const messages: string[] = await db.zrange(
      `chat:${chatId}:messages`,
      0,
      -1,
      { rev: true },
    )
    return messageArrayValidator.parse(messages)
  } catch (error) {
    notFound()
  }
}

export const revalidate = 0

const Page: FC<PageProps> = async ({ params: { chatId } }) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()
  const { user } = session

  const [userId1, userId2] = chatId.split('--')

  if (![userId1, userId2].includes(user.id)) notFound()

  const chatPartnerId = user.id === userId1 ? userId2 : userId1
  const chatPartner = await db.get<User>(`user:${chatPartnerId}`)
  if (!chatPartner) notFound()

  const initialMessages = await getChatMessages(chatId)

  return (
    <main className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh - 6rem)]">
      <div className="flex sm:items-center justify-between py-2 sm:py-4 border-b border-gray-200">
        <div className="relative flex items-center gap-4 container">
          <div className="relative w-8 sm:w-12 h-8 sm:h-12">
            <Image
              fill
              referrerPolicy="no-referrer"
              src={chatPartner?.image || ''}
              sizes="(max-width: 768px) 20vw, 2rem"
              alt={`${chatPartner?.name}'s profile picture`}
              className="rounded-full"
            />
          </div>

          <div className="flex flex-col leading-tight">
            <p className="text-xl text-gray-700 mr-3 font-semibold">
              {chatPartner?.name}
            </p>
            <p className="text-sm text-gray-600">{chatPartner?.email}</p>
          </div>
        </div>
      </div>

      <Messages
        chatPartner={chatPartner}
        initialMessages={initialMessages}
        session={session}
        chatId={chatId}
      />
      <MessageInput chatId={chatId} chatPartner={chatPartner} />
    </main>
  )
}

export default Page
