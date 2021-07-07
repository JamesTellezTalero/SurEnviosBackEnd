import { jsonMember, jsonObject } from "typedjson";

@jsonObject
export class XueService {
    @jsonMember
    Cliente:            string;
    @jsonMember
    nit:                string;
    @jsonMember
    direccion:          string;
    @jsonMember
    LineaAux:           string;
    @jsonMember
    web:                string;
    @jsonMember
    Column1:            string;
    @jsonMember
    Nom_Corto:          string;
    @jsonMember
    Column2:            string;
    @jsonMember
    ResMIN:             string;
    @jsonMember
    ResTrans:           string;
    @jsonMember
    Column3:            string;
    @jsonMember
    TipoGuia:           string;
    @jsonMember
    NGuiaP:             string;
    @jsonMember
    Admision:           string;
    @jsonMember
    Column4:            string;
    @jsonMember
    Column5:            string;
    @jsonMember
    CiudadOrigen:       string;
    @jsonMember
    id_Remitente:       string;
    @jsonMember
    Nom_Remitente:      string;
    @jsonMember
    Dir_Remitente:      string;
    @jsonMember
    Tel_Remitente:      string;
    @jsonMember
    Column6:            string;
    @jsonMember
    Column7:            string;
    @jsonMember
    CiudadDestino:      string;
    @jsonMember
    id_Destinatario:    string;
    @jsonMember
    Nom_Destinatario:   string;
    @jsonMember
    Dir_Destinatario:   string;
    @jsonMember
    Tel_Destinatario:   string;
    @jsonMember
    Column8:            string;
    @jsonMember
    Column9:            string;
    @jsonMember
    Dice_Contener:      string;
    @jsonMember
    Num_Documentos:     string;
    @jsonMember
    Texto_Guia:         string;
    @jsonMember
    Accion_NotaGuia:    string;
    @jsonMember
    Num_Unidades:       string;
    @jsonMember
    PesoReal_K:         string;
    @jsonMember
    PesoVolumen_K:      string;
    @jsonMember
    K_Cobrados:         string;
    @jsonMember
    Valor_Declarado:    string;
    @jsonMember
    Valor_Flete:        string;
    @jsonMember
    Valor_CostoM:       string;
    @jsonMember
    Valor_Otros:        string;
    @jsonMember
    TotFlete:           string;
}