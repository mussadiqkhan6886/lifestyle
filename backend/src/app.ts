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
import routerReview from "./routes/reviewRoute";
import orderRoutes from "./routes/orderRoute"

const app : Express = express() 

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(helmet())
app.use(express.json({limit: '1mb'}))
app.use(
  express.urlencoded({
    extended: true,
    limit: "100kb",
    parameterLimit: 100,
  })
)
app.get(["/health", "/api/health"], (req, res) => {
    res.status(200).send("ok")
})
app.use(["/api/auth", "/auth"], routerAuth)
app.use(["/api/products", "/products"], routerProducts)
app.use(["/api/ai", "/ai"], routerAI)
app.use(["/api/review", "/review"], routerReview)

app.use(["/api/orders", "/orders"], orderRoutes)
app.use(ErrorHandler)

export default app