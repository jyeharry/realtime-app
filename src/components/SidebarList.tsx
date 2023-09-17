import { cls } from '@/lib/utils'
import { FC, ReactNode } from 'react'
import Subtitle from './Subtitle'

interface SidebarListProps {
  children: ReactNode
  className?: string
  title?: string
}

const SidebarList: FC<SidebarListProps> = ({ children, className, title }) => {
  return (
    <div>
      {title && <Subtitle>{title}</Subtitle>}
      <ul
        role="list"
        className={cls(['flex flex-1 flex-col gap-1 mt-2 -mx-2', className])}
      >
        {children}
      </ul>
    </div>
  )
}

export default SidebarList
