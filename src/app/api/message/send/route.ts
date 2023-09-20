import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Message, messageValidator } from '@/lib/validations/message'
import { User } from '@/types/db'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

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

    const isFriend = db.sismember(`user:${senderId}:friends`, friendId)
    if (!isFriend) {
      return NextResponse.json({ message: 'Unauthorised' }, { status: 401 })
    }

    // const sender = await db.get<User>(`user:${senderId}`)

    const timestamp = Date.now()

    const messageData: Message = {
      id: nanoid(),
      senderId: senderId,
      text,
      timestamp,
    }

    const message = messageValidator.parse(messageData)

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    })

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
