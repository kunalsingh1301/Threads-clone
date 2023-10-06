import mongoose from 'mongoose'

let isConnected = false;

export const connectToDB = async ()=> {
    mongoose.set('strictQuery',true)

    if(!process.env.MONGODB_URL) return console.log('MongoDB_url not found')

    if(isConnected) return console.log('Already connected to MONGODB')

    try {
        await mongoose.connect(process.env.MONGODB_URL)
    } catch (error) {
        console.log(error)
    }
}