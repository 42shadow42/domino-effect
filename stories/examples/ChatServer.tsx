import { Fragment, Suspense, useState } from 'react'
import {
	domino,
	trigger,
	useAsyncDomino,
	useDomino,
} from '@42shadow42/domino-effect'

type ChatMessage = {
	user: string
	message: string
}
type ChatRoom = {
	messages: ChatMessage[]
	users: string[]
}

const userState = trigger(() => 'Pick a Username')
const activeChatsState = trigger<string[]>(() => [], { ttl: 0 })

type ChatRoomControls = {
	send: (message: string) => void
	details: ChatRoom
}

const chatRoom = domino<Promise<ChatRoomControls>, string>(
	async ({ get, context, cache }) => {
		if (cache.has('promise') && cache.has('socket')) {
			return {
				send: (message: string) => {
					cache.get('socket')!.send(message)
				},
				details: await cache.get('promise'),
			}
		}
		const user = get(userState)
		if (!cache.has('socket')) {
			const socket = new WebSocket(
				`ws://localhost:3000/chat/${context}?user=${user}`,
			)
			let resolver: (value: ChatRoom) => void
			cache.set('socket', socket)
			cache.set(
				'promise',
				new Promise((resolve) => {
					resolver = resolve
				}),
			)

			let chat: ChatRoom

			socket.onmessage = (evt) => {
				const message = JSON.parse(evt.data)
				if (message.signal === 'init') {
					chat = message.chat
					resolver(chat)
				}
				if (message.signal === 'user_join') {
					chat = { ...chat, users: [...chat.users, message.user] }
				}
				if (message.signal === 'user_leave') {
					chat = {
						...chat,
						users: chat.users.filter(
							(user) => user !== message.user,
						),
					}
				}
				if (message.signal === 'message') {
					chat = {
						...chat,
						messages: [...chat.messages, message.message],
					}
				}

				cache.set('promise', Promise.resolve(chat))
			}
		}

		return {
			send: (message: string) => {
				cache.get('socket')!.send(
					JSON.stringify({
						user,
						message,
					}),
				)
			},
			details: await cache.get('promise'),
		}
	},
	{
		ttl: 0,
		onDelete: ({ cache }) => {
			cache.get('socket')?.close?.()
		},
	},
)

const JoinChat = () => {
	const [user, setUser] = useDomino(userState)
	const [toJoin, setToJoin] = useState('Pick a chatroom to join!')
	const [, setActiveChats] = useDomino(activeChatsState)

	return (
		<Fragment>
			<input
				type="text"
				value={user}
				onChange={(evt) => setUser(evt.target.value)}
			/>
			<input
				type="text"
				value={toJoin}
				onChange={(evt) => setToJoin(evt.target.value)}
			/>
			<button
				onClick={() =>
					setActiveChats((chats: string[]) => [...chats, toJoin])
				}
			>
				Join Chat
			</button>
		</Fragment>
	)
}

type ChatWindowProps = {
	roomId: string
    onClose: () => void
}

const ChatWindow = ({ roomId, onClose }: ChatWindowProps) => {
	const { details, send } = useAsyncDomino(chatRoom, { context: roomId })
	const [toSend, setToSend] = useState('How are you today?')
	return (
		<Fragment>
			<h1>Chat Room: {roomId}</h1>
			{details.messages.map((message, index) => {
				return (
					<Fragment key={index}>
						<h4>{message.user}</h4>
						<span>{message.message}</span>
					</Fragment>
				)
			})}
            <br />
			<input
				type="text"
				value={toSend}
				onChange={(evt) => setToSend(evt.target.value)}
			/>
            <br />
			<button onClick={() => send(toSend)}>Send</button>
            <button onClick={() => onClose()}>Leave</button>
		</Fragment>
	)
}

const ChatList = () => {
	const [activeChats, setActiveChats] = useDomino(activeChatsState)
	return (
		<Fragment>
			{activeChats.map((chat) => {
				return (
					<Suspense key={chat} fallback="loading">
						<ChatWindow roomId={chat} onClose={() => setActiveChats((chats) => chats.filter((c) => c !== chat))} />
					</Suspense>
				)
			})}
		</Fragment>
	)
}

export const ChatServer = () => {
	return (
		<Fragment>
			<JoinChat />
			<ChatList />
		</Fragment>
	)
}
