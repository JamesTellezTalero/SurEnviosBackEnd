import { createTransport } from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
export class EmailBusiness
{
    SendMail(to:string, subject:string, message:string)
    {
        var mailer= createTransport({
            service:"gmail",
            auth:{
                user:"serviciosrational@gmail.com",
                pass:"$lcs1648_*"
            }
        });

        var mailOpt={
            from : "serviciosrational@gmail.com",
            to : to,
            subject : subject,
            text : message
        };

        mailer.sendMail(mailOpt,function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });
    }

    SendMailWithFile(to:string, subject:string, message:string, filepath:string)
    {
        var mailer= createTransport({
            service:"gmail",
            auth:{
                user:"serviciosrational@gmail.com",
                pass:"$lcs1648_*"
            }
        });

        var mailOpt={
            from : "serviciosrational@gmail.com",
            to : to,
            subject : subject,
            text : message,
            attachments:[{path:filepath}]
        };

        mailer.sendMail(mailOpt,function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });
    }
}
