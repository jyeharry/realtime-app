import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorised' }, { status: 401 })
    }

    const data = await db.smembers<string[]>(
      `user:${session.user.id}:incoming_friend_requests`,
    )

    return NextResponse.json({ data })
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
