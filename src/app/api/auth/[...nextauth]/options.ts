import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import UserModel from "@/model/User";
import bcrypt from "bcrypt"
import dbConnect  from "@/lib/dbConnect";

export const nextAuthOptions : NextAuthOptions  = {
    providers: [
        CredentialsProvider({
          name: 'Credentials',
          credentials: {
            username: { label: "Email", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials: any) : Promise<any> {
            await dbConnect()
            try{
               const dbUser =  await UserModel.findOne({
                    $or: [
                        {email: credentials.identifier},
                        {username: credentials.identifier}
                    ]
                })
                if(!dbUser){
                    throw new Error("User does not exists")
                }
                if(!dbUser.isVerified){
                    throw new Error("User is not verified, please verify the user")
                }
                const isPasswordCorrect = await bcrypt.compare(credentials.password, dbUser.password)
                if(isPasswordCorrect){
                   return dbUser 
                }
                else{
                    throw new Error("Incorrect password")
                }


            }catch(error){
                throw new Error(error)
            }
      
            // If no error and we have user data, return it
           
            // Return null if user data could not be retrieved
            return null
          }
        })
      ],
    pages :{
        signIn: '/signin',
    },
    session : {
        strategy : "jwt"
    },
    secret : process.env.NEXTAUTH_SECRET,
    callbacks :  {
        async jwt({ token, user, account, profile, isNewUser }){
            if(user){
                token._id = user._id?.toString();
                token.isVerified  = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username
            }
            return token
          },
        async session({ session, user, token }) {
            if(token){
                session._id = user._id?.toString();
                session.isVerified  = user.isVerified;
                session.isAcceptingMessages = user.isAcceptingMessages;
                session.username = user.username 
            }
            return session
          }
    }
    
}