import express from 'express';
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";

import path from "path";

import connectDB from './config/mongodb.js'; 
import authRouter from './routes/authRoutes.js' 
import userRouter from './routes/userRoutes.js';
import moodRoutes from "./routes/moodRoutes.js";
import journalRoutes from './routes/journalRoutes.js';

import providerRoutes from "./routes/providerRoutes.js";
import forumRoutes from "./routes/forumRoutes.js";
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();
const port = process.env.PORT || 3001
connectDB();

app.use(express.json());
// parse application/x-www-form-urlencoded (for HTML form POSTs)
app.use(express.urlencoded({ extended: true }));
// accept text bodies (some clients send JSON as text/plain); attempt to parse JSON
app.use(express.text({ type: 'text/*' }));
app.use((req, res, next) => {
    if (req.is && req.is('text/*') && typeof req.body === 'string') {
        try {
            req.body = JSON.parse(req.body);
        } catch (err) {
            // ignore parse error; leave body as string
        }
    }
    next();
});
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'https://lucid-path.vercel.app'],
    credentials: true
}));
// serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//API Endpoints
app.get('/', ( req, res ) => res.send("API working fine"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use("/api/moods", moodRoutes);
app.use('/api/journals', journalRoutes);
app.use("/api/providers", providerRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(port, () => {
    console.log(`Server running on PORT:${port}`);
});