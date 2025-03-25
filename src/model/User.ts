
import mongoose, {Schema, Document} from "mongoose"

export interface Message extends Document{
    content : string,
    createdAt : Date
}

const MessageSchema : Schema<Message> = new Schema({
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    }

})


export interface User extends Document {
    username : string,
    password : string,
    email : string,
    verifyCode : string,
    isVerified : boolean,
    verifyCodeExpiry : Date,
    isAcceptingMessage : boolean,
    messages : Message[]
}

const UserSchema : Schema<User> = new Schema({
    username : {
        type : String,
        required : [true, "username is required"],
        trim : true,
        unique : true,
    },
    password : {
        type : String,
        required : [true, "password is required"],
        unique : true,
    },
    verifyCode : {
        type : String,
        required : [true, "verify code is required"],
        unique : true
    },
    isVerified : {
        type : Boolean,
        default : false   
    },
    verifyCodeExpiry : {
        type : Date,
        required : [true, "verified code expiration is required"]
    },
    isAcceptingMessage : {
        type : Boolean,
        default : true
    },
    messages : [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || 
(mongoose.model<User>("User", UserSchema))

export default UserModel;
