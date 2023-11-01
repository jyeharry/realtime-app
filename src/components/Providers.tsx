'use client'

import { FC, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

export const queryClient = new QueryClient()

interface ProvidersProps {
  children: ReactNode
  session: Session | null
}

const Providers: FC<ProvidersProps> = ({ children, session }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Toaster position="top-center" />
        {children}
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default Providers
