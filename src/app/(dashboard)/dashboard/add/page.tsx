import AddFriend from '@/components/AddFriend'
import { FC } from 'react'

const Page: FC = () => {
  return (
    <main className="container py-12">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <AddFriend />
    </main>
  )
}

export default Page
