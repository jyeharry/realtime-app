import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Message, messageValidator } from '@/lib/validations/message'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { User } from '@/types/db'

export const POST = async (req: Request) => {
  try {
    const { text, chatId } = await req.json()

    const session = await getServerSession(authOptions)
    if (!session)
      return NextResponse.json({ message: 'Unauthenticated' }, { status: 401 })

    const {
      user: { id: senderId },
    } = session

    const [userId1, userId2] = chatId.split('--')

    if (![userId1, userId2].includes(senderId)) {
      return NextResponse.json({ message: 'Unauthorised' }, { status: 401 })
    }

    const friendId = senderId === userId1 ? userId2 : userId1

    const [isFriend, sender] = await Promise.all([
      db.sismember(`user:${senderId}:friends`, friendId),
      db.get<User>(`user:${senderId}`),
    ])

    if (!isFriend || !sender) {
      return NextResponse.json({ message: 'Unauthorised' }, { status: 401 })
    }

    const timestamp = Date.now()

    const messageData: Message = {
      id: nanoid(),
      sender,
      receiverId: friendId,
      text,
      timestamp,
    }

    const message = messageValidator.parse(messageData)

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    })

    const channel = toPusherKey(`chat:${chatId}`)
    const event = 'incoming-message'
    pusherServer.trigger(channel, event, message)

    pusherServer.trigger(
      toPusherKey(`user:${friendId}:chats`),
      'new_message',
      message,
    )

    return NextResponse.json({ message: 'OK' })
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 },
    )
  }
}
