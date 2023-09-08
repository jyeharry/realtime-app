import FriendRequestCount from '@/components/FriendRequestCount'
import Logo from '@/components/Logo'
import SignOut from '@/components/SignOut'
import Subtitle from '@/components/Subtitle'
import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
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
    Count: FriendRequestCount
  },
]

const DashboardLayout: FC<DashboardLayoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const unseenRequestCount = (
    await fetchRedis<string[]>(
      'smembers',
      `user:${session.user.id}:incoming_friend_requests`,
    )
  ).length

  return (
    <div className="w-full flex h-screen">
      <div
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

        <Subtitle>Your chats</Subtitle>

        <nav className="flex flex-1 flex-col">
          <Subtitle>Overview</Subtitle>

          <ul role="list" className="flex flex-1 flex-col gap-2 mt-2">
            {sidebarOptions.map(({href, text, Icon, Count}, i) => {
              return (
                <li key={i} className="-mx-2 space-y-1">
                  <Link
                    href={href}
                    className={cls([
                      'text-gray-700',
                      'hover:text-indigo-600',
                      'hover:bg-gray-50',
                      'group',
                      'flex',
                      'gap-3',
                      'rounded-md',
                      'p-2',
                      'text-sm',
                      'leading-6',
                      'font-semibold',
                      'items-center',
                    ])}
                  >
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
                    <span className="truncate">{text}</span>
                    {Count && (
                      <Count
                        sessionId={session.user.id}
                        initialUnseenRequestCount={unseenRequestCount}
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

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
            <div className="relative h-8 w-8 bg-gray-50">
              <Image
                fill
                referrerPolicy="no-referrer"
                className="rounded-full"
                src={session.user.image || ''}
                alt="Your profile picture"
              />
            </div>

            <span className="sr-only">Your profile</span>
            <div className="flex flex-col">
              <span aria-hidden="true">{session.user.name}</span>
              <span className="text-xs text-zinc-400" aria-hidden="true">
                {session.user.email}
              </span>
            </div>
          </div>

          <SignOut className="aspect-square px-3 m-auto" />
        </div>
      </div>
      {children}
    </div>
  )
}

export default DashboardLayout
