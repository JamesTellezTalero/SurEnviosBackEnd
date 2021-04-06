import * as https from 'https';
import { getManager } from "typeorm";
import { Usuario } from '../entities/Usuario';
import { PushNotificationData } from "../entities/PushNotificationData";

export class NotificationPushBusiness
{
    sendNotification(data) {
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic YTczMDM0ZjAtM2FjZi00MGU0LWE2MGEtNzBjNzZkMWFmMDI1"
        };
        
        var options = {
          host: "onesignal.com",
          port: 443,
          path: "/api/v1/notifications",
          method: "POST",
          headers: headers
        };
        
        
        var req = https.request(options, function(res) {  
            res.setEncoding('utf8');
            res.on('data', function(data) {
                console.log("Response:");
                console.log(data);
            });
        });
        
        req.on('error', function(e) {
          console.log("ERROR:");
          console.log(e);
        });
        
        req.write(JSON.stringify(data));
        req.end();
    }      

    async Notificar(userId:number, idPedido:number, subTitle:string, messageText:string, status:string)
    {
        var pushData:PushNotificationData = await getManager().getRepository(PushNotificationData).findOne({where:{idUser:userId}});
        var message = { 
            app_id: "976c3ce5-03da-44d5-bac2-2edf890a5b4f",
            headers:{
                "es" : "SEApp", 
                "en":"SEApp"
            },
            subtitle:{
                "es" : subTitle, 
                "en" : subTitle
            },
            contents: {
                "es" : messageText,
                "en" : messageText
            },
            data:{
                "idPedido":idPedido,
                "status":status
            },
            include_player_ids: [pushData.pushId]
        };
        this.sendNotification(message)
    }
}