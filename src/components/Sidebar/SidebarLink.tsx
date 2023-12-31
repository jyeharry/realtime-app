import { cls } from '@/lib/utils'
import Link from 'next/link'
import { FC, ReactNode } from 'react'

interface SidebarLinkProps {
  children: ReactNode
  className?: string
  href: string
  aTag?: boolean
}

const SidebarLink: FC<SidebarLinkProps> = ({
  children,
  className,
  href,
  aTag,
}) => {
  return (
    <li>
      {aTag ? (
        <a
          href={href}
          className={cls(
            [
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
            ],
            className,
          )}
        >
          {children}
        </a>
      ) : (
        <Link
          href={href}
          className={cls(
            [
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
            ],
            className,
          )}
        >
          {children}
        </Link>
      )}
    </li>
  )
}

export default SidebarLink
