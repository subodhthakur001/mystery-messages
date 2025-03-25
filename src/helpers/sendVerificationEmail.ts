import { resend } from "@/lib/resend";
import VerificationEmail from "../../mails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email : string,
    username : string,
    verifyCode : string
) : Promise<ApiResponse> {
    try{
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Messages | Otp Verification',
            react: VerificationEmail({username, otp: verifyCode})
          });
        return {success: false , message : "failed to send email"}
    }
    catch(error)
    {
        return {success: false , message : "failed to send email"}
    }
}