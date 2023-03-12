import express from 'express'
import expressWS from 'express-ws'
import { ChatRouter } from './chat/router'

const app = express()
const ews = expressWS(app)

app.use('/chat', ChatRouter)

app.listen(3000, () => {
    console.log('listening on port 3000')
})