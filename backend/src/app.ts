import "dotenv/config";
import express, {type Express} from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { corsOptions } from "./config/corsOption"
import { ErrorHandler } from "./middleware/ErrorHandler"
import routerAuth from "./routes/authRoutes"
import routerProducts from "./routes/productRoute"
import routerAI from "./routes/aiRoute";

const app : Express = express() 

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(helmet())
app.use(express.json())
app.get("/health", (req, res) => {
    res.status(200).send("ok")
})
app.use("/api/auth", routerAuth)
app.use("/api/products", routerProducts)
app.use("/api/ai", routerAI)

app.use(ErrorHandler)

export default app