import { createHash } from "crypto";
import { getManager } from "typeorm";
import { Cliente } from "../entities/Cliente";
import { Servicio } from "../entities/Servicio";
import { EmailBusiness } from "./EmailBusiness";

export class ClienteBusiness{
    Login(Email:string, Clave:string):Promise<Cliente> {
        var data = getManager().getRepository(Cliente).findOne({ 
            where: {
                email:Email,
                password:Clave
            },
            relations:[
                "idCiudad",
                "idTipoDocumento",
                //"servicios"
            ]
        });
        return data;
    }

    async CreatePerfil(newUser:Cliente):Promise<Cliente>
    {
        var exist = await getManager().getRepository(Cliente).findOne({where : {email : newUser.email}});
        if(exist!=null)
            return null;
        var data = getManager().getRepository(Cliente).save(newUser);
        return data;
    }

    GetPerfil(Id:number):Promise<Cliente> { 
        var data = getManager().getRepository(Cliente).findOne({
            where:{id:Id},
            relations:[
                "idCiudad",
                "idTipoDocumento",
                //"servicios"
            ]
        });
        return data;
    }

    async UpdatePerfil(perfil:Cliente):Promise<boolean>
    {
        var currentUser = await getManager().getRepository(Cliente).findOne({where:{ id:perfil.id }});
        if(currentUser!=null)
        {
            currentUser.password=perfil.password==null?currentUser.password:perfil.password;
            currentUser.direccion=perfil.direccion==null?currentUser.direccion:perfil.direccion;
            currentUser.numeroDocumento=perfil.numeroDocumento==null?currentUser.numeroDocumento:perfil.numeroDocumento;
            currentUser.email=perfil.email==null?currentUser.email:perfil.email;
            currentUser.estado=perfil.estado==null?currentUser.estado:perfil.estado;
            currentUser.idCiudad=perfil.idCiudad==null?currentUser.idCiudad:perfil.idCiudad;
            currentUser.nombre=perfil.nombre==null?currentUser.nombre:perfil.nombre;
            currentUser.playerId=perfil.playerId==null?currentUser.playerId:perfil.playerId;
            currentUser.pushToken=perfil.pushToken==null?currentUser.pushToken:perfil.pushToken;
            currentUser.celular=perfil.celular==null?currentUser.celular:perfil.celular;
            currentUser.idTipoDocumento=perfil.idTipoDocumento==null?currentUser.idTipoDocumento:perfil.idTipoDocumento;
            getManager().getRepository(Cliente).save(perfil);
            return true;
        }
        else
            return false;
    }

    async GetPerfilServicios(IdUsuario:number):Promise<Servicio[]> {
        var data = await getManager().getRepository(Servicio).find({ 
            where: { idCliente : IdUsuario }, 
            relations:["idTipoVehiculo","idCliente", "idCiudadOrigen","idCiudadDestino", "estadoServicio","pagos","registroServicios", "registroServicios.idEstadoServicio"] 
        });
        return data;
    }

    UpdatePassword(Id:number, NewPassword:string) {
        var data=getManager().getRepository(Cliente).findOne({id:Id});
        data.then((result) => {
            if(result != null)
            {
                result.password = NewPassword;
                getManager().getRepository(Cliente).save(result);
            }
        });
    }

    async RecoverPassword(Email:string):Promise<boolean>
    {
        var exist = await getManager().getRepository(Cliente).findOne({where : {email : Email}});
        if(exist)
        {
            var newPwd=this.MakePwd(10);
            exist.password=createHash('md5').update(newPwd).digest("hex");
            getManager().getRepository(Cliente).save(exist);
            var message=""+exist.nombre+"\n\r A continuación le enviamos su nueva contraseña: \n\r"+newPwd;
            new EmailBusiness().SendMail(exist.email,"Recuperación de contraseña",message);
            return true;
        }
        else
        {
            return false;
        }
    }

    MakePwd(length:number) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}