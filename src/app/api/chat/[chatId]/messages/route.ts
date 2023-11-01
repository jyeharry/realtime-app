import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (
  req: NextRequest,
  { params: { chatId } }: { params: { chatId: string } },
) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: 'Unauthorised' }, { status: 401 })
    }

    const start = Number(req.nextUrl.searchParams.get('start'))
    const end = Number(req.nextUrl.searchParams.get('end'))

    const [messages, chatExists] = await Promise.all([
      db.zrange(`chat:${chatId}:messages`, start || 0, typeof end === 'number' ? end : -1),
      db.exists(`chat:${chatId}:messages`),
    ])

    if (!chatExists) {
      return NextResponse.json(
        { message: 'Chat room does exist' },
        { status: 404 },
      )
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Invalid Request' }, { status: 400 })
  }
}
