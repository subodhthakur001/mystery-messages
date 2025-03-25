import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(2, "username should be more than 2 characters")
    .max(20, "username should be not more than 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Special characters are not allowed");

export const signUpSchema = z.object({
    username : usernameValidation,
    password: z.string().min(6, {message: "password should be atleast 6 characters long"}),
    email : z.string().email({message: "Invalid email address"})
})