import * as fs from "fs";
import * as pdf from "pdf-creator-node";
import { XueService } from "../models/XueService";
import { EmailBusiness } from "./EmailBusiness";

export class XueServiceBusiness
{
    async CreatePdf(servicio:XueService, email:string)
    {
        var filepath="./"+servicio.NGuiaP+".pdf";
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
              emailB.SendMailWithFile(email, "Pendiente","Pendiente",filepath);
          })
          .catch((error) => {
            console.error(error);
          });
    }
}