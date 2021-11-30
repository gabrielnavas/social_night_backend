import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import './env'
import routes from './routes'
import morgan from 'morgan'

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(routes)

export default app
