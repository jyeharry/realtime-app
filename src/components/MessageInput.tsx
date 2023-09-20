'use client'

import { cls } from '@/lib/utils'
import { User } from '@/types/db'
import { FC, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import Button from './ui/Button'
import { toast } from 'react-hot-toast'

interface MessageInputProps {
  chatPartner: User
  chatId: string
}

const MessageInput: FC<MessageInputProps> = ({ chatPartner, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [input, setInput] = useState('')
  const sendMessage = async () => {
    setIsLoading(true)

    try {
      await fetch('/api/message/send', {
        method: 'POST',
        body: JSON.stringify({ text: input, chatId }),
      })

      setInput('')
      textareaRef.current?.focus()
    } catch (error) {
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border-t border-gray-200 px-4 py-4 mb-2 sm:mb-0">
      <div
        className={cls([
          'relative',
          'flex-1',
          'overflow-hidden',
          'rounded-lg',
          'shadow-sm',
          'ring-1',
          'ring-inset',
          'ring-gray-300',
          'focus-within:ring-2',
          'focus-within:ring-indigo-600',
        ])}
      >
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Send a message to ${chatPartner.name}...`}
          className={cls(
            'block',
            'w-full',
            'resize-none',
            'border-0',
            'bg-transparent',
            'text-gray-900',
            'placeholder:text-gray-400',
            'focus:ring-0',
            'sm:py-1.5',
            'sm:text-sm',
            'sm:leading-6',
          )}
        />

        <div
          onClick={() => textareaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>

        <div className="absolute right-0 bottom-0 flex justify-center py-2 pl-3 pr-2">
          <div className="flex-shrink-0">
            <Button loading={isLoading} onClick={sendMessage} type="submit">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageInput
