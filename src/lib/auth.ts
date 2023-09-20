import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter'
import { NextAuthOptions } from 'next-auth'
import { db } from './db'
import GoogleProvider from 'next-auth/providers/google'
import { User } from '@/types/db'
import env from './env'

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: env.google.GOOGLE_CLIENT_ID,
      clientSecret: env.google.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = await db.get<User>(`user:${token.id}`)

      if (!dbUser) {
        token.id = user.id
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    redirect() {
      return '/dashboard'
    },
  },
}
