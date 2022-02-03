import { createHash } from "crypto";
import { getManager } from "typeorm";
import { FotoDocumento } from "../entities/FotoDocumento";
import { Parametros } from "../entities/Parametros";
import { TipoDocUsuario } from "../entities/TipoDocUsuario";
import { Usuario } from "../entities/Usuario";
import { UsuarioPos } from "../entities/UsuarioPos";
import { EmailBusiness } from "./EmailBusiness";
import { writeFile, writeFileSync  } from 'fs';
import { Persona } from "../entities/Persona";
import { Vehiculo } from "../entities/Vehiculo";

export class UsuarioBusiness
{
    Login(Email:string, Clave:string):Promise<Usuario> {
        var data = getManager().getRepository(Usuario).findOne({ 
            where: {
                userName:Email,
                password:Clave
            },
            relations:["vehiculos","vehiculos.idTipoVehiculo","vehiculos.idTipoVinculacion","usuarioPos","vehiculos.tripulanteVehiculos","idPersona","idPersona.idTipoDocumento","idPerfil", "idEstadoUsuario"]
        });
        return data;
    }

    async CreatePerfil(newUser:Usuario):Promise<Usuario>
    {
        var exist = await getManager().getRepository(Usuario).findOne({where : {userName : newUser.userName}});
        if(exist!=null)
            return null;
        var persona = await getManager().getRepository(Persona).save(newUser.idPersona);
        newUser.idPersona=persona;
        var data = await getManager().getRepository(Usuario).save(newUser);
        newUser.vehiculos.forEach(async item => {
            item.idUsuario=newUser;
            item = await getManager().getRepository(Vehiculo).save(item);
        });
        return this.GetPerfil(data.id);
    }

    GetPerfil(Id:number):Promise<Usuario> { 
        var data = getManager().getRepository(Usuario).findOne({
            where:{id:Id},
            relations:["vehiculos","vehiculos.idTipoVehiculo","vehiculos.idTipoVinculacion","usuarioPos","vehiculos.tripulanteVehiculos","idPersona","idPersona.idTipoDocumento", "idPerfil", "idEstadoUsuario"]
        });
        return data;
    }

    async UpdatePerfil(perfil:Usuario):Promise<boolean>
    {
        var currentUser = await getManager().getRepository(Usuario).findOne({where:{ id:perfil.id },relations:["idPersona"]});
        if(currentUser!=null)
        {
            currentUser.userName=perfil.userName==null?currentUser.userName:perfil.userName;
            currentUser.password=perfil.password==null?currentUser.password:perfil.password;
            currentUser.xueUserCode=perfil.xueUserCode==null?currentUser.xueUserCode:perfil.xueUserCode;
            //currentUser.activo=perfil.activo==null?currentUser.activo:perfil.activo;
            currentUser.idPersona=perfil.idPersona==null?currentUser.idPersona:perfil.idPersona;
            getManager().getRepository(Usuario).save(perfil);
            return true;
        }
        else
            return false;
    }

    async UploadFotoDocumento(img:string, imgName:string, idTipoDoc:number, idUsuario:number)
    {
        var parametro=await getManager().getRepository(Parametros).findOne({where:{parametro:"pathImages"}})
        var path="";
        if(parametro!=null)
        {
            path=parametro.value;
        }
        var fotoDocumento = await getManager().getRepository(FotoDocumento).findOne({where:{idTipo:idTipoDoc, idUsuario:idUsuario}});
        if(fotoDocumento == null)
            fotoDocumento = new FotoDocumento();
        
        fotoDocumento.filename=imgName;
        fotoDocumento.idTipo=await getManager().getRepository(TipoDocUsuario).findOne({where:{id:idTipoDoc}});
        fotoDocumento.idUsuario=await getManager().getRepository(Usuario).findOne({where:{id:idUsuario}});
        fotoDocumento=await getManager().getRepository(FotoDocumento).save(fotoDocumento);
        
        var filename=path+'img'+fotoDocumento.idUsuario.id+'-'+idTipoDoc+'-'+Date.now()+'.jpg';
        var imagen=img.split('-').join('+').split('.').join('=');
        let buff = new Buffer(imagen, 'base64');  
        writeFileSync(filename, buff);
        
        
        return fotoDocumento;
    }

    UpdatePassword(Id:number, NewPassword:string) {
        var data=getManager().getRepository(Usuario).findOne({id:Id});
        data.then((result) => {
            if(result != null)
            {
                result.password = NewPassword;
                getManager().getRepository(Usuario).save(result);
            }
        });
    }

    async RecoverPassword(Email:string):Promise<boolean>
    {
        var exist = await getManager().getRepository(Persona).findOne({where : {email : Email}, relations:["usuarios"]});
        if(exist!= null && exist.usuarios.length==1)
        {
            var newPwd=this.MakePwd(10);
            exist.usuarios[0].password=createHash('md5').update(newPwd).digest("hex");
            getManager().getRepository(Usuario).save(exist.usuarios[0]);
            var message=""+exist.nombres+"\n\r A continuación le enviamos su nueva contraseña: \n\r"+newPwd;
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

    async UpdatePos(id:number, lat:number, lon:number)
    {
        var curPos=await getManager().getRepository(UsuarioPos).findOne({where:{idUsuario:id}});
        if(curPos==null)
        {
            curPos=new UsuarioPos();
            curPos.idUsuario=id;
        }
        curPos.lat=lat;
        curPos.lon=lon;
        getManager().getRepository(UsuarioPos).save(curPos);
        
    }

    async GetUsuarioPos(id:number)
    {
        var curPos=await getManager().getRepository(UsuarioPos).findOne({where:{idUsuario:id}});
        if(curPos==null)
        {
            curPos=new UsuarioPos();
            curPos.idUsuario=id;
            curPos.lat = 0;
            curPos.lon = 0;
        }
        curPos = await getManager().getRepository(UsuarioPos).save(curPos);
        return curPos;
    }
}