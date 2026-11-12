import { allowedOrigins } from "./allowedOrigins";
export const corsOptions = {
    origin: (origin, callback) => {
        if (!origin ||
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app") ||
            origin.includes("localhost") ||
            origin.includes("127.0.0.1")) {
            callback(null, true);
        }
        else {
            callback(null, true);
        }
    },
    credentials: true,
};
