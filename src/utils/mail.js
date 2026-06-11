import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
     const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Task Manager",
            link: "https://taskmanagerlink.com"
        }
     })
    const emailTextual = mailGenerator.generatePlaintext
    (options.mailgenContent);

    const emailHTML = mailGenerator.generate(options.mailgenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USERNAME,
            pass: process.env.MAILTRAP_SMTP_PASSWORD
        }
    })

    const mail = {
        from: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHTML
    }

    try{
        await transporter.sendMail(mail);
    } catch(error){
        console.error("Error sending email,Make sure you have provided correct credentials :", error);
    }
};

const emailVerificationMailgenContent = (username,
    verificationUrl) => {
        return {
            body : {
                name: username,
                intro: "Welcome to our App! We're excited to have you on board.",
                action: {
                    instructions: "To verify your email please click on the following button",
                    button: {
                        color: "#22BC66",
                        text: "Verify your Email",
                        link: verificationUrl
                    }
                },
                outro: "Need help? Just reply to this email, we're always happy to help."
            }
        }
};

const forgotPasswordMailgenContent = (username, resetPasswordUrl) => {
        return {
            body : {
                name: username,
                intro: "You have requested to reset your password. Please click on the button below to proceed.",
                action: {
                    instructions: "To reset your password, please click on the button below",
                    button: {
                        color: "#22BC66",
                        text: "Reset your Password",
                        link: resetPasswordUrl
                    }
                },
                outro: "If you didn't request this, please ignore this email."
            }
        };
};

export { emailVerificationMailgenContent , forgotPasswordMailgenContent, sendEmail }; 
        