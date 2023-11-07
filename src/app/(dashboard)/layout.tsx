import MobileSidebarContainer from '@/components/Sidebar/MobileSidebarContainer'
import Sidebar from '@/components/Sidebar/Sidebar'
import { getFriendsByUserId } from '@/helpers/getFriendsByUserId'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC, ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout: FC<DashboardLayoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const friends = await getFriendsByUserId(session.user.id)

  const unseenRequestCount = await db.scard(
    `user:${session.user.id}:incoming_friend_requests`,
  )

  return (
    <div className="w-full flex h-screen">
      <MobileSidebarContainer>
        <Sidebar
          friends={friends}
          unseenRequestCount={unseenRequestCount}
          session={session}
        />
      </MobileSidebarContainer>
      <Sidebar
        className="hidden md:flex"
        friends={friends}
        unseenRequestCount={unseenRequestCount}
        session={session}
      />
      <aside className="max-h-screen py-16 md:py-0 md:pb-12 w-full">
        {children}
      </aside>
    </div>
  )
}

export default DashboardLayout
