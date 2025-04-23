"use server";
import { z } from "zod";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";

const formSchema = z.object({
    loginEmail:z.string().email().toLowerCase(),
    loginPassword:z.string({
      required_error: "Password is required",
    }).min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
})

export async function login(prevState:any,formData: FormData) {
    const data = {
        loginEmail:formData.get('loginEmail'),
        loginPassword:formData.get('loginPassword'),
    };

    console.log(data);
    const result = formSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    }else{
        console.log(result.data);
    }
} 