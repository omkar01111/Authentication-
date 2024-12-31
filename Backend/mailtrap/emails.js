import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
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