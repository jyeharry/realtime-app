import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { messageArrayValidator } from '@/lib/validations/message'
import { Message, User } from '@/types/db'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface PageProps {
  params: {
    chatId: string
  }
}

const getChatMessages = async (chatId: string) => {
  try {
    const results: string[] = await db.zrange(`chat:${chatId}:messages`, 0, -1)

    const dbMessages = results.map<Message>((msg: string) => JSON.parse(msg))

    const reversedMessages = dbMessages.reverse()

    const messages = messageArrayValidator.parse(reversedMessages)
    return messages
  } catch (error) {
    notFound()
  }
}

const Page: FC<PageProps> = async ({ params: { chatId } }) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const {user} = session

  const [userId1, userId2] = chatId.split('--')

  if (![userId1, userId2].includes(user.id)) notFound()

  const chatPartnerId = user.id === userId1 ? userId2 : userId1
  const chatPartner = await db.get<User>(`user:${chatPartnerId}`)
  const initialMessage = await getChatMessages(chatId)

  return <div>{chatId}</div>
}

export default Page
