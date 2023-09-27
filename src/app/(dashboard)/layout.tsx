import FriendRequestCount from '@/components/FriendRequestCount'
import Logo from '@/components/Logo'
import SidebarChatList from '@/components/SidebarChatList'
import SidebarLink from '@/components/SidebarLink'
import SidebarList from '@/components/SidebarList'
import SignOut from '@/components/SignOut'
import { getFriendsByUserId } from '@/helpers/getFriendsByUserId'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { cls } from '@/lib/utils'
import { LucideIcon, User, UserPlus } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC, ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

interface SidebarOption {
  text: string
  href: string
  Icon: LucideIcon
  Count?: typeof FriendRequestCount
}

const sidebarOptions: SidebarOption[] = [
  {
    text: 'Add friend',
    href: '/dashboard/add',
    Icon: UserPlus,
  },
  {
    text: 'Friend requests',
    href: '/dashboard/requests',
    Icon: User,
    Count: FriendRequestCount,
  },
]

const DashboardLayout: FC<DashboardLayoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const friends = await getFriendsByUserId(session.user.id)

  const unseenRequestCount = (
    await db.smembers<string[]>(
      `user:${session.user.id}:incoming_friend_requests`,
    )
  ).length

  return (
    <div className="w-full flex h-screen">
      <nav
        className={cls([
          'flex',
          'h-full',
          'w-full',
          'max-w-xs',
          'grow',
          'flex-col',
          'gap-y-5',
          'overflow-y-auto',
          'border-r',
          'border-gray-200',
          'bg-white',
          'px-6',
        ])}
      >
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          <Logo className="h-8 w-auto text-indigo-600" />
        </Link>

        {!!friends.length && (
          <SidebarChatList friends={friends} session={session} />
        )}

        <div className="flex flex-1 flex-col">
          <SidebarList title="Overview">
            {sidebarOptions.map(({ href, text, Icon, Count }, i) => (
              <SidebarLink href={href} key={i}>
                <div
                  className={cls(
                    'text-gray-400',
                    'border-gray-200',
                    'group-hover:border-indigo-600',
                    'group-hover:text-indigo-600',
                    'flex',
                    'h-6',
                    'w-6',
                    'shrink-0',
                    'items-center',
                    'justify-center',
                    'rounded-lg',
                    'border',
                    'text-[0.625rem]',
                    'font-medium',
                    'bg-white',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <p className="truncate">{text}</p>
                {Count && (
                  <Count
                    sessionId={session.user.id}
                    initialUnseenRequestCount={unseenRequestCount}
                  />
                )}
              </SidebarLink>
            ))}
          </SidebarList>
        </div>

        <div className="-mx-6 mt-auto flex items-center">
          <div
            className={cls(
              'flex',
              'items-center',
              'gap-x-4',
              'px-6',
              'py-3',
              'text-sm',
              'font-semibold',
              'leading-6',
              'text-gray-900',
              'justify-between',
            )}
          >
            {session.user.image && (
              <div className="relative h-8 w-8">
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  src={session.user.image}
                  sizes='(max-width: 768px) 20vw, 2rem'
                  alt="Your profile picture"
                />
              </div>
            )}

            <span className="sr-only">Your profile</span>
            <div className="flex flex-col">
              <p aria-hidden="true">{session.user.name}</p>
              <p className="text-xs text-zinc-400" aria-hidden="true">
                {session.user.email}
              </p>
            </div>
          </div>

          <SignOut className="aspect-square px-3 m-auto" />
        </div>
      </nav>
      <aside className='max-h-screen container py-16 md:py-12 w-full'>
        {children}
      </aside>
    </div>
  )
}

export default DashboardLayout
