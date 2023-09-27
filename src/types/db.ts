import { Message } from "@/lib/validations/message"

export interface User {
  name: string
  email: string
  image?: string
  id: string
}

export interface Chat {
  id: string
  message: Message[]
}

export interface FriendRequest {
  id: string
  senderId: string
  receiverId: string
}
