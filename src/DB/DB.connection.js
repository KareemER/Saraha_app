import { mongoose } from "mongoose";

const mongoosedb = mongoose;

const DBconnection = async () => {
    try {
        await mongoosedb.connect(process.env.DB_URL_LOCAL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
}

export default DBconnection;