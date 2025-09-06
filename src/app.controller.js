import 'dotenv/config'
import express from "express";
import errorHandler from "./Middlewares/errorhandler.middleware.js";
import DBconnection from "./DB/DB.connection.js";
import usersController from "./Modules/Users/users.controller.js"
import messageController from "./Modules/Messages/messages.controller.js";

async function bootstrap() {
    const app = express();

    await DBconnection();

    app.use(express.json());

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