import { z } from 'zod'

export const messageValidator = z.object({
  id: z.string(),
  sender: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    image: z.string().optional(),
  }),
  receiverId: z.string(),
  text: z.string(),
  timestamp: z.number(),
})

export const messageArrayValidator = z.array(messageValidator)

export type Message = z.infer<typeof messageValidator>
