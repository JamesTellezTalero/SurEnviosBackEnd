import { getManager, ViewColumn } from "typeorm";
import { CategoriaCamion } from "../entities/CategoriaCamion";
import { Departamento } from "../entities/Departamento";
import { EstadoServicio } from "../entities/EstadoServicio";
import { Municipio } from "../entities/Municipio";
import { TipoDocumento } from "../entities/TipoDocumento";
import { TipoPago } from "../entities/TipoPago";
import { TipoTripulante } from "../entities/TipoTripulante";
import { TipoVinculacion } from "../entities/TipoVinculacion";
import { Parametros } from "../models/Parametros";
import { Parametros as Params } from "../entities/Parametros";

export class ParametrosBusiness
{
    async GetParametros():Promise<Parametros>
    {
        var parametros:Parametros=new Parametros();
        parametros.ciudades=await getManager().getRepository(Municipio).find({relations:["idDepartamento", "regional"]});
        parametros.departamentos=await getManager().getRepository(Departamento).find();
        parametros.estadosServicio=await getManager().getRepository(EstadoServicio).find();
        parametros.categoriasCamion=await getManager().getRepository(CategoriaCamion).find({relations:["tipoCamions"]});
        parametros.tiposDocumento=await getManager().getRepository(TipoDocumento).find();
        parametros.tiposVinculacion=await getManager().getRepository(TipoVinculacion).find();
        parametros.tiposTripulante=await getManager().getRepository(TipoTripulante).find();
        parametros.tiposPago=await getManager().getRepository(TipoPago).find();
        parametros.parametros=await getManager().getRepository(Params).find();
        return parametros;
    }
}