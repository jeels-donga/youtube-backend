import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionString = `${process.env.MONGO_URI}/${DB_NAME}`;
        console.log(`Connecting to: ${connectionString.replace(/\/\/([^:]+):([^@]+)@/, "// $1:****@")}`);
        const connectionInstance = await mongoose.connect(connectionString)
        console.log(`\n MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("ERROR: ", error);
        throw error
    }
}
export default connectDB