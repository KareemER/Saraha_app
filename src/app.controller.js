import 'dotenv/config'
import express from "express";
import errorHandler from "./Middlewares/errorhandler.middleware.js";
import DBconnection from "./DB/DB.connection.js";
import usersController from "./Modules/Users/users.controller.js"
import messageController from "./Modules/Messages/messages.controller.js";
import cors from 'cors'
import helmet from 'helmet';
import { limiter } from './Middlewares/rate-limiter.middleware.js';

async function bootstrap() {
    const app = express();

    await DBconnection();

    app.use(express.json());

    const whitelist = process.env.WHITE_LISTED_ORIGINS ;
    const corsOption = {
        origin: function (origin, callback) {

            if (!origin || whitelist.includes(origin)) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        }
    }

    app.use(cors(corsOption) , helmet());
    app.use(limiter);

    app.use('/users', usersController);
    app.use('/messages', messageController);


    app.use((req, res, next) => {
        res.status(404).json({
            message: "router not found"
        })
    })

    app.use(errorHandler)

    app.listen(process.env.PORT, () => {
        console.log(`server is running on ${process.env.PORT}`);

    })
}

export default bootstrap;