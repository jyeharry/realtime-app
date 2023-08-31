'use client'

import { FC, useState } from 'react'
import { cn } from '@/lib/utils'
import Button from './ui/Button'
import { addFriendValidator } from '@/lib/validations/add-friend'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

type FormData = z.infer<typeof addFriendValidator>

const AddFriend: FC = () => {
  const [showSuccessState, setShowSuccessState] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  })

  const addFriend = async (email: string) => {
    try {
      const { email: validatedEmail } = addFriendValidator.parse({ email })
      const res = await fetch('/api/friends/add', {
        method: 'POST',
        body: JSON.stringify({ email: validatedEmail }),
      })

      if (!res.ok) {
        const { message } = await res.json()
        return setError('email', { message })
      }

      setShowSuccessState(true)
    } catch (error) {
      console.log(error)
      setError('email', { message: 'Something went wrong' })
    }
  }

  return (
    <form
      className="max-w-sm"
      onSubmit={handleSubmit(({ email }: FormData) => addFriend(email))}
    >
      <label
        className={cn([
          'block',
          'text-sm',
          'font-medium',
          'leading-6',
          'text-gray-900',
        ])}
        htmlFor="email"
      >
        Add friend by email
      </label>
      <div className={cn(['mt-2', 'flex', 'gap-4'])}>
        <input
          {...register('email')}
          className={cn([
            'block',
            'w-full',
            'rounded-md',
            'border-0',
            'text-gray-900',
            'shadow-sm',
            'ring-1',
            'ring-inset',
            'ring-gray-300',
            'placeholder:text-gray-400',
            'focus:ring-2',
            'focus:ring-inset',
            'focus:ring-indigo-600',
            'sm:text-sm',
            'sm:leading-6',
          ])}
          placeholder="you@example.com"
          type="email"
        />
        <Button>Add</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
      {showSuccessState && (
        <p className="mt-1 text-sm text-green-600">Friend request sent!</p>
      )}
    </form>
  )
}

export default AddFriend
