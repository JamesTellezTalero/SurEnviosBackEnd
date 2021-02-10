import { createHash } from "crypto";
import { getManager } from "typeorm";
import { Usuario } from "../entities/Usuario";
import { EmailBusiness } from "./EmailBusiness";

export class UsuarioBusiness
{
    Login(Email:string, Clave:string):Promise<Usuario> {
        var data = getManager().getRepository(Usuario).findOne({ 
            where: {
                email:Email,
                password:Clave
            }
        });
        return data;
    }

    async CreatePerfil(newUser:Usuario):Promise<Usuario>
    {
        var exist = await getManager().getRepository(Usuario).findOne({where : {email : newUser.email}});
        if(exist!=null)
            return null;
        var data = getManager().getRepository(Usuario).save(newUser);
        return data;
    }

    GetPerfil(Id:number):Promise<Usuario> { 
        var data = getManager().getRepository(Usuario).findOne({
            where:{Id:Id}
        });
        return data;
    }

    async UpdatePerfil(perfil:Usuario):Promise<boolean>
    {
        var currentUser = await getManager().getRepository(Usuario).findOne({where:{ Id:perfil.id }});
        if(currentUser!=null)
        {
            currentUser.password=perfil.password==null?currentUser.password:perfil.password;
            currentUser.email=perfil.email==null?currentUser.email:perfil.email;
            currentUser.activo=perfil.activo==null?currentUser.activo:perfil.activo;
            currentUser.nombres=perfil.nombres==null?currentUser.nombres:perfil.nombres;
            currentUser.apellidos=perfil.apellidos==null?currentUser.apellidos:perfil.apellidos;
            currentUser.telefono=perfil.telefono==null?currentUser.telefono:perfil.telefono;
            getManager().getRepository(Usuario).save(perfil);
            return true;
        }
        else
            return false;
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
        var exist = await getManager().getRepository(Usuario).findOne({where : {email : Email}});
        if(exist)
        {
            var newPwd=this.MakePwd(10);
            exist.password=createHash('md5').update(newPwd).digest("hex");
            getManager().getRepository(Usuario).save(exist);
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
}