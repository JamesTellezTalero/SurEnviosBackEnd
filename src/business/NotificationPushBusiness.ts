import * as https from 'https';
import { getManager } from "typeorm";
import { Usuario } from '../entities/Usuario';
import { PushNotificationData } from "../entities/PushNotificationData";
import { Cliente } from '../entities/Cliente';

export class NotificationPushBusiness
{
    sendNotification(data) {
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic NWRmMmE5YjktN2E3NS00MTRjLWFhYjAtMGM1Mjk1MjBiYzUz"
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

    async Notificar(userId:number, idServicio:number, subTitle:string, messageText:string, status:string)
    {
        var pushData:Cliente = await getManager().getRepository(Cliente).findOne({where:{id:userId}});
        var message = { 
            app_id: "8153d12e-ee2a-4c92-ad57-cf6dd135c252",
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
                "idServicio":idServicio,
                "status":status
            },
            include_player_ids: [pushData.playerId]
        };
        this.sendNotification(message)
    }
}