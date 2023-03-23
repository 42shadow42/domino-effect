import { WebSocket } from 'ws'
export type ChatMessage = {
	user: string
	message: string
}
export type ChatRoom = {
	messages: ChatMessage[]
	users: string[]
	sockets: WebSocket[]
}

export const CHAT_ROOMS = new Map<string, ChatRoom>()
