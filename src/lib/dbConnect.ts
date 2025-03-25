import mongoose from "mongoose"

type ConnectionObject = {
    isConnected? : number 
}

const connection : ConnectionObject = {}

async function dbConnect() : Promise<void>{
    if(connection.isConnected){
        console.log("connection already established")
        return
    }
    try{
        const db = await mongoose.connect(process.env.MONGDB_URI || '', {})

        connection.isConnected = db.connections[0].readyState

        console.log("DB connection established successfully")

    }catch(error){
        console.log("error while connecting with db , error : ", error)
        process.exit(1)

    }
}
export default dbConnect;