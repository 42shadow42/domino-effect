import express from 'express'
import expressWS from 'express-ws'
import { ChatMessage, ChatRoom, CHAT_ROOMS } from './chat-room'

const router = express()
const ews = expressWS(router)

const broadcastMessage = (chatRoom: ChatRoom, message: ChatMessage) => {
    chatRoom.sockets.forEach((ws) => {
        ws.send(JSON.stringify({
            signal: 'message',
            message,
        }))
    })
}
const broadcastJoinEvent = (chatRoom: ChatRoom, user: string) => {
    chatRoom.sockets.forEach((ws) => {
        ws.send(JSON.stringify({
            signal: 'user_join',
            user,
        }))
    })
}
const broadcastLeaveEvent = (chatRoom: ChatRoom, user: string) => {
    chatRoom.sockets.forEach((ws) => {
        ws.send(JSON.stringify({
            signal: 'user_leave',
            user,
        }))
    })
}

ews.app.ws('/:id', (ws, req) => {
    const id = req.params.id
    const user = req.query.user as string

    ws.on('message', (message) => {
        const chatRoom = CHAT_ROOMS.get(id)!
        const chatMessage: ChatMessage = { user, message: message.toString() }
        chatRoom.messages.push(chatMessage)
        broadcastMessage(chatRoom, chatMessage)
    })

    ws.on('close', () => {
        const chatRoom = CHAT_ROOMS.get(id)!
        chatRoom.sockets = chatRoom.sockets.filter((lobbySocket) => lobbySocket !== ws)
        if (chatRoom.sockets.length === 0) {
            CHAT_ROOMS.delete(id)
            return
        }
        chatRoom.users = chatRoom.users.filter((lobbyUser) => lobbyUser !== user)
        const message: ChatMessage = { user, message: "Cya Later!"}
        chatRoom.messages.push(message)
        broadcastMessage(chatRoom, message)
        broadcastLeaveEvent(chatRoom, user)
    })

    if (!CHAT_ROOMS.has(id)) {
        CHAT_ROOMS.set(id, {
            messages: [],
            users: [],
            sockets: [],
        })
    }
    const chatRoom = CHAT_ROOMS.get(id)!
    const message: ChatMessage = { user, message: "Hello everyone!" }
    chatRoom.messages.push(message)
    chatRoom.users.push(user)
    broadcastJoinEvent(chatRoom, user)
    broadcastMessage(chatRoom, message)
    chatRoom.sockets.push(ws)
    ws.send(JSON.stringify({
        signal: 'init',
        chat: { ...chatRoom, sockets: undefined },
    }))
})

export const ChatRouter = router