import { NextRequest } from "next/server";

export async function  GET(request:NextRequest) {
    console.log(request)
    return Response.json({
        ok:true
    });
} 

// cookie 확인과 DB data를 확인하여 로그인을 진행할지를 판단한다.
export async function  POST(request:NextRequest) {
    //request.cookies.get("");
    const data = await request.json();
    return Response.json(data);      
}