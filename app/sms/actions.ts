"use server";

import {z} from 'zod';
import validator from 'validator';
import { redirect } from 'next/navigation';

const phoneSchema = z.string().trim().refine(validator.isMobilePhone,
    "Wrong phone format"
)
const tokenSchema = z.coerce.number().min(100000).max(999999);

interface ActionState {
    token:boolean
}

export async function smsVerification(prevState:ActionState,formData:FormData) {
    // console.log(typeof formData.get('token'));//sting
    // console.log(typeof tokenSchema.parse(formData.get('token')));//number
    const phone = formData.get("phone");
    const token = formData.get("token");
    
    if(!prevState.token) { // prevState.token이 false이면 해당 action을 처음 호출했다는 뜻
        //prevState.token =false는 유저가 현재 전화번호만 입력했다는 의미
        const result = phoneSchema.safeParse(phone);
        if(!result.success) {
            console.log(result.error.flatten())
            return {
                token:false,
                error:result.error.flatten()
            }
        } else {
            return {
                token:true,
            }
        }
    } else {
        const result = tokenSchema.safeParse(token);
        if(!result.success){
            return {
                token:true,
                error:result.error.flatten()
            }
        }else {
            redirect("/");
        }
    }
} 