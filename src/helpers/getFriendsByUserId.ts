import { User } from '@/types/db'
import { db } from '@/lib/db'

export const getFriendsByUserId = async (userId: string): Promise<User[]> => {
  const friendIds = await db.smembers(`user:${userId}:friends`)

  const friends = (
    await Promise.all(
      friendIds.map((friendId) => db.get<User>(`user:${friendId}`)),
    )
  ).filter((friend): friend is User => !!friend)

  return friends
}
