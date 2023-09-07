import { FC, ReactNode } from 'react'

interface SubtitleProps {
  children: ReactNode
}

const Subtitle: FC<SubtitleProps> = ({ children }) => {
  return (
    <p className="text-xs font-semibold leading-6 text-gray-400">{children}</p>
  )
}

export default Subtitle
