import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MongoDB Connected: DB HOST:" + connectionInstance.connection.host);
    } catch (error) {
        console.log("MONGO DB CONNECTION ERROR:", error);
        process.exit(1);
    }
}
export { connectDB };
// This code defines a function `connectDB` that connects to a MongoDB database using Mongoose. It attempts to connect to the database specified by the `MONGODB_URI` environment variable and the `DB_NAME` constant.