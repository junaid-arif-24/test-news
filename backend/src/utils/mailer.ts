import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const brevoApiKey = process.env.BREVO_API_KEY as string;
const appUrl = process.env.APP_URL;

export const sendRegistrationWelcomeEmail = async (email: string, name: string) => {
    console.log("Entered sendRegistrationWelcomeEmail", brevoApiKey);

   try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email',{
        sender: { email: 'junaidarif7078@gmail.com', name: 'Shot News' },
    to: [{ email, name }],
    subject: 'Welcome to Shot News!',
    textContent: `Hello ${name}, ...`,
    htmlContent: `<div> ... </div>`,
    },
    {
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
        },
    }

)
console.log(response);
    
   } catch (error) {

    console.error('Error sending registration welcome email:', error);
    
   }
  
}

export const sendLoginWelcomeEmail = async (email: string, name: string) => {
    console.log("Entered sendLoginWelcomeEmail", brevoApiKey);

    try {
        const response = await axios.post('https://api.brevo.com/v3/smtp/email',{
            sender: { email: 'junaidarif7078@gmail.com', name: 'Shot News' },
        to: [{ email, name }],
        subject: 'Welcome to Shot News!',
        textContent: `Hello ${name}, ...`,
        htmlContent: `<div> ... </div>`,
        },
        {
            headers: {
              'api-key': brevoApiKey,
              'Content-Type': 'application/json',
            },
        }
    
    )
    console.log(response);
        
       } catch (error) {
    
        console.error('Error sending registration welcome email:', error);
        
       }
}  