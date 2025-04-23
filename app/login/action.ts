"use server";

//const handleForm = async(data:FormData) => {
export async function handleForm(prevState:any,formData:FormData) { 
    // console.log(data.get("formEmail"), data.get("formPassword"))
    // console.log("i run in the Server baby!!")

    await new Promise((reslove)=> setTimeout(reslove, 5000))

    // redirect("/");

    return {
        errors:['wrong password']
    }
} 