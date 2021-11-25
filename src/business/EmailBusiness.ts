const nodemailer = require('nodemailer');
const { google } = require('googleapis');



export class EmailBusiness
{
    CLIENT_EMAIL = process.env.REACT_APP_EMAIL; 
    CLIENT_ID = process.env.REACT_APP_EMAIL_CLIENT_ID; 
    CLIENT_SECRET = process.env.REACT_APP_EMAIL_CLIENT_SECRET; 
    REDIRECT_URI = process.env.REACT_APP_EMAIL_CLIENT_REDIRECT_URI; 
    REFRESH_TOKEN = process.env.REACT_APP_EMAIL_REFRESH_TOKEN;

    async SendMail(to:string, subject:string, message:string)
    {       
        const oauthClient = new google.auth.OAuth2(
            this.CLIENT_ID,
            this.CLIENT_SECRET,
            this.REDIRECT_URI,
        );

        oauthClient.setCredentials({refresh_token:"1//04Prf6taOQPKuCgYIARAAGAQSNwF-L9IrfomaHdghV988iRe5uQD1uWn7xi-vf0pbv4Amc8NW4tSaWnNqeiNYPK3BSfVjH1suhEk"});
        var accessToken = oauthClient.getAccessToken();        
        var mailer = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: this.CLIENT_EMAIL,
              clientId: this.CLIENT_ID,
              clientSecret: this.CLIENT_SECRET,
              refreshToken: this.REFRESH_TOKEN,
              accessToken: accessToken,
            },
        });

        var mailOpt = {
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

    GetAuthToken()
    {
        
    }

    SendMailWithFile(to:string, subject:string, message:string, filepath:string)
    {
        const oauthClient = new google.auth.OAuth2(
            this.CLIENT_ID,
            this.CLIENT_SECRET,
            this.REDIRECT_URI,
        );

        oauthClient.setCredentials({refresh_token:"1//04Prf6taOQPKuCgYIARAAGAQSNwF-L9IrfomaHdghV988iRe5uQD1uWn7xi-vf0pbv4Amc8NW4tSaWnNqeiNYPK3BSfVjH1suhEk"});
        var accessToken = oauthClient.getAccessToken();        
        var mailer = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: this.CLIENT_EMAIL,
              clientId: this.CLIENT_ID,
              clientSecret: this.CLIENT_SECRET,
              refreshToken: this.REFRESH_TOKEN,
              accessToken: accessToken,
            },
        });

        var mailOpt = {
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
