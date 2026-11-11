import { allowedOrigins } from "./allowedOrigins";
export const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
    },
    credentials: true
};
