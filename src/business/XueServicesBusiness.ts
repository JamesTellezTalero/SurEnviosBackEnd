import * as fs from "fs";
import * as pdf from "pdf-creator-node";
import { getManager } from "typeorm";
import { Parametros } from "../entities/Parametros";
import { XueService } from "../models/XueService";
import { EmailBusiness } from "./EmailBusiness";

const soap = require('strong-soap').soap;

export class XueServiceBusiness
{
    async CreatePdf(servicio:XueService, emailRemitente:string, emailDestinatario:string)
    {
      var parametro=await getManager().getRepository(Parametros).findOne({where:{parametro:"pathImages"}})
        var path="";
        if(parametro!=null)
        {
            path=parametro.value;
        }
        var filepath=path+servicio.NGuiaP+".pdf";
        var emailB=new EmailBusiness();
        var html=fs.readFileSync(__dirname+"/../templates/pdfTemplate.html","utf8");
        var options = {
            format: "A3",
            orientation: "portrait",
            border: "2mm"            
        };
        var document = {
            html: html,
            data: {
              servicio: servicio,
            },
            path: filepath,
            type: "",
          };
          pdf.create(document, options)
          .then((res)=>{
              console.log(res);
              emailB.SendMailWithFile(emailRemitente,"Pendiente","Pendiente",filepath)
              emailB.SendMailWithFile(emailDestinatario, "Pendiente","Pendiente",filepath);
          })
          .catch((error) => {
            console.error(error);
          });
    }
	
	async ConsultarGuia(request) {
    fs.writeFile(`./Logs/LogWtpChatbot.log`, JSON.stringify(request), function () {
      //console.log("Done");
    });

    var options = {
      wsdl_options: {
        forever: true,
        rejectUnauthorized: false,
        strictSSL: false,
      }
    };

    return new Promise((resolve, reject) => {
      soap.createClient(`https://ws-xue.surenvios.com.co/Service.asmx?wsdl`, options, function (err, client) {
        //var customRequestHeader = { 'Content-Type': 'application/soap-xml' };
        if (err) {
          console.log("Entre al error creando el cliente.");
        }
        var dateNow = new Date();
        var codKey = (dateNow.getFullYear() + dateNow.getMonth() + 1) * dateNow.getDate();
        console.log(codKey);
        client.ImpGuia({ nGuia: request.senderMessage.trim(), xkey: codKey }, function (err, result, rawResponse, soapHeader, rawRequest) {
          if (err) {
            console.log("Entre al error de consumo");
            reject(err);
          }
          if (typeof result.ImpGuiaResult.diffgram == 'undefined') {
            resolve("El numero de guía que ingreso no se encuentra en el sistema, Por favor verifique la información.");
          } else {
            var loQueNecesito = result.ImpGuiaResult.diffgram.NewDataSet.tbpsuper;
            console.log(loQueNecesito);
            var string = `${request.senderName}, los detalles tú envío son:

*Remitente:* ${loQueNecesito.Nom_Remitente}
*Destinatario:* ${loQueNecesito.Nom_Destinatario}
*Origen:*  ${loQueNecesito.CiudadOrigen.split("-")[1].trim()} 
*Destino:*  ${loQueNecesito.CiudadDestino.split("-")[1].trim()} 
*Estado:* ${loQueNecesito.Des_EstadoG}. 

Para obtener mas información sobre tu envio ingresa a:
https://xue.surenvios.com.co/cliente/ConsultorWs.aspx?ID=${loQueNecesito.GuiaSelect}`;
            resolve(string);
          }
        })
      });
    });
  }
}