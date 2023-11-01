import { getFriendsByUserId } from '@/helpers/getFriendsByUserId'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorised' }, { status: 401 })
    }

    const friends = await getFriendsByUserId(session.user.id)

    return NextResponse.json({ friends })
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
