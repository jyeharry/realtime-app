// redis keys in db
// `user:${id}:incoming_friend_requests`,
// `user:${id}`,
// `chat:${id}:messages`,
// `user:${id}:friends`,
// `user:email:${email}`,
export class RedisKeyBuilder {
  private segments: string[] = []

  build(delimiter?: '__' | ':') {
    const key = this.segments.join(delimiter || ':')
    this.segments = []

    return key
  }

  buildPusher() {
    return this.build('__')
  }

  chat() {
    this.segments.push('chat')
    return this
  }

  email(email?: string) {
    this.segments.push('email')
    email && this.segments.push(email)
    return this
  }

  friends() {
    this.segments.push('friends')
    return this
  }

  id(id: string) {
    this.segments.push(id)
    return this
  }

  incomingFriendRequests() {
    this.segments.push('incoming_friend_requests')
    return this
  }

  messages() {
    this.segments.push('messages')
    return this
  }

  user() {
    this.segments.push('user')
    return this
  }
}

export const redisKey = new RedisKeyBuilder()
