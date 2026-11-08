import express, {type Express} from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { corsOptions } from "./config/corsOption"
import { ErrorHandler } from "./middleware/ErrorHandler"
import routerAuth from "./routes/authRoutes"

const app : Express = express() 

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(helmet())
app.use(express.json())
app.get("/health", (req, res) => {
    res.status(200).send("ok")
})
app.use("/api/auth/", routerAuth)

app.use(ErrorHandler)

export default app