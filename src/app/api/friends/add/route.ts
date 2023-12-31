import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { addFriendValidator } from '@/lib/validations/add-friend'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorised' }, { status: 401 })
    }

    const body = await req.json()

    const { email } = addFriendValidator.parse(body)

    const idToAdd = await db.get<string>(`user:email:${email}`)

    if (!idToAdd) {
      return NextResponse.json(
        { message: 'This person does not exist' },
        { status: 400 },
      )
    }

    if (idToAdd === session.user.id) {
      return NextResponse.json(
        { message: "Can't add yourself as a friend" },
        { status: 400 },
      )
    }

    const isAlreadyFriends = await db.sismember(
      `user:${session.user.id}:friends`,
      idToAdd,
    )

    if (isAlreadyFriends) {
      return NextResponse.json({ message: 'Already friends' }, { status: 400 })
    }

    const sent = await db.sadd(
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id,
    )

    if (!sent) {
      return NextResponse.json(
        { message: 'Already added this user' },
        { status: 400 },
      )
    }

    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      'incoming_friend_requests',
      session.user,
    )

    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests_change`),
      'incoming_friend_requests_change',
      1,
    )

    return NextResponse.json({ message: 'OK' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid request payload' },
        { status: 422 },
      )
    }

    console.log(error)

    return NextResponse.json({ message: 'Invalid Request' }, { status: 400 })
  }
}
