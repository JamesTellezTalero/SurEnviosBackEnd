import { CategoriaVehiculo } from "../entities/CategoriaVehiculo";
import { Departamento } from "../entities/Departamento";
import { EstadoServicio } from "../entities/EstadoServicio";
import { Municipio } from "../entities/Municipio";
import { TipoDocumento } from "../entities/TipoDocumento";
import { TipoPago } from "../entities/TipoPago";
import { TipoTripulante } from "../entities/TipoTripulante";
import { TipoVinculacion } from "../entities/TipoVinculacion";
import { Parametros as Params } from "../entities/Parametros";
import { TipoElementoRegistro } from "../entities/TipoElementoRegistro";
import { TipoServicio } from "../entities/TipoServicio";

export class Parametros
{
    ciudades:Municipio[];

    departamentos:Departamento[];

    estadosServicio:EstadoServicio[];

    categoriasVehiculo:CategoriaVehiculo[];

    tiposDocumento:TipoDocumento[];

    tiposVinculacion:TipoVinculacion[];

    tiposTripulante:TipoTripulante[];

    tiposPago:TipoPago[];

    tiposElemento:TipoElementoRegistro[];

    tiposServicio:TipoServicio[];

    parametros:Params[];

}