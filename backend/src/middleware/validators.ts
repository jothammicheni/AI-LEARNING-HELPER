import { emailRegex } from "../utils/emailFormat";
const validateRegisterInputs = (    
    name: string,
    email: string,
    password: string) => {
    if (!name || !email || !password) {
        return "please fill all the fields"        
    }
    if (password.length < 6) {
       return "password must contain 6 charactors"
        
    }
    if (!email.match(emailRegex)) {
        return "Enter a valid email" 
        
    }
    return null
}


const validateLoginInputs = (
    email: string,
    password: string
): string | null => {
    if (!email || !password) {
        return "Please fill all the fields";
    }
    if (password.length < 6) {
        return "Password must contain at least 6 characters";
    }
    if (!email.match(emailRegex)) {
        return "Enter a valid email";
    }
    return null; // No errors
};
const validateCourseInput = (   
    title: string,
    description: String,
    coverPath: String

) => {

    if (!title || !description || !coverPath) {
        return   "please fill all the fields" 
       
    }
return null
}




export { validateRegisterInputs, validateLoginInputs,validateCourseInput }