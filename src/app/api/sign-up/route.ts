import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt"
import { hash } from "crypto";

export async function Post(request: Request){
    await dbConnect()

    try {
        const {email, username , password} = await request.json()
        const existingUserByUsername = await UserModel.findOne({
            username : username,
            isVerified : true
        });
        if(existingUserByUsername){
            return Response.json({
                success : false,
                message : "User exists already"
            },{
                status : 500
            })
        }  
        const existingUserByEmail = await UserModel.findOne({
            email : email
        }) 
        const HashedPassword = await makeHashPassword(password);
        const verifyCode = generateOTP();
        if(existingUserByEmail){
            if(!existingUserByEmail.isVerified){
                return Response.json({
                    success : false,
                    message : "Error registering user"
                },{
                    status : 500
                })
            }
            else{
                
                existingUserByEmail.password = HashedPassword;
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }
        else{
            const expiryDate = new Date();
            const newUser = new UserModel({
                username,
                email,
                password : HashedPassword,
                verifyCode : verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [], 
            })
            await newUser.save();
        }
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if(!emailResponse.success){
            return Response.json({
                success : false,
                message : "Error registering user"
            },{
                status : 500
            })
        } 
        return Response.json({
            success : true,
            message : "User registered successfully , Please verify your email"
        },{
            status : 500
        })
    
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

async function makeHashPassword(password : string) : Promise<string>{
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
}

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function createExpiry(): Date{
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1)
    return expiryDate
}