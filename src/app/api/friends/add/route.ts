import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { addFriendValidator } from '@/lib/validations/add-friend'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse('Unauthorized', { status: 401 })

    const body = await req.json()

    const { email } = addFriendValidator.parse(body)

    const idToAdd = await fetchRedis('get', `user:email:${email}`)

    if (!idToAdd) {
      return new NextResponse('This person does not exist', { status: 400 })
    }

    if (idToAdd === session.user.id) {
      return new NextResponse("Can't add yourself as a friend", { status: 400 })
    }

    const [isAlreadyAdded, isAlreadyFriends] = await Promise.all([
      fetchRedis(
        'sismember',
        `user:${idToAdd}:incoming_friend_requests`,
        session.user.id,
      ),
      fetchRedis('sismember', `user:${session.user.id}:friends`, idToAdd),
    ])

    if (isAlreadyAdded) {
      return new NextResponse('Already added this user', { status: 400 })
    }

    if (isAlreadyFriends) {
      return new NextResponse('Already friends', { status: 400 })
    }

    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)

    return new NextResponse('OK')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request payload', { status: 422 })
    }

    console.log(error)

    return new NextResponse('Invalid Request', { status: 400 })
  }
}