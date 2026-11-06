import express, {type Express} from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"

const app : Express = express() 

app.use(cors())
app.use(cookieParser())
app.use(helmet())
app.use(express.json())
app.get("/health", (req, res) => {
    res.status(200).send("ok")
})

export default app