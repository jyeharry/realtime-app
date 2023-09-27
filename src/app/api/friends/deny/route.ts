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

    await db.srem(`user:${session.user.id}:incoming_friend_requests`, newFriendId)

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
