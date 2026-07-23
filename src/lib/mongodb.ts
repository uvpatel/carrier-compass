import mongoose from "mongoose";


export default async function ConnectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!)

        console.log('MongoDB Connected')
    } catch (error) {
        console.log(error, 'Mongodb connection Failed')
        process.exit(1)
    }
    
}