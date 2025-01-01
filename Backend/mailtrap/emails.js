import { PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailTemplates.js"
import { MailtrapClients,sender} from "./mailtrap.config.js";


export const sendVarificationEmail= async(email,verificationToken)=>{
    const recipient=[{email}]
  
    

    try {
        const response=await MailtrapClients.send({
           from:sender,
           to:recipient,
           subject:"Please verify your email",
           html:VERIFICATION_EMAIL_TEMPLATE.replace(`{verificationCode}`,verificationToken),
           category:"Verification Email"
        })
        
        
    } catch (error) {
        console.error(`Errror sending varification ` ,error);
        throw new Error(`Error sending email:${error}`);
        
    }
}

export const sendWelcomeEmail=async(email,name)=>{
const recipient=[{email}]

try {
    await MailtrapClients.send({
        from:sender,
        to:recipient,
        template_uuid:"a20ba34d-7571-4256-9a6e-a5403e030fe2",
        template_variables: {
            "company_info_name": "Laxumi Chitfund ",
            "name": "ek din mai pisa dubale",
            "company_info_address": "Test_Company_info_address",
            "company_info_city": "Test_Company_info_city",
            "company_info_zip_code": "Test_Company_info_zip_code",
            "company_info_country": "Test_Company_info_country"
          }
    })

} catch (error) {
    
}
}

export const sendResetPasswordEmail=async(email,resetURL)=>{
    const recipient=[{email}];

    try {
        const response=await MailtrapClients.send({
            from:sender,
            to:recipient,
           subject:"Reset your password",
           html:PASSWORD_RESET_REQUEST_TEMPLATE.replace(`{resetURL}`, resetURL),
           category:"Reset Password"
        })
    } catch (error) {
        throw new Error(`Error sending email:${error}`);
        
    }
}