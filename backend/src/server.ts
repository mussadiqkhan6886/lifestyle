import "dotenv/config";
import app from "./app";
import { db } from './prisma/db.js';

const PORT : Number = Number(process.env.PORT) || 4000

const startServer = async () => {
    try {
        await db.connect();

        console.log('Neon PostgreSQL connected successfully');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

startServer();