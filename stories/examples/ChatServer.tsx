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
type ChatMessages = ChatMessage[]
type ChatRoomUsers = string[]
type ChatRoom = {
	messages: ChatMessages
	users: ChatRoomUsers
}

type ChatWebSocketSubscription = (data: any) => void
type ChatWebSocket = {
	subscribe: (signal: string, callback: ChatWebSocketSubscription) => void
	unsubscribe: (signal: string) => void
	send: (message: string) => void
	initialState: Promise<ChatRoom>
}

const userState = trigger(() => 'Pick a Username')
const activeChatsState = trigger<string[]>(() => [], { ttl: 0 })

const webSocket = domino<ChatWebSocket, string>(
	({ get, context, cache }) => {
		if (cache.has('socket')) {
			return cache.get('socket')!
		}

		const user = get(userState)
		// This implementation limits one subscription per web socket.
		// That's okay, at least, for the purposes of this illustration
		const subscribers = new Map<string, ChatWebSocketSubscription>()
		const socket = new WebSocket(
			`ws://localhost:3000/chat/${context}?user=${user}`,
		)

		let resolver: (initialState: ChatRoom) => void

		socket.onmessage = (evt) => {
			const message = JSON.parse(evt.data)
			if (message.signal === 'init') {
				resolver(message.chat)
			}
			if (subscribers.has(message.signal)) {
				subscribers.get(message.signal)!(message.data)
			}
		}

		cache.set('socket', {
			subscribe: (signal: string, callback: ChatWebSocketSubscription) =>
				subscribers.set(signal, callback),
			unsubscribe: (signal: string) => subscribers.delete(signal),
			send: (message: string) => socket.send(message),
			initialState: new Promise((resolve) => {
				resolver = resolve
			}),
		})

		return cache.get('socket')!
	},
	{
		ttl: 0,
		onDelete: ({ cache }) => {
			cache.get('socket')?.close?.()
		},
	},
)

const chatUsers = domino<ChatRoomUsers, string>(
	({ get, context, cache }) => {
		const socket = get(webSocket, context)

		if (cache.has('users')) {
			return cache.get('users')!
		}

		cache.set('users', [])
		socket.initialState.then((chatRoom) =>
			cache.set('users', chatRoom.users),
		)

		const handleUserJoin = (data: string) =>
			cache.set('users', [...cache.get('users')!, data])
		const handleUserLeave = (data: string) =>
			cache.set(
				'users',
				cache.get('users')!.filter((user: string) => user !== data),
			)
		socket.subscribe('user_join', handleUserJoin)
		socket.subscribe('user_leave', handleUserLeave)

		return cache.get('users')!
	},
	{
		ttl: 0,
	},
)

const chatMessages = domino<ChatMessages, string>(
	({ get, context, cache }) => {
		const socket = get(webSocket, context)

		if (cache.has('messages')) {
			return cache.get('messages')!
		}

		cache.set('messages', [])
		socket.initialState.then((chatRoom) =>
			cache.set('messages', chatRoom.messages),
		)

		const handleUserJoin = (data: string) =>
			cache.set('messages', [...cache.get('messages')!, data])
		socket.subscribe('message', handleUserJoin)

		return cache.get('messages')!
	},
	{
		ttl: 0,
	},
)

const socketSend = domino<(message: string) => void, string>(
	({ get, context }) => {
		return get(webSocket, context).send
	},
	{
		ttl: 0,
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
	const [messages] = useDomino(chatMessages, { context: roomId })
	const [users] = useDomino(chatUsers, { context: roomId })
	const [send] = useDomino(socketSend, { context: roomId })
	const [toSend, setToSend] = useState('How are you today?')
	return (
		<Fragment>
			<h1>Chat Room: {roomId}</h1>
			<h2>Active Users: </h2>
			<ul>
				{users.map((user) => (
					<li key={user}>{user}</li>
				))}
			</ul>
			<h2>Messages: </h2>
			{messages.map((message, index) => {
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
						<ChatWindow
							roomId={chat}
							onClose={() =>
								setActiveChats((chats) =>
									chats.filter((c) => c !== chat),
								)
							}
						/>
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
