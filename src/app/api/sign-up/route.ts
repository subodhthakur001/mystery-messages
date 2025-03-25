import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt"

export async function Post(request: Request){
    await dbConnect()

    try {
        const {email, username , password} = await request.json()
        const existingUser = await UserModel.findOne({email : email});
        if(existingUser){
            if(!existingUser.isVerified){
                return Response.json({
                    success : false,
                    message : "User is not verified"
                },{
                    status : 500
                })
            }
            else{

            }
        }
        else{
            const newUser = new UserModel({
                email : email,
                password
            })
        }

    }catch(error){
        console.log("Error registering user: ", error)
        return Response.json({
            success : false,
            message : "Error registering user"
        },{
            status : 500
        })
    }
}