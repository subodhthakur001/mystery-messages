import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";

export const nextAuthOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const dbUser = await UserModel.findOne({
                        $or: [
                            { email: credentials.username },
                            { username: credentials.username }
                        ]
                    });

                    if (!dbUser) {
                        throw new Error("User does not exist");
                    }
                    if (!dbUser.isVerified) {
                        throw new Error("User is not verified, please verify the user");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, dbUser.password);
                    if (!isPasswordCorrect) {
                        throw new Error("Incorrect password");
                    }

                    return dbUser;
                } catch (error: any) {
                    throw new Error(error.message || "Authentication error");
                }
            }
        })
    ],
    pages: {
        signIn: "/signin",
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session._id = token._id;
                session.isVerified = token.isVerified;
                session.isAcceptingMessages = token.isAcceptingMessages;
                session.username = token.username;
            }
            return session;
        }
    }
};
