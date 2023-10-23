import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { id: newFriendId } = z.object({ id: z.string() }).parse(body)

    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorised' }, { status: 401 })
    }

    const [hasFriendRequest, isAlreadyFriends] = await Promise.all([
      db.sismember(
        `user:${session.user.id}:incoming_friend_requests`,
        newFriendId,
      ),
      db.sismember(`user:${session.user.id}:friends`, newFriendId),
    ])

    if (!hasFriendRequest) {
      return NextResponse.json(
        { message: 'No friend request from this user exists' },
        { status: 400 },
      )
    }

    if (isAlreadyFriends) {
      return NextResponse.json({ message: 'Already friends' }, { status: 400 })
    }

    await Promise.all([
      db.sadd(`user:${session.user.id}:friends`, newFriendId),
      db.sadd(`user:${newFriendId}:friends`, session.user.id),
      db.srem(`user:${session.user.id}:incoming_friend_requests`, newFriendId),
    ])

    pusherServer.trigger(
      toPusherKey(`user:${session.user.id}:incoming_friend_requests_change`),
      'incoming_friend_requests_change',
      -1,
    )

    pusherServer.trigger(
      toPusherKey(`user:${newFriendId}:friends`),
      'new_friend',
      null,
    )

    return NextResponse.json({ message: 'OK' })
  } catch (error) {
    console.log(error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid request payload' },
        { status: 400 },
      )
    }

    return NextResponse.json({ message: 'Invalid Request' }, { status: 400 })
  }
}
