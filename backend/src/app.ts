import express, {type Express} from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { corsOptions } from "./config/corsOption"

const app : Express = express() 

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(helmet())
app.use(express.json())
app.get("/health", (req, res) => {
    res.status(200).send("ok")
})

export default app