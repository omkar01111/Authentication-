import nodemailer from 'nodemailer'
import dotenv from 'dotenv'


dotenv.config();

const transpoter=nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    }
 
    
})




export default transpoter;  
